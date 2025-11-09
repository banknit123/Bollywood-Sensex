import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { TrendingUp, TrendingDown, BarChart3, Star, Users, Zap, Shield, Clock } from 'lucide-react';

const LandingPage = ({ isAuthenticated }) => {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom right, #FFF5E6, #E8F5E8)' }}>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-orange-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FF9933 0%, #138808 100%)' }}>
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold" style={{ background: 'linear-gradient(135deg, #FF9933 0%, #138808 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                BollywoodSensex
              </span>
            </div>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <Link to="/dashboard" data-testid="dashboard-link">
                  <Button className="font-medium" style={{ background: 'linear-gradient(135deg, #FF9933 0%, #138808 100%)' }}>
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/login" data-testid="login-link">
                    <Button variant="ghost" className="font-medium">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register" data-testid="register-link">
                    <Button className="font-medium" style={{ background: 'linear-gradient(135deg, #FF9933 0%, #138808 100%)' }}>
                      Start Trading
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center max-w-5xl">
          <Badge className="mb-6 px-4 py-2 text-sm" style={{ background: 'linear-gradient(135deg, #FF9933 0%, #138808 100%)' }}>
            India's First Movie Stock Exchange
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6" style={{ color: '#1e293b' }}>
            Trade Bollywood
            <br />
            <span style={{ background: 'linear-gradient(135deg, #FF9933 0%, #138808 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Movie Stocks
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 mb-10 max-w-3xl mx-auto">
            The premier platform for trading Bollywood movie stocks. Invest in your favorite films,
            track box office performance, and build your entertainment portfolio.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/register" data-testid="hero-register-btn">
              <Button size="lg" className="text-lg px-10 py-6" style={{ background: 'linear-gradient(135deg, #FF9933 0%, #138808 100%)' }}>
                Start Trading with ₹1,00,000
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-10 py-6 border-orange-500 text-orange-700">
              Learn How It Works
            </Button>
          </div>
          <div className="mt-8 flex items-center justify-center gap-8 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-orange-600" />
              <span>10,000+ Traders</span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-green-700" />
              <span>100+ Movies Listed</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-orange-600" />
              <span>Real-time Trading</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">Why Choose BollywoodSensex?</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Experience the future of entertainment investing with our comprehensive platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="hover:shadow-xl transition-all duration-300 border-2 border-orange-100">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FF9933 0%, #138808 100%)' }}>
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-slate-900">Real-time Trading</h3>
                <p className="text-slate-600">
                  Trade movie stocks with real-time pricing based on demand-supply dynamics,
                  market sentiment, and trading volume.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 border-2 border-green-100">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #138808 0%, #2D7A2E 100%)' }}>
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-slate-900">Safe & Secure</h3>
                <p className="text-slate-600">
                  Start with ₹1,00,000 in virtual funds. Practice trading strategies
                  without any real financial risk.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 border-2 border-orange-100">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FF9933 0%, #FF6B35 100%)' }}>
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-slate-900">Latest Movies</h3>
                <p className="text-slate-600">
                  Access a wide range of Bollywood movies with detailed information,
                  cast details, and release dates.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">How It Works</h2>
            <p className="text-xl text-slate-600">
              Start trading in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl font-bold text-white" style={{ background: 'linear-gradient(135deg, #FF9933 0%, #138808 100%)' }}>
                1
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-slate-900">Sign Up</h3>
              <p className="text-slate-600">
                Create your free account and receive ₹1,00,000 in virtual funds to start trading immediately.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl font-bold text-white" style={{ background: 'linear-gradient(135deg, #FF9933 0%, #138808 100%)' }}>
                2
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-slate-900">Browse Movies</h3>
              <p className="text-slate-600">
                Explore our extensive collection of Bollywood movies and analyze their market potential.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl font-bold text-white" style={{ background: 'linear-gradient(135deg, #FF9933 0%, #138808 100%)' }}>
                3
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-slate-900">Start Trading</h3>
              <p className="text-slate-600">
                Buy and sell movie stocks, track your portfolio, and watch your investments grow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: 'linear-gradient(135deg, #FF9933 0%, #138808 100%)' }}>
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Ready to Start Trading?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of traders and start building your Bollywood movie portfolio today!
          </p>
          <Link to="/register" data-testid="cta-register-btn">
            <Button size="lg" className="text-lg px-10 py-6 bg-white text-orange-600 hover:bg-slate-50">
              Get Started with ₹1,00,000 Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FF9933 0%, #138808 100%)' }}>
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">BollywoodSensex</span>
              </div>
              <p className="text-slate-400">
                India's premier platform for trading Bollywood movie stocks.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Trading</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Market Overview</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Top Gainers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Top Losers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Trending Movies</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Trading Guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2025 BollywoodSensex. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
