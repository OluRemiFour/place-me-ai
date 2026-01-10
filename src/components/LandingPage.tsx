import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function LandingPage() {
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

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="container mx-auto px-8 pt-32 pb-24">
        <div className="max-w-4xl">
          <h1 className="text-[64px] leading-[1.1] font-bold tracking-tight mb-6">
            Enterprise Talent Matching at Terminal Velocity
          </h1>
          <p className="text-xl mb-12 max-w-2xl opacity-80">
            AI-powered skill analysis connects students with industry requirements in seconds. Built for recruiters who demand precision.
          </p>
          <Link to="/dashboard">
            <Button className="h-12 px-8 text-base font-semibold group">
              Access Platform
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </section>

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
