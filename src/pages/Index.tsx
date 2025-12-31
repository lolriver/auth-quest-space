import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { 
  Zap, 
  CheckCircle2, 
  Shield, 
  TrendingUp,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function Index() {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, loading, navigate]);

  const features = [
    {
      icon: CheckCircle2,
      title: 'Task Management',
      description: 'Create, organize, and track your tasks with ease'
    },
    {
      icon: Shield,
      title: 'Secure Authentication',
      description: 'JWT-based auth with encrypted password storage'
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      description: 'Monitor your productivity with detailed statistics'
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(187_85%_53%_/_0.15),_transparent_60%)]" />
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20" />

      <div className="relative">
        {/* Header */}
        <header className="container mx-auto px-4 py-6">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-glow">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">TaskFlow</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/auth')}>
                Sign In
              </Button>
              <Button onClick={() => navigate('/auth')} className="gap-2">
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </nav>
        </header>

        {/* Hero */}
        <main className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-8 animate-slide-up">
              <Sparkles className="w-4 h-4" />
              Full-Stack Task Management App
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Organize Your Work.
              <br />
              <span className="gradient-text">Amplify Your Focus.</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              A modern, scalable task management application built with React, 
              featuring JWT authentication, real-time CRUD operations, and a beautiful UI.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <Button size="lg" onClick={() => navigate('/auth')} className="gap-2 glow">
                Start for Free
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/auth')}>
                View Demo
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-24 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="glass glass-hover p-6 rounded-2xl text-center animate-slide-up"
                style={{ animationDelay: `${0.4 + index * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Tech Stack */}
          <div className="text-center mt-24 animate-slide-up" style={{ animationDelay: '0.7s' }}>
            <p className="text-sm text-muted-foreground mb-4">Built with modern technologies</p>
            <div className="flex items-center justify-center gap-8 flex-wrap text-muted-foreground">
              <span className="font-mono text-sm">React</span>
              <span className="font-mono text-sm">TypeScript</span>
              <span className="font-mono text-sm">TailwindCSS</span>
              <span className="font-mono text-sm">Supabase</span>
              <span className="font-mono text-sm">JWT Auth</span>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="container mx-auto px-4 py-8 text-center text-muted-foreground text-sm">
          <p>Frontend Developer Internship Assignment • 2024</p>
        </footer>
      </div>
    </div>
  );
}
