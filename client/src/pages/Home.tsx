import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { type Job, type Announcement } from "@shared/schema";
import { useTheme } from "@/components/ThemeProvider";
import { JobCard } from "@/components/JobCard";
import { JobApplicationModal } from "@/components/JobApplicationModal";
import { AnnouncementCard } from "@/components/AnnouncementCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Moon, Sun, User, Rocket, Play, Code, Shield, 
  ExternalLink, Info, MapPin, Phone, Mail,
  Twitter, Linkedin, Github, Send 
} from "lucide-react";
import goodluckLogo from "@assets/logo_1753537420720.png";

const jobCategories = [
  { id: "all", label: "All Positions" },
  { id: "engineering", label: "Engineering" },
  { id: "design", label: "Design" },
  { id: "product", label: "Product" },
  { id: "marketing", label: "Marketing" },
];

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [selectedJobCategory, setSelectedJobCategory] = useState("all");
  
  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  


  const { data: jobs = [] } = useQuery<Job[]>({
    queryKey: ["/api/jobs"],
  });

  const { data: announcements = [] } = useQuery<Announcement[]>({
    queryKey: ["/api/announcements"],
  });

  const filteredJobs = jobs.filter(job => 
    selectedJobCategory === "all" || 
    job.department.toLowerCase() === selectedJobCategory.toLowerCase()
  );

  // Contact form mutation
  const contactMutation = useMutation({
    mutationFn: async (formData: typeof contactForm) => {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Reset form
      setContactForm({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      alert('Message sent successfully! We\'ll get back to you soon.');
    },
    onError: (error) => {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    },
  });

  const handleApplyToJob = (job: Job) => {
    setSelectedJob(job);
    setIsApplicationModalOpen(true);
  };

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  const handleContactFormChange = (field: keyof typeof contactForm, value: string) => {
    setContactForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleContactFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!contactForm.name || !contactForm.email || !contactForm.subject || !contactForm.message) {
      alert('Please fill in all fields');
      return;
    }
    
    contactMutation.mutate(contactForm);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glassmorphism border-b border-white/20 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <img 
                src={goodluckLogo} 
                alt="Goodluck Technology Logo" 
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg"
              />
              <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">
                Goodluck
              </span>
            </div>
            
            <div className="hidden lg:flex items-center space-x-6">
              <button 
                onClick={() => scrollToSection('home')}
                className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors text-sm"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors text-sm"
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection('portfolio')}
                className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors text-sm"
              >
                Portfolio
              </button>
              <button 
                onClick={() => scrollToSection('jobs')}
                className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors text-sm"
              >
                Jobs
              </button>
              <button 
                onClick={() => scrollToSection('announcements')}
                className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors text-sm"
              >
                News
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors text-sm"
              >
                Contact
              </button>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 h-8 w-8 sm:h-10 sm:w-10"
              >
                {theme === "light" ? (
                  <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </Button>
              <Button 
                onClick={() => scrollToSection('jobs')}
                className="btn-gradient text-white text-sm px-3 py-2 sm:px-4 sm:py-2"
              >
                <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Join Us</span>
                <span className="sm:hidden">Join</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10"></div>
        
        {/* Floating elements - hidden on mobile */}
        <div className="hidden md:block absolute top-20 left-10 w-20 h-20 bg-purple-500/20 rounded-full animate-float"></div>
        <div className="hidden md:block absolute top-40 right-20 w-16 h-16 bg-cyan-500/20 rotate-45 animate-float" style={{animationDelay: "2s"}}></div>
        <div className="hidden md:block absolute bottom-40 left-20 w-12 h-12 bg-green-500/20 rounded-full animate-float" style={{animationDelay: "4s"}}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="mb-8 sm:mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mb-4 sm:mb-6 mt-2.5">
              <img 
                src={goodluckLogo} 
                alt="Goodluck Technology" 
                className="w-full h-full rounded-xl sm:rounded-2xl glow-effect"
              />
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight px-2">
              Next-Gen <span className="text-gradient bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">Blockchain</span><br />
              Development Studio
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4">
              Building the future of decentralized applications with cutting-edge Web3 technologies. 
              From DeFi protocols to Web3 metaverse battle royal gaming, we craft blockchain solutions that scale.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12 sm:mb-16 px-4">
            <Button 
              onClick={() => scrollToSection('portfolio')}
              className="btn-gradient text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg shadow-2xl w-full sm:w-auto"
            >
              <Rocket className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
              View Our Projects
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.location.href = 'mailto:goodlucklabs@gmail.com'}
              className="glassmorphism border-purple-500/30 hover:border-purple-500/60 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg w-full sm:w-auto"
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
              Contact Us
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 max-w-4xl mx-auto px-4">
            <Card className="glassmorphism border-white/20 dark:border-gray-700/30 card-hover">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gradient bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent mb-1 sm:mb-2">3+</div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Projects Delivered</div>
              </CardContent>
            </Card>
            <Card className="glassmorphism border-white/20 dark:border-gray-700/30 card-hover">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gradient bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent mb-1 sm:mb-2">$1.5M+</div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Total Value Locked</div>
              </CardContent>
            </Card>
            <Card className="glassmorphism border-white/20 dark:border-gray-700/30 card-hover">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gradient bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent mb-1 sm:mb-2">13+</div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Blockchain Networks</div>
              </CardContent>
            </Card>
            <Card className="glassmorphism border-white/20 dark:border-gray-700/30 card-hover">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gradient bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent mb-1 sm:mb-2">99.9%</div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Uptime</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Why Choose <span className="text-gradient bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">Goodluck Tech</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We're not just developers – we're blockchain architects crafting the infrastructure for tomorrow's digital economy.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="glassmorphism border-white/20 dark:border-gray-700/30 card-hover">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                  <Code className="text-white text-2xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Expert Development</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Our team of blockchain experts brings years of experience in Solana, Ethereum, and emerging protocols.
                </p>
              </CardContent>
            </Card>
            
            <Card className="glassmorphism border-white/20 dark:border-gray-700/30 card-hover">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center mb-6">
                  <Shield className="text-white text-2xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Security First</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Comprehensive security audits and best practices ensure your dApps are protected against vulnerabilities.
                </p>
              </CardContent>
            </Card>
            
            <Card className="glassmorphism border-white/20 dark:border-gray-700/30 card-hover">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6">
                  <Rocket className="text-white text-2xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Scalable Solutions</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Built for growth with optimized smart contracts and efficient blockchain architectures.
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Tech Stack */}
          <div className="text-center">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Our Tech Stack</h3>
            <div className="flex flex-wrap justify-center gap-6">
              {["Solana", "Ethereum", "Polygon", "Rust", "TypeScript", "React", "Web3.js"].map((tech) => (
                <Badge key={tech} className="glassmorphism border-white/20 dark:border-gray-700/30 px-6 py-3 text-lg">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Featured <span className="text-gradient bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">Projects</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Explore our latest blockchain innovations and decentralized applications.
            </p>
          </div>
          
          {/* Glider Project Showcase */}
          <Card className="glassmorphism border-white/20 dark:border-gray-700/30 mb-12 card-hover">
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center">
                <div className="order-2 lg:order-1">
                  <div className="flex items-center mb-4 sm:mb-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 mr-3 sm:mr-4 flex items-center justify-center flex-shrink-0">
                      <img 
                        src="/attached_assets/glider-bird-logo.png" 
                        alt="Glider Bird Logo" 
                        className="w-full h-full object-contain rounded-xl sm:rounded-2xl"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white truncate">Glider</h3>
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">The Future of Blockchain Interaction</p>
                    </div>
                  </div>
                  
                  <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 leading-relaxed">
                    A comprehensive blockchain interaction platform featuring multi-level encrypted messaging, 
                    decentralized social feeds, multi-chain wallet management, and integrated DEX functionality.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 sm:p-4">
                      <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gradient bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent mb-1">1K+</div>
                      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Community Members</div>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 sm:p-4">
                      <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gradient bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent mb-1">$2M+</div>
                      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Total Value Locked</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
                    <Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-none text-xs sm:text-sm px-2 sm:px-3 py-1">Multi-Chain</Badge>
                    <Badge className="bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-300 border-none text-xs sm:text-sm px-2 sm:px-3 py-1">Social DeFi</Badge>
                    <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-none text-xs sm:text-sm px-2 sm:px-3 py-1">Cross-Chain</Badge>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    <Button asChild className="btn-gradient text-white text-sm px-4 py-2.5 w-full">
                      <a href="https://www.glider.world/" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-3 h-3 mr-2" />
                        Visit Project
                      </a>
                    </Button>
                    <Button variant="outline" className="border-purple-500 text-purple-600 dark:text-purple-400 text-sm px-4 py-2.5 w-full">
                      <Info className="w-3 h-3 mr-2" />
                      Learn More
                    </Button>
                  </div>
                </div>
                
                <div className="relative order-1 lg:order-2">
                  <div className="w-full h-56 sm:h-64 md:h-72 lg:h-80 xl:h-96 flex items-center justify-center p-2 sm:p-3 lg:p-4 xl:p-6 bg-gradient-to-br from-purple-50 to-cyan-50 dark:from-purple-900/20 dark:to-cyan-900/20 rounded-2xl">
                    <div className="w-full h-full flex items-center justify-center">
                      <img 
                        src="/attached_assets/glider-text-logo.png" 
                        alt="Glider Text Logo" 
                        className="w-full h-full object-contain max-w-full max-h-full"
                        style={{ minHeight: '120px', minWidth: '200px' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Other Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                title: "DeFi Protocol", 
                description: "Automated market maker with yield farming capabilities", 
                tags: ["Solana", "DeFi"],
                icon: "💰",
                gradient: "from-green-500 to-emerald-600"
              },
              { 
                title: "Web3 Metaverse Battle Royal Gaming", 
                description: "Immersive blockchain-based battle royal gaming with NFT rewards", 
                tags: ["Gaming", "Metaverse", "P2E"],
                icon: "🎮",
                gradient: "from-red-500 to-orange-600"
              },

              { 
                title: "Cyber Forensic Team", 
                description: "Advanced blockchain security and forensic analysis services", 
                tags: ["Security", "Forensics"],
                icon: "🔍",
                gradient: "from-purple-500 to-violet-600"
              },
            ].map((project, index) => (
              <Card key={index} className="glassmorphism border-white/20 dark:border-gray-700/30 card-hover">
                <CardContent className="p-6">
                  <div className={`w-full h-48 bg-gradient-to-br ${project.gradient} rounded-xl mb-4 flex items-center justify-center relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="text-6xl relative z-10">{project.icon}</div>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{project.title}</h4>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{project.description}</p>
                  <div className="flex gap-2 flex-wrap">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Jobs Section */}
      <section id="jobs" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Join Our <span className="text-gradient bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">Team</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Build the future of blockchain technology with passionate developers and innovators.
            </p>
          </div>
          
          {/* Job Filters */}
          <div className="flex flex-wrap gap-2 sm:gap-4 mb-8 justify-center px-4">
            {jobCategories.map((category) => (
              <Button
                key={category.id}
                variant={selectedJobCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedJobCategory(category.id)}
                className={`text-sm px-3 py-2 ${selectedJobCategory === category.id ? "btn-gradient text-white" : "glassmorphism border-white/20 dark:border-gray-700/30"}`}
              >
                {category.label}
              </Button>
            ))}
          </div>
          
          {/* Job Listings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-12 px-4">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} onApply={handleApplyToJob} />
            ))}
          </div>
          
          {filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                No jobs found in this category. Check back soon for new opportunities!
              </p>
            </div>
          )}
          
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Don't see the perfect role? We're always looking for exceptional talent.
            </p>
            <Button 
              onClick={() => window.location.href = 'mailto:goodlucklabs@gmail.com?subject=Resume Submission&body=Hi Goodluck Labs team,%0D%0A%0D%0AI am interested in joining your team. Please find my resume attached.%0D%0A%0D%0ABest regards'}
              className="btn-gradient text-white px-8 py-4 font-semibold"
            >
              <Send className="w-4 h-4 mr-2" />
              Send Us Your Resume
            </Button>
          </div>
        </div>
      </section>

      {/* Announcements Section */}
      <section id="announcements" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Latest <span className="text-gradient bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">Announcements</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Stay updated with our latest developments and industry insights.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {announcements.map((announcement) => (
              <AnnouncementCard key={announcement.id} announcement={announcement} />
            ))}
          </div>
          
          {announcements.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                No announcements at this time. Check back soon for updates!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Let's Build <span className="text-gradient bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">Together</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Ready to start your blockchain project? Get in touch with our team.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Get in Touch</h3>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                    <Mail className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Email</h4>
                    <p 
                      className="text-gray-600 dark:text-gray-300 cursor-pointer hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                      onClick={() => window.location.href = 'mailto:goodlucklabs@gmail.com'}
                    >
                      goodlucklabs@gmail.com
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center mr-4">
                    <Phone className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Phone</h4>
                    <p 
                      className="text-gray-600 dark:text-gray-300 cursor-pointer hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                      onClick={() => window.location.href = 'tel:+918249738604'}
                    >
                      +91 824 973 8604
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-4">
                    <MapPin className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Office</h4>
                    <p 
                      className="text-gray-600 dark:text-gray-300 cursor-pointer hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                      onClick={() => window.open('https://maps.google.com/?q=444+MG+Road+Ste+218,+Bangalore,+India+560001', '_blank')}
                    >
                      444 MG Road Ste 218, Bangalore, India 560001
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-4">Follow Us</h4>
                <div className="flex space-x-4">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="hover:bg-purple-500 hover:text-white"
                    onClick={() => window.open('https://x.com/GoodluckLabs', '_blank')}
                  >
                    <Twitter className="h-5 w-5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="hover:bg-purple-500 hover:text-white"
                    onClick={() => window.open('https://www.linkedin.com/company/goodluck-labs/posts/?feedView=all', '_blank')}
                  >
                    <Linkedin className="h-5 w-5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="hover:bg-purple-500 hover:text-white"
                    onClick={() => window.open('https://github.com/Goodlucklabs', '_blank')}
                  >
                    <Github className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
            
            <Card className="glassmorphism border-white/20 dark:border-gray-700/30">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send a Message</h3>
                
                <form onSubmit={handleContactFormSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
                      <input 
                        type="text" 
                        value={contactForm.name}
                        onChange={(e) => handleContactFormChange('name', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter your name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                      <input 
                        type="email" 
                        value={contactForm.email}
                        onChange={(e) => handleContactFormChange('email', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject</label>
                    <input 
                      type="text" 
                      value={contactForm.subject}
                      onChange={(e) => handleContactFormChange('subject', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="What's this about?"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
                    <textarea 
                      rows={5} 
                      value={contactForm.message}
                      onChange={(e) => handleContactFormChange('message', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Tell us about your project..."
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit"
                    disabled={contactMutation.isPending}
                    className="w-full btn-gradient text-white py-4 font-semibold disabled:opacity-50"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {contactMutation.isPending ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img src={goodluckLogo} alt="Goodluck Technology" className="w-10 h-10 rounded-xl" />
                <span className="text-xl font-bold">Goodluck Technology</span>
              </div>
              <p className="text-gray-400 mb-4">
                Building the future of blockchain technology with innovative Web3 solutions.
              </p>
              <div className="flex space-x-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-gray-400 hover:text-white"
                  onClick={() => window.open('https://x.com/GoodluckLabs', '_blank')}
                >
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-gray-400 hover:text-white"
                  onClick={() => window.open('https://www.linkedin.com/company/goodluck-labs/posts/?feedView=all', '_blank')}
                >
                  <Linkedin className="h-5 w-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-gray-400 hover:text-white"
                  onClick={() => window.open('https://github.com/Goodlucklabs', '_blank')}
                >
                  <Github className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><button onClick={() => scrollToSection('about')} className="text-gray-400 hover:text-white transition-colors">About</button></li>
                <li><button onClick={() => scrollToSection('portfolio')} className="text-gray-400 hover:text-white transition-colors">Portfolio</button></li>
                <li><button onClick={() => scrollToSection('jobs')} className="text-gray-400 hover:text-white transition-colors">Careers</button></li>
                <li><button onClick={() => scrollToSection('contact')} className="text-gray-400 hover:text-white transition-colors">Contact</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Services</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blockchain Development</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Smart Contracts</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">DeFi Solutions</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">NFT Platforms</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Support</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 Goodluck Technology. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Job Application Modal */}
      <JobApplicationModal
        job={selectedJob}
        isOpen={isApplicationModalOpen}
        onClose={() => {
          setIsApplicationModalOpen(false);
          setSelectedJob(null);
        }}
      />
    </div>
  );
}
