import { Link } from 'react-router-dom';
import { ArrowRight, GraduationCap, Briefcase, Award, TrendingUp, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LandingPage() {
  const { isAuthenticated, isVerified, user } = useAuth();
  
  const companies = [
    'ACME CORP', 'TECHFLOW', 'DATASHIFT', 'NEXUS', 
    'QUANTUM', 'SYSTECH', 'PINNACLE', 'VERTEX'
  ];

  const features = [
    {
      title: 'AI-Driven Matching',
      description: 'Advanced algorithms analyze skills, experience, and industry requirements to identify optimal talent matches in seconds. Reduce hiring cycles by up to 70%.',
      icon: TrendingUp
    },
    {
      title: 'Real-Time Analytics',
      description: 'Enterprise-grade dashboard delivers instant insights into candidate readiness, skill gaps, and market trends. Make data-driven decisions with confidence.',
      icon: Search
    },
    {
      title: 'Skill Gap Analysis',
      description: 'Precision feedback identifies exact capability deficiencies and provides structured improvement paths. Transform raw talent into job-ready candidates.',
      icon: Award
    }
  ];

  const scholarships = [
    {
      title: 'Future Tech Leaders Grant',
      amount: '$10,000',
      deadline: 'Apply by Oct 30',
      tags: ['Engineering', 'Leadership']
    },
    {
      title: 'Women in Code Scholarship',
      amount: '$5,000',
      deadline: 'Apply by Nov 15',
      tags: ['Diversity', 'Coding']
    },
    {
      title: 'Data Science Excellence Award',
      amount: '$7,500',
      deadline: 'Apply by Dec 01',
      tags: ['Data Science', 'Masters']
    }
  ];

  const dashboardPath = isAuthenticated 
    ? (isVerified ? '/dashboard' : '/verify-otp')
    : '/login';

  return (
    <div className="bg-white">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-black/5 z-50 transition-all">
        <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold tracking-tight">
            SkillSync
          </Link>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Link to={dashboardPath}>
                <Button className="h-10 px-6 text-sm font-semibold btn-interaction">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login" className="hidden sm:inline-block">
                  <Button variant="outline" className="h-10 px-6 text-sm font-semibold border-black btn-interaction">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="h-10 px-6 text-sm font-semibold btn-interaction">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 md:px-8 pt-32 md:pt-48 pb-16 md:pb-24 overflow-hidden">
        <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-700">
          <Badge className="mb-6 px-4 py-1 text-sm bg-black/5 text-black hover:bg-black/10 border-0">
            Now with AI-Powered Matching 2.0
          </Badge>
          <h1 className="text-4xl md:text-6xl lg:text-[72px] leading-[1.1] font-bold tracking-tight mb-6 md:mb-8">
           Every Opportunity, <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> One Intelligent Platform.</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 md:mb-12 max-w-2xl opacity-80 leading-relaxed">
            {/* AI-powered skill analysis connects students with industry requirements in seconds. Built for recruiters who demand precision and students who demand opportunity. */}
From scholarships and internships to learning resources, we aggregate unstructured web data and convert it into clean, ranked intelligence — so you never miss what matters.          </p>
          {isAuthenticated ? (
            <Link to={dashboardPath}>
              <Button className="h-12 px-8 text-base font-semibold group btn-interaction">
                Go to Dashboard
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <Button className="h-12 w-full sm:w-auto px-8 text-base font-semibold group btn-interaction">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" className="h-12 w-full sm:w-auto px-8 text-base font-semibold border-black btn-interaction hover:bg-black hover:text-white">
                  Sign In
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>
      
      {/* User Type Selection */}
      {!isAuthenticated && (
        <section className="container mx-auto px-4 md:px-8 py-16 border-t border-black/10">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 md:mb-12 text-center">Choose Your Path</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            <Link to="/register" className="group">
              <div className="border border-black/10 rounded-xl p-6 md:p-8 hover:border-black hover:shadow-[4px_4px_0_0_#000] transition-all bg-white h-full relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                   <GraduationCap className="h-24 w-24 -mr-8 -mt-8" />
                </div>
                <GraduationCap className="h-10 w-10 mb-4" />
                <h3 className="text-2xl font-bold mb-2">I'm a Student or Individual</h3>
                <p className="text-base opacity-60 mb-6">
                  Build your profile, showcase your skills, and get matched with opportunities that fit your career goals.
                </p>
                <div className="flex items-center gap-2 font-semibold group-hover:gap-3 transition-all mt-auto">
                  <span>Create an Account</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
            <Link to="/register" className="group">
              <div className="border border-black/10 rounded-xl p-6 md:p-8 hover:border-black hover:shadow-[4px_4px_0_0_#000] transition-all bg-white h-full relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                   <Briefcase className="h-24 w-24 -mr-8 -mt-8" />
                </div>
                <Briefcase className="h-10 w-10 mb-4" />
                <h3 className="text-2xl font-bold mb-2">I'm a Recruiter</h3>
                <p className="text-base opacity-60 mb-6">
                  Access AI-powered talent matching, analytics dashboards, and skill gap insights to find perfect candidates.
                </p>
                <div className="flex items-center gap-2 font-semibold group-hover:gap-3 transition-all mt-auto">
                  <span>Create Recruiter Account</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Scholarships Preview Section */}
      <section className="bg-black text-white py-24">
         <div className="container mx-auto px-4 md:px-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
               <div className="max-w-xl">
                  <h2 className="text-3xl md:text-5xl font-bold mb-6">Unlock Your Potential with Scholarships</h2>
                  <p className="text-lg text-gray-400">
                    We aggregate thousands of remote and on-site opportunities. Our AI matches you with scholarships you actually qualify for.
                  </p>
               </div>
               <Link to="/scholarships">
                 <Button variant="outline" className="h-12 px-8 border-white text-gray-500 hover:bg-white hover:text-black transition-colors">
                   View All Opportunities
                 </Button>
               </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {scholarships.map((item, idx) => (
                  <div key={idx} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:border-white/30 transition-all hover:bg-white/20">
                     <div className="mb-4">
                        <Badge variant="secondary" className="bg-white text-black hover:bg-gray-200">
                           {item.amount}
                        </Badge>
                     </div>
                     <h3 className="text-xl font-bold mb-2 line-clamp-1">{item.title}</h3>
                     <p className="text-sm text-gray-400 mb-6">{item.deadline}</p>
                     <div className="flex flex-wrap gap-2">
                        {item.tags.map(tag => (
                           <span key={tag} className="text-xs px-2 py-1 rounded-full bg-black/30 text-gray-300">
                              {tag}
                           </span>
                        ))}
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 md:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature, idx) => (
            <div key={idx} className="space-y-4 p-6 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="h-12 w-12 bg-black text-white rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-semibold">
                {feature.title}
              </h3>
              <p className="text-base leading-relaxed opacity-80">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="container mx-auto px-4 md:px-8 py-24 border-t border-black/5">
        <p className="text-sm font-medium opacity-60 mb-12 tracking-wide text-center uppercase">
          Trusted by Leading Organizations
        </p>
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-8">
          {companies.map((company, idx) => (
            <div 
              key={idx}
              className="text-2xl font-bold opacity-20 hover:opacity-100 transition-opacity cursor-default"
            >
              {company}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 md:px-8 py-24 border-t border-black/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Ready to Transform Your Hiring?
          </h2>
          <p className="text-lg md:text-xl mb-10 opacity-80 max-w-2xl mx-auto">
            Join hundreds of enterprises using SkillSync to identify top talent faster than ever before.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/dashboard">
              <Button className="h-14 px-8 text-lg font-semibold btn-interaction">
                Get Started Now
              </Button>
            </Link>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="h-14 px-8 text-lg font-semibold border-black hover:bg-black hover:text-white btn-interaction">
                  Schedule Demo
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-white text-black">
                <DemoForm />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-black text-white py-16">
         <div className="container mx-auto px-4 md:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
               <div>
                  <h4 className="font-bold mb-4">Product</h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                     <li className="hover:text-white cursor-pointer">Features</li>
                     <li className="hover:text-white cursor-pointer">Pricing</li>
                     <li className="hover:text-white cursor-pointer">Security</li>
                  </ul>
               </div>
               <div>
                  <h4 className="font-bold mb-4">Company</h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                     <li className="hover:text-white cursor-pointer">About</li>
                     <li className="hover:text-white cursor-pointer">Careers</li>
                     <li className="hover:text-white cursor-pointer">Contact</li>
                  </ul>
               </div>
               <div>
                  <h4 className="font-bold mb-4">Resources</h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                     <li className="hover:text-white cursor-pointer">Documentation</li>
                     <li className="hover:text-white cursor-pointer">API</li>
                     <li className="hover:text-white cursor-pointer">Support</li>
                  </ul>
               </div>
               <div>
                  <h4 className="font-bold mb-4">Legal</h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                     <li className="hover:text-white cursor-pointer">Privacy</li>
                     <li className="hover:text-white cursor-pointer">Terms</li>
                  </ul>
               </div>
            </div>
            <div className="pt-8 border-t border-white/10 text-center text-sm text-gray-500">
               © 2026 SkillSync. All rights reserved.
            </div>
         </div>
      </footer>
    </div>
  );
}

import { useState } from 'react';

function DemoForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="py-10 text-center space-y-4">
        <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h3 className="text-xl font-bold">Request Received</h3>
        <p className="text-gray-500 text-sm">Thanks! Our team will contact you shortly to schedule your personalized demo.</p>
        <DialogFooter>
           <DialogTrigger asChild>
             <Button className="w-full">Close</Button>
           </DialogTrigger>
        </DialogFooter>
      </div>
    );
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Schedule a Live Demo</DialogTitle>
        <DialogDescription>
          See how SkillSync can transform your hiring process.
        </DialogDescription>
      </DialogHeader>
      <form className="grid gap-4 py-4" onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input id="name" className="col-span-3" required />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="email" className="text-right">
            Email
          </Label>
          <Input id="email" type="email" className="col-span-3" required />
        </div>
         <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="company" className="text-right">
            Company
          </Label>
          <Input id="company" className="col-span-3" required />
        </div>
        <DialogFooter>
          <Button type="submit">Request Demo</Button>
        </DialogFooter>
      </form>
    </>
  );
}
