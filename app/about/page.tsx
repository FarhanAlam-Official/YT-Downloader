"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { 
  Play, 
  Download, 
  Shield, 
  Zap, 
  Globe, 
  Users, 
  Heart, 
  Star, 
  Home,
  Github,
  Twitter,
  Mail,
  Award,
  Rocket,
  Target,
  CheckCircle,
  Code,
  Server,
  Palette,
  Linkedin
} from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-youtube-red/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-success-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-info-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Use the new Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-12 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-youtube-red/20 to-brand-red-500/20 rounded-full mb-6">
              <Star className="h-5 w-5 text-youtube-red" />
              <span className="text-youtube-red font-medium">Since 2024</span>
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold text-foreground mb-6 leading-tight">
              About 
              <span className="bg-gradient-to-r from-youtube-red via-brand-red-500 to-success-500 bg-clip-text text-transparent">
                {" "}YTDownloader
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8">
              Empowering users worldwide with fast, secure, and intelligent YouTube video downloading since 2024.
            </p>
            
            <div className="inline-flex gap-4 mb-10">
              <Badge className="youtube-gradient px-4 py-2">
                <Zap className="h-4 w-4 mr-2" />
                Lightning Fast
              </Badge>
              <Badge className="bg-muted text-foreground px-4 py-2">
                <Shield className="h-4 w-4 mr-2" />
                Privacy First
              </Badge>
              <Badge className="bg-success-500/20 text-success-foreground px-4 py-2">
                <Heart className="h-4 w-4 mr-2" />
                Free Forever
              </Badge>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
            <Card className="p-6 bg-gradient-to-br from-youtube-card to-youtube-card-hover border border-border hover:shadow-lg transition-all">
              <div className="text-3xl font-bold text-foreground mb-2">1M+</div>
              <div className="text-sm text-muted-foreground">Downloads</div>
            </Card>
            <Card className="p-6 bg-gradient-to-br from-youtube-card to-youtube-card-hover border border-border hover:shadow-lg transition-all">
              <div className="text-3xl font-bold text-foreground mb-2">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </Card>
            <Card className="p-6 bg-gradient-to-br from-youtube-card to-youtube-card-hover border border-border hover:shadow-lg transition-all">
              <div className="text-3xl font-bold text-foreground mb-2">50K+</div>
              <div className="text-sm text-muted-foreground">Happy Users</div>
            </Card>
            <Card className="p-6 bg-gradient-to-br from-youtube-card to-youtube-card-hover border border-border hover:shadow-lg transition-all">
              <div className="text-3xl font-bold text-foreground mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">Available</div>
            </Card>
          </div>
        </div>

        {/* Our Mission */}
        <section className="mb-16">
          <Card className="youtube-card p-8 md:p-12 hover:transform hover:scale-[1.02] transition-all duration-500">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-youtube-red to-brand-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-serif font-bold text-foreground">Our Mission</h2>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  We believe everyone should have easy access to their favorite YouTube content. Our mission is to provide 
                  the fastest, most reliable, and user-friendly YouTube downloading experience while respecting content 
                  creators and platform policies.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 w-8 h-8 rounded-full bg-success-500/20 flex items-center justify-center flex-shrink-0">
                      <Shield className="h-4 w-4 text-success-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Privacy First</h3>
                      <p className="text-sm text-muted-foreground">No registration required. Your data stays private and secure.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 w-8 h-8 rounded-full bg-info-500/20 flex items-center justify-center flex-shrink-0">
                      <Zap className="h-4 w-4 text-info-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Lightning Fast</h3>
                      <p className="text-sm text-muted-foreground">Optimized servers for the fastest download speeds possible.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 w-8 h-8 rounded-full bg-warning-500/20 flex items-center justify-center flex-shrink-0">
                      <Globe className="h-4 w-4 text-warning-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Globally Accessible</h3>
                      <p className="text-sm text-muted-foreground">Available worldwide with no geographic restrictions.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-video bg-gradient-to-br from-youtube-red/20 to-success-500/20 rounded-2xl flex items-center justify-center overflow-hidden shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-tr from-youtube-red/30 to-transparent"></div>
                  <div className="relative z-10 text-center">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4">
                      <Play className="h-10 w-10 text-white fill-current ml-1" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Experience the Difference</h3>
                    <p className="text-white/80 mt-2">Fast, Secure, and Reliable</p>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-brand-red-500 to-youtube-red rounded-2xl rotate-12 opacity-20"></div>
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-success-500 to-info-500 rounded-2xl -rotate-12 opacity-20"></div>
              </div>
            </div>
          </Card>
        </section>

        {/* Key Features */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-4">
              Why Choose YTDownloader?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built with cutting-edge technology and user experience in mind
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="relative overflow-hidden p-8 transition-all duration-300 group bg-gradient-to-br from-youtube-card to-youtube-card-hover border border-border hover:shadow-2xl hover:scale-[1.02]">
              <div className="pointer-events-none absolute inset-0 rounded-[20px] p-[1px]">
                <div className="absolute -inset-[2px] rounded-[22px] bg-[conic-gradient(var(--tw-gradient-stops))] from-youtube-red via-success-500 to-info-500 opacity-0 transition-opacity duration-300 group-hover:opacity-60" />
              </div>
              <div className="relative z-10 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-success-500 to-success-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <Zap className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Smart Download</h3>
                <p className="text-muted-foreground mb-4">
                  AI-powered quality selection automatically chooses the best video and audio streams for optimal experience.
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-success-500/20 text-success-400 rounded-full text-sm">
                  <Star className="h-4 w-4" />
                  <span>AI-Powered</span>
                </div>
              </div>
            </Card>

            <Card className="relative overflow-hidden p-8 transition-all duration-300 group bg-gradient-to-br from-youtube-card to-youtube-card-hover border border-border hover:shadow-2xl hover:scale-[1.02]">
              <div className="pointer-events-none absolute inset-0 rounded-[20px] p-[1px]">
                <div className="absolute -inset-[2px] rounded-[22px] bg-[conic-gradient(var(--tw-gradient-stops))] from-info-500 via-youtube-red to-success-500 opacity-0 transition-opacity duration-300 group-hover:opacity-60" />
              </div>
              <div className="relative z-10 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-info-500 to-info-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <Shield className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Privacy Protected</h3>
                <p className="text-muted-foreground mb-4">
                  No registration required. Your data stays private. We don't store or track your download history.
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-info-500/20 text-info-400 rounded-full text-sm">
                  <Shield className="h-4 w-4" />
                  <span>100% Private</span>
                </div>
              </div>
            </Card>

            <Card className="relative overflow-hidden p-8 transition-all duration-300 group bg-gradient-to-br from-youtube-card to-youtube-card-hover border border-border hover:shadow-2xl hover:scale-[1.02]">
              <div className="pointer-events-none absolute inset-0 rounded-[20px] p-[1px]">
                <div className="absolute -inset-[2px] rounded-[22px] bg-[conic-gradient(var(--tw-gradient-stops))] from-brand-red-500 via-youtube-red to-pink-500 opacity-0 transition-opacity duration-300 group-hover:opacity-60" />
              </div>
              <div className="relative z-10 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-youtube-red to-brand-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <Rocket className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Lightning Fast</h3>
                <p className="text-muted-foreground mb-4">
                  Parallel downloads and smart caching ensure the fastest possible download speeds for your content.
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-youtube-red/20 text-youtube-red rounded-full text-sm">
                  <Zap className="h-4 w-4" />
                  <span>Ultra Speed</span>
                </div>
              </div>
            </Card>

            <Card className="relative overflow-hidden p-8 transition-all duration-300 group bg-gradient-to-br from-youtube-card to-youtube-card-hover border border-border hover:shadow-2xl hover:scale-[1.02]">
              <div className="pointer-events-none absolute inset-0 rounded-[20px] p-[1px]">
                <div className="absolute -inset-[2px] rounded-[22px] bg-[conic-gradient(var(--tw-gradient-stops))] from-warning-500 via-info-500 to-success-500 opacity-0 transition-opacity duration-300 group-hover:opacity-60" />
              </div>
              <div className="relative z-10 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-warning-500 to-warning-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <Globe className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Always Available</h3>
                <p className="text-muted-foreground mb-4">
                  24/7 uptime with global CDN ensures you can download your content anytime, anywhere.
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-warning-500/20 text-warning-400 rounded-full text-sm">
                  <Globe className="h-4 w-4" />
                  <span>Global Access</span>
                </div>
              </div>
            </Card>

            <Card className="relative overflow-hidden p-8 transition-all duration-300 group bg-gradient-to-br from-youtube-card to-youtube-card-hover border border-border hover:shadow-2xl hover:scale-[1.02]">
              <div className="pointer-events-none absolute inset-0 rounded-[20px] p-[1px]">
                <div className="absolute -inset-[2px] rounded-[22px] bg-[conic-gradient(var(--tw-gradient-stops))] from-purple-500 via-indigo-500 to-pink-500 opacity-0 transition-opacity duration-300 group-hover:opacity-60" />
              </div>
              <div className="relative z-10 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <Award className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Premium Quality</h3>
                <p className="text-muted-foreground mb-4">
                  Support for 4K, 8K, and all quality formats. Download exactly what you want, how you want it.
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-400 rounded-full text-sm">
                  <Award className="h-4 w-4" />
                  <span>HD Quality</span>
                </div>
              </div>
            </Card>

            <Card className="relative overflow-hidden p-8 transition-all duration-300 group bg-gradient-to-br from-youtube-card to-youtube-card-hover border border-border hover:shadow-2xl hover:scale-[1.02]">
              <div className="pointer-events-none absolute inset-0 rounded-[20px] p-[1px]">
                <div className="absolute -inset-[2px] rounded-[22px] bg-[conic-gradient(var(--tw-gradient-stops))] from-pink-500 via-rose-500 to-purple-500 opacity-0 transition-opacity duration-300 group-hover:opacity-60" />
              </div>
              <div className="relative z-10 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <Heart className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">User Focused</h3>
                <p className="text-muted-foreground mb-4">
                  Intuitive interface designed for everyone. From tech novices to power users, everyone feels at home.
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/20 text-pink-400 rounded-full text-sm">
                  <Users className="h-4 w-4" />
                  <span>User Friendly</span>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Developer Hero Section - Styled like the reference image */}
        <section className="mb-20 overflow-hidden">
          <div className="youtube-card overflow-hidden relative p-8 md:p-16 hover:shadow-xl transition-all duration-500">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-youtube-red via-success-500 to-info-500"></div>
            
            {/* Abstract Background Elements */}
            <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-youtube-red/5 rounded-full blur-3xl"></div>
            <div className="absolute -top-20 -left-20 w-60 h-60 bg-success-500/5 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
              {/* Left Content Area */}
              <div>
                  <div className="mb-6">
                    <h2 className="inline-block mb-2 text-sm font-medium tracking-wider text-muted-foreground uppercase">The Creator</h2>
                    <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                      <span className="bg-gradient-to-r from-youtube-red via-pink-500 to-info-500 bg-clip-text text-transparent">I build</span> tools
                      <br />that simplify and
                      <br /><span className="bg-gradient-to-r from-success-500 via-info-500 to-purple-500 bg-clip-text text-transparent">empower users.</span>
                    </h1>
                  </div>
                  
                  <p className="text-base md:text-lg text-muted-foreground mb-6 leading-relaxed">
                    Hi! I'm Farhan Alam, the developer behind YTDownloader. I'm passionate about creating
                    elegant solutions that make technology more accessible and user-friendly for everyone.
                  </p>
                
                {/* Social Links */}
                <div className="flex gap-4">
                  <Button size="sm" variant="ghost" className="text-muted-foreground rounded-full hover:bg-transparent hover:text-[#171515] dark:hover:text-white" asChild>
                    <a href="https://github.com/FarhanAlam-Official" target="_blank" rel="noopener noreferrer">
                      <Github className="h-5 w-5" />
                    </a>
                  </Button>
                  <Button size="sm" variant="ghost" className="text-muted-foreground rounded-full hover:bg-transparent hover:text-[#0077B5] dark:hover:text-[#0077B5]" asChild>
                    <a href="https://www.linkedin.com/in/farhan-alam-aa56b2309" target="_blank" rel="noopener noreferrer">
                      <Linkedin className="h-5 w-5" />
                    </a>
                  </Button>
                  <Button size="sm" variant="ghost" className="text-muted-foreground rounded-full hover:bg-transparent hover:text-[#E4405F] dark:hover:text-[#E4405F]" asChild>
                    <a href="https://www.instagram.com/farhan.alam.01" target="_blank" rel="noopener noreferrer">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.28.073-1.689.073-4.948 0-3.204-.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                  </Button>
                  <Button size="sm" variant="ghost" className="text-muted-foreground rounded-full hover:bg-transparent hover:text-[#1877F2] dark:hover:text-[#1877F2]" asChild>
                    <a href="https://www.facebook.com/farhanalam930" target="_blank" rel="noopener noreferrer">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                      </svg>
                    </a>
                  </Button>
                </div>
              </div>
              
              {/* Right Image Area */}
              <div className="relative">
                {/* Circular frame with seamless integration */}
                <div className="relative w-full aspect-square max-w-md mx-auto">
                  {/* Background circle with gradient border */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-youtube-red via-pink-500 to-purple-500 p-1 rotate-45 animate-pulse-slow">
                    <div className="absolute inset-0.5 rounded-full bg-background"></div>
                  </div>
                  
                  {/* Profile image */}
                  <div className="absolute inset-2 overflow-hidden rounded-full border-4 border-background">
                    <img 
                      src="/profile.png" 
                      alt="Farhan Alam" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* YT logo tag */}
                  <div className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3 w-16 h-16 rounded-full bg-background shadow-lg flex items-center justify-center z-10">
                    <div className="w-12 h-12 rounded-full bg-success-500 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">YT</span>
                    </div>
                  </div>
                </div>
                
                {/* Skills Tags - separate row below avatar */}
                <div className="mt-8">
                  <div className="mx-auto max-w-xl">
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1.5 text-sm text-foreground shadow-sm transition-all duration-200 hover:bg-muted/60 hover:border-border/70 hover:shadow-md hover:-translate-y-0.5 ring-0 ring-offset-0 hover:ring-2 hover:ring-offset-2 hover:ring-youtube-red/60 hover:ring-offset-background cursor-default">
                        <Code className="h-4 w-4 text-youtube-red" />
                        Frontend
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1.5 text-sm text-foreground shadow-sm transition-all duration-200 hover:bg-muted/60 hover:border-border/70 hover:shadow-md hover:-translate-y-0.5 ring-0 ring-offset-0 hover:ring-2 hover:ring-offset-2 hover:ring-success-500/60 hover:ring-offset-background cursor-default">
                        <Server className="h-4 w-4 text-success-500" />
                        Backend
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1.5 text-sm text-foreground shadow-sm transition-all duration-200 hover:bg-muted/60 hover:border-border/70 hover:shadow-md hover:-translate-y-0.5 ring-0 ring-offset-0 hover:ring-2 hover:ring-offset-2 hover:ring-info-500/60 hover:ring-offset-background cursor-default">
                        <Palette className="h-4 w-4 text-info-500" />
                        Design
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1.5 text-sm text-foreground shadow-sm transition-all duration-200 hover:bg-muted/60 hover:border-border/70 hover:shadow-md hover:-translate-y-0.5 ring-0 ring-offset-0 hover:ring-2 hover:ring-offset-2 hover:ring-success-500/60 hover:ring-offset-background cursor-default">
                        <div className="h-2 w-2 rounded-full bg-success-500"></div>
                        Creator
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        


        {/* Technology Stack */}
        <section className="mb-16">
          <Card className="youtube-card p-8 md:p-12 hover:transform hover:scale-[1.02] transition-all duration-500">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-serif font-bold text-foreground mb-4">
                Built with Modern Technology
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We use cutting-edge technologies to ensure the best performance and user experience
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <Code className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">Frontend Technologies</h3>
                </div>
                <div className="space-y-5">
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white font-bold text-xs">N</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">Next.js 15</h4>
                      <p className="text-sm text-muted-foreground mt-1">React Framework with App Router for optimal performance</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white font-bold text-xs">TS</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">TypeScript</h4>
                      <p className="text-sm text-muted-foreground mt-1">Type-safe JavaScript for robust code quality</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-teal-500 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white font-bold text-xs">TW</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">Tailwind CSS</h4>
                      <p className="text-sm text-muted-foreground mt-1">Utility-first CSS framework for rapid UI development</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                    <Server className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">Backend Technologies</h3>
                </div>
                <div className="space-y-5">
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-black font-bold text-xs">F</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">FastAPI</h4>
                      <p className="text-sm text-muted-foreground mt-1">High-performance Python API with automatic documentation</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-red-600 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white font-bold text-xs">FF</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">FFmpeg</h4>
                      <p className="text-sm text-muted-foreground mt-1">Powerful video processing engine for format conversion</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-red-500 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white font-bold text-xs">R</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">Redis Cache</h4>
                      <p className="text-sm text-muted-foreground mt-1">Lightning-fast caching for improved performance</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-border/50 text-center">
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our technology stack is carefully chosen to provide the best balance of performance, 
                reliability, and developer experience.
              </p>
            </div>
          </Card>
        </section>

        {/* Contact Section */}
        <section className="mb-16">
          <Card className="youtube-card p-8 md:p-12 text-center hover:transform hover:scale-[1.02] transition-all duration-500 border border-border/50 bg-background/50 backdrop-blur-sm">
            <div className="max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-youtube-red/20 to-brand-red-500/20 rounded-full mb-6">
                <Heart className="h-5 w-5 text-youtube-red" />
                <span className="text-youtube-red font-medium">We'd love to hear from you</span>
              </div>
              <h2 className="text-3xl font-serif font-bold text-foreground mb-4">
                Get in Touch
              </h2>
              <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
                Have questions, suggestions, or need support? We'd love to hear from you!
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-10 max-w-2xl mx-auto">
                <Card className="p-6 bg-muted/30 hover:bg-muted/50 transition-colors border-border/30 dark:bg-muted/20 dark:hover:bg-muted/30">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-youtube-red to-brand-red-600 flex items-center justify-center mx-auto mb-4">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">Email Support</h3>
                  <p className="text-muted-foreground text-sm mb-4">Get in touch directly with our team</p>
                  <Button className="youtube-gradient w-full flex items-center justify-center gap-2" asChild>
                    <a href="mailto:thefarhanalam01@gmail.com">
                      <Mail className="h-4 w-4" />
                      thefarhanalam01@gmail.com
                    </a>
                  </Button>
                </Card>
                
                <Card className="p-6 bg-muted/30 hover:bg-muted/50 transition-colors border-border/30 dark:bg-muted/20 dark:hover:bg-muted/30">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-4">
                    <Twitter className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">Social Media</h3>
                  <p className="text-muted-foreground text-sm mb-4">Follow us for updates and announcements</p>
                  <Button variant="outline" className="w-full border-border text-muted-foreground hover:text-foreground dark:border-border/50">
                    <Twitter className="h-4 w-4 mr-2" />
                    Follow Updates
                  </Button>
                </Card>
              </div>

              <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground/80 mb-10">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-success-500 rounded-full"></div>
                  <span>Response within 24 hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-info-500 rounded-full"></div>
                  <span>24/7 Support Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-warning-500 rounded-full"></div>
                  <span>Community Driven</span>
                </div>
              </div>

              {/* Call to Action */}
              <div className="pt-8 border-t border-border/50 dark:border-border/30">
                <Link href="/">
                  <Button className="youtube-gradient px-8 py-4 text-lg font-semibold mb-4 hover:shadow-lg transition-shadow">
                    Start Downloading Now
                  </Button>
                </Link>
                <p className="text-sm text-muted-foreground/80 dark:text-muted-foreground/70">
                  Join thousands of satisfied users worldwide
                </p>
              </div>
            </div>
          </Card>
        </section>
      </div>
      
      {/* New Footer */}
      <Footer />
    </main>
  )
}