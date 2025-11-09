import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { BarChart3, Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Login successful!');
        onLogin(data.token, data.user);
        navigate('/dashboard');
      } else {
        toast.error(data.detail || 'Login failed');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'linear-gradient(to bottom right, #FFF5E6, #E8F5E8)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FF9933 0%, #138808 100%)' }}>
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold" style={{ background: 'linear-gradient(135deg, #FF9933 0%, #138808 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              BollywoodSensex
            </span>
          </Link>
        </div>

        <Card className="border-2" style={{ borderColor: '#FF9933' }}>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Login to continue trading Bollywood movie stocks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    data-testid="login-email-input"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    data-testid="login-password-input"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
              </div>

              <Button
                type="submit"
                data-testid="login-submit-btn"
                className="w-full font-medium"
                disabled={isLoading}
                style={{ background: 'linear-gradient(135deg, #FF9933 0%, #138808 100%)' }}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-slate-600">Don't have an account? </span>
              <Link to="/register" data-testid="register-link" className="font-medium" style={{ color: '#FF9933' }}>
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
