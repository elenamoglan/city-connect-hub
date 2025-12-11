import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { MapPin, FileText, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';

const features = [
  {
    icon: MapPin,
    title: 'Location-Based Reporting',
    description: 'Pin exact locations on an interactive map to help city workers find and fix issues quickly.',
  },
  {
    icon: FileText,
    title: 'Detailed Issue Tracking',
    description: 'Upload photos and descriptions. Track your reports from submission to resolution.',
  },
  {
    icon: Shield,
    title: 'Secure & Transparent',
    description: 'Your reports are handled securely with full transparency on status updates.',
  },
];

const stats = [
  { value: '5,000+', label: 'Issues Resolved' },
  { value: '15K+', label: 'Active Citizens' },
  { value: '< 48hrs', label: 'Avg Response Time' },
];

export default function Index() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden hero-gradient text-primary-foreground">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-slide-up">
              Building a Better City,
              <br />
              <span className="text-accent">Together</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Report infrastructure issues, track their resolution, and help make your community safer and more livable.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
              {user ? (
                <>
                  <Button variant="hero" size="xl" onClick={() => navigate('/report')}>
                    Report an Issue
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="xl" 
                    className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20"
                    onClick={() => navigate('/map')}
                  >
                    View Issue Map
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="hero" size="xl" onClick={() => navigate('/auth?mode=signup')}>
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="xl" 
                    className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20"
                    onClick={() => navigate('/auth')}
                  >
                    Sign In
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Stats Section */}
      <section className="py-12 border-b border-border bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-serif font-bold text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Empowering citizens to improve their neighborhoods through easy-to-use reporting tools.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card-civic p-8 text-center group"
              >
                <div className="w-14 h-14 rounded-xl civic-gradient flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="font-serif text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Ready to Make a Difference?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of engaged citizens who are helping build better communities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle2 className="h-5 w-5 text-secondary" />
                <span>Free to use</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle2 className="h-5 w-5 text-secondary" />
                <span>No commitment</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle2 className="h-5 w-5 text-secondary" />
                <span>Real impact</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 font-serif font-semibold">
              <MapPin className="h-5 w-5 text-primary" />
              SmartCity
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 SmartCity. Building better communities together.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
