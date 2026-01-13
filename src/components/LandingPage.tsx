import { Link } from 'react-router-dom';
import { ArrowRight, GraduationCap, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

export function LandingPage() {
  const { isAuthenticated, user } = useAuth();
  
  const companies = [
    'ACME CORP', 'TECHFLOW', 'DATASHIFT', 'NEXUS', 
    'QUANTUM', 'SYSTECH', 'PINNACLE', 'VERTEX'
  ];

  const features = [
    {
      title: 'AI-Driven Matching',
      description: 'Advanced algorithms analyze skills, experience, and industry requirements to identify optimal talent matches in seconds. Reduce hiring cycles by up to 70%.'
    },
    {
      title: 'Real-Time Analytics',
      description: 'Enterprise-grade dashboard delivers instant insights into candidate readiness, skill gaps, and market trends. Make data-driven decisions with confidence.'
    },
    {
      title: 'Skill Gap Analysis',
      description: 'Precision feedback identifies exact capability deficiencies and provides structured improvement paths. Transform raw talent into job-ready candidates.'
    }
  ];

  const dashboardPath = isAuthenticated 
    ? (user?.role === 'student' ? '/student-dashboard' : '/industry-dashboard')
    : '/login';

  return (
    <div className="bg-white">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white border-b border-black z-50">
        <div className="container mx-auto px-8 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold tracking-tight">
            SkillSync
          </Link>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Link to={dashboardPath}>
                <Button className="h-10 px-6 text-sm font-semibold">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" className="h-10 px-6 text-sm font-semibold border-black">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="h-10 px-6 text-sm font-semibold">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-8 pt-32 pb-24">
        <div className="max-w-4xl">
          <h1 className="text-[64px] leading-[1.1] font-bold tracking-tight mb-6">
            Enterprise Talent Matching at Terminal Velocity
          </h1>
          <p className="text-xl mb-12 max-w-2xl opacity-80">
            AI-powered skill analysis connects students with industry requirements in seconds. Built for recruiters who demand precision.
          </p>
          {isAuthenticated ? (
            <Link to={dashboardPath}>
              <Button className="h-12 px-8 text-base font-semibold group">
                Go to Dashboard
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          ) : (
            <div className="flex gap-4">
              <Link to="/register">
                <Button className="h-12 px-8 text-base font-semibold group">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" className="h-12 px-8 text-base font-semibold border-black">
                  Sign In
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>
      
      {/* User Type Selection */}
      {!isAuthenticated && (
        <section className="container mx-auto px-8 py-16 border-t border-black">
          <h2 className="text-3xl font-bold mb-8 text-center">Choose Your Path</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Link to="/register" className="group">
              <div className="border border-black rounded-sm p-8 hover:shadow-[4px_4px_0_0_#000] transition-all">
                <GraduationCap className="h-10 w-10 mb-4" />
                <h3 className="text-2xl font-bold mb-2">I'm a Student</h3>
                <p className="text-base opacity-60 mb-6">
                  Build your profile, showcase your skills, and get matched with opportunities that fit your career goals.
                </p>
                <div className="flex items-center gap-2 font-semibold group-hover:gap-3 transition-all">
                  <span>Create Student Account</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
            <Link to="/register" className="group">
              <div className="border border-black rounded-sm p-8 hover:shadow-[4px_4px_0_0_#000] transition-all">
                <Briefcase className="h-10 w-10 mb-4" />
                <h3 className="text-2xl font-bold mb-2">I'm a Recruiter</h3>
                <p className="text-base opacity-60 mb-6">
                  Access AI-powered talent matching, analytics dashboards, and skill gap insights to find perfect candidates.
                </p>
                <div className="flex items-center gap-2 font-semibold group-hover:gap-3 transition-all">
                  <span>Create Recruiter Account</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="container mx-auto px-8 py-24 border-t border-black">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature, idx) => (
            <div key={idx} className="space-y-4">
              <div className="font-mono text-sm opacity-60">
                {String(idx + 1).padStart(2, '0')}
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
      <section className="container mx-auto px-8 py-24 border-t border-black">
        <p className="text-sm font-medium opacity-60 mb-12 tracking-wide">
          TRUSTED BY LEADING ORGANIZATIONS
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-8">
          {companies.map((company, idx) => (
            <div 
              key={idx}
              className="text-2xl font-bold opacity-30 hover:opacity-100 transition-opacity cursor-default"
            >
              {company}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-8 py-24 border-t border-black">
        <div className="max-w-3xl">
          <h2 className="text-5xl font-bold mb-6">
            Ready to Transform Your Hiring?
          </h2>
          <p className="text-lg mb-10 opacity-80">
            Join hundreds of enterprises using SkillSync to identify top talent faster than ever before.
          </p>
          <div className="flex gap-4">
            <Link to="/dashboard">
              <Button className="h-12 px-8 text-base font-semibold">
                Get Started
              </Button>
            </Link>
            <Button variant="outline" className="h-12 px-8 text-base font-semibold border-black hover:bg-black hover:text-white">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-8 py-12 border-t border-black">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm opacity-60">
              <li><a href="#" className="hover:opacity-100">Features</a></li>
              <li><a href="#" className="hover:opacity-100">Pricing</a></li>
              <li><a href="#" className="hover:opacity-100">Security</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm opacity-60">
              <li><a href="#" className="hover:opacity-100">About</a></li>
              <li><a href="#" className="hover:opacity-100">Careers</a></li>
              <li><a href="#" className="hover:opacity-100">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm opacity-60">
              <li><a href="#" className="hover:opacity-100">Documentation</a></li>
              <li><a href="#" className="hover:opacity-100">API</a></li>
              <li><a href="#" className="hover:opacity-100">Support</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm opacity-60">
              <li><a href="#" className="hover:opacity-100">Privacy</a></li>
              <li><a href="#" className="hover:opacity-100">Terms</a></li>
              <li><a href="#" className="hover:opacity-100">Compliance</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-black/10">
          <p className="text-sm opacity-60">
            © 2024 SkillSync. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
