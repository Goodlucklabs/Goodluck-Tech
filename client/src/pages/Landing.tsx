import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { type Job, type Announcement } from "@shared/schema";
import { useTheme } from "@/components/ThemeProvider";
import { JobCard } from "@/components/JobCard";
import { JobApplicationModal } from "@/components/JobApplicationModal";
import { AnnouncementCard } from "@/components/AnnouncementCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Moon, Sun, User, Rocket, Code, Shield, 
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

export default function Landing() {
  const { theme, toggleTheme } = useTheme();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [selectedJobCategory, setSelectedJobCategory] = useState("all");

  const { data: jobs = [] } = useQuery<Job[]>({
    queryKey: ["/api/jobs"],
  });

  const { data: announcements = [], isLoading: announcementsLoading, error: announcementsError } = useQuery<Announcement[]>({
    queryKey: ["/api/announcements"],
  });

  const filteredJobs = jobs.filter(job => 
    selectedJobCategory === "all" || 
    job.department.toLowerCase() === selectedJobCategory.toLowerCase()
  );

  const handleApplyToJob = (job: Job) => {
    setSelectedJob(job);
    setIsApplicationModalOpen(true);
  };

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glassmorphism border-b border-white/20 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <img 
                src={goodluckLogo} 
                alt="Goodluck Technology Logo" 
                className="w-10 h-10 rounded-lg"
              />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Goodluck Technology
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => scrollToSection('home')}
                className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection('portfolio')}
                className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                Portfolio
              </button>
              <button 
                onClick={() => scrollToSection('jobs')}
                className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                Jobs
              </button>
              <button 
                onClick={() => scrollToSection('announcements')}
                className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                News
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                Contact
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                {theme === "light" ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </Button>
              <Button 
                onClick={() => scrollToSection('jobs')}
                className="btn-gradient text-white"
              >
                <User className="w-4 h-4 mr-2" />
                Join Us
              </Button>
              <Button 
                onClick={() => window.location.href = '/admin'}
                variant="outline"
                className="text-gray-600 dark:text-gray-300"
              >
                Admin
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-32">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10"></div>
        
        {/* Floating elements */}
        <div className="absolute top-40 left-10 w-20 h-20 bg-purple-500/20 rounded-full animate-float"></div>
        <div className="absolute top-60 right-20 w-16 h-16 bg-cyan-500/20 rotate-45 animate-float" style={{animationDelay: "2s"}}></div>
        <div className="absolute bottom-40 left-20 w-12 h-12 bg-green-500/20 rounded-full animate-float" style={{animationDelay: "4s"}}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 mt-8">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-24 h-24 mb-8 mt-2.5">
              <img 
                src={goodluckLogo} 
                alt="Goodluck Technology" 
                className="w-full h-full rounded-2xl glow-effect"
              />
            </div>
            
            <h1 className="text-6xl md:text-7xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
              Next-Gen <span className="text-gradient bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">Blockchain</span><br />
              Development Studio
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              Building the future of decentralized applications with cutting-edge Web3 technologies. 
              From DeFi protocols to Web3 metaverse battle royal gaming, we craft blockchain solutions that scale.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <Button 
              onClick={() => scrollToSection('portfolio')}
              className="btn-gradient text-white px-8 py-3 rounded-xl font-semibold text-lg shadow-2xl"
            >
              <Rocket className="w-5 h-5 mr-3" />
              View Our Projects
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.location.href = 'mailto:goodlucklabs@gmail.com'}
              className="glassmorphism border-purple-500/30 hover:border-purple-500/60 px-8 py-3 rounded-xl font-semibold text-lg"
            >
              <Send className="w-5 h-5 mr-3" />
              Contact Us
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <Card className="glassmorphism border-white/20 dark:border-gray-700/30 card-hover">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-gradient bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent mb-2">3+</div>
                <div className="text-gray-600 dark:text-gray-300">Projects Delivered</div>
              </CardContent>
            </Card>
            <Card className="glassmorphism border-white/20 dark:border-gray-700/30 card-hover">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-gradient bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent mb-2">$1.5M+</div>
                <div className="text-gray-600 dark:text-gray-300">Total Value Locked</div>
              </CardContent>
            </Card>
            <Card className="glassmorphism border-white/20 dark:border-gray-700/30 card-hover">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-gradient bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent mb-2">13+</div>
                <div className="text-gray-600 dark:text-gray-300">Blockchain Networks</div>
              </CardContent>
            </Card>
            <Card className="glassmorphism border-white/20 dark:border-gray-700/30 card-hover">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-gradient bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent mb-2">99.9%</div>
                <div className="text-gray-600 dark:text-gray-300">Uptime</div>
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
          
          {/* Other Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                title: "DAO Governance", 
                description: "Decentralized governance platform with voting mechanisms", 
                tags: ["DAO", "Governance"],
                icon: "🏛️",
                gradient: "from-blue-500 to-indigo-600"
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
          <div className="flex flex-wrap gap-4 mb-8 justify-center">
            {jobCategories.map((category) => (
              <Button
                key={category.id}
                variant={selectedJobCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedJobCategory(category.id)}
                className={selectedJobCategory === category.id ? "btn-gradient text-white" : "glassmorphism border-white/20 dark:border-gray-700/30"}
              >
                {category.label}
              </Button>
            ))}
          </div>
          
          {/* Job Listings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
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
              Latest <span className="text-gradient bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">News</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Stay updated with our latest developments and company announcements.
            </p>
          </div>
          
          {announcementsLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Loading announcements...
              </p>
            </div>
          ) : announcementsError ? (
            <div className="text-center py-12">
              <p className="text-red-600 text-lg">
                Error loading announcements: {announcementsError.message}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {announcements.map((announcement) => (
                  <AnnouncementCard key={announcement.id} announcement={announcement} />
                ))}
              </div>
              
              {announcements.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-600 dark:text-gray-300 text-lg">
                    No announcements at the moment. Check back soon for updates!
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Get In <span className="text-gradient bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">Touch</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Ready to build the future of blockchain together? Let's discuss your project.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="glassmorphism border-white/20 dark:border-gray-700/30 card-hover">
              <CardContent className="p-8 text-center">
                <Mail className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Email Us</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">Drop us a line anytime</p>
                <Button 
                  onClick={() => window.location.href = 'mailto:goodlucklabs@gmail.com'}
                  className="btn-gradient text-white"
                >
                  goodlucklabs@gmail.com
                </Button>
              </CardContent>
            </Card>
            
            <Card className="glassmorphism border-white/20 dark:border-gray-700/30 card-hover">
              <CardContent className="p-8 text-center">
                <Phone className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Call Us</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">Let's talk about your project</p>
                <Button 
                  onClick={() => window.location.href = 'tel:+918249738604'}
                  variant="outline" 
                  className="border-purple-500 text-purple-600 dark:text-purple-400"
                >
                  +91 824 973 8604
                </Button>
              </CardContent>
            </Card>
            
            <Card className="glassmorphism border-white/20 dark:border-gray-700/30 card-hover">
              <CardContent className="p-8 text-center">
                <MapPin className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Visit Us</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">Come say hello at our office</p>
                <Button 
                  onClick={() => window.open('https://maps.google.com/?q=444+MG+Road+Ste+218,+Bangalore,+India+560001', '_blank')}
                  variant="outline" 
                  className="border-purple-500 text-purple-600 dark:text-purple-400"
                >
                  444 MG Road Ste 218<br />Bangalore, India 560001
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Social Media Links */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Follow Us</h3>
            <div className="flex justify-center gap-6">
              <Button
                onClick={() => window.open('https://x.com/GoodluckLabs', '_blank')}
                variant="outline"
                size="lg"
                className="glassmorphism border-white/20 dark:border-gray-700/30 hover:border-purple-500/60"
              >
                <Twitter className="w-5 h-5 mr-2" />
                Twitter
              </Button>
              <Button
                onClick={() => window.open('https://www.linkedin.com/company/goodluck-labs/posts/?feedView=all', '_blank')}
                variant="outline"
                size="lg"
                className="glassmorphism border-white/20 dark:border-gray-700/30 hover:border-purple-500/60"
              >
                <Linkedin className="w-5 h-5 mr-2" />
                LinkedIn
              </Button>
              <Button
                onClick={() => window.open('https://github.com/Goodlucklabs', '_blank')}
                variant="outline"
                size="lg"
                className="glassmorphism border-white/20 dark:border-gray-700/30 hover:border-purple-500/60"
              >
                <Github className="w-5 h-5 mr-2" />
                GitHub
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Job Application Modal */}
      <JobApplicationModal
        job={selectedJob}
        isOpen={isApplicationModalOpen}
        onClose={() => setIsApplicationModalOpen(false)}
      />
    </div>
  );
}