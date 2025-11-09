import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { BarChart3, User, LogOut, Wallet } from 'lucide-react';

const Header = ({ user, onLogout, currentPage }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="flex items-center space-x-3" data-testid="logo-link">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FF9933 0%, #138808 100%)' }}>
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold" style={{ background: 'linear-gradient(135deg, #FF9933 0%, #138808 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                BollywoodSensex
              </span>
            </Link>

            <nav className="hidden md:flex space-x-6">
              <Link 
                to="/dashboard" 
                data-testid="nav-dashboard"
                className={`font-medium transition-colors ${
                  currentPage === 'dashboard' 
                    ? 'text-orange-600' 
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                Dashboard
              </Link>
              <Link 
                to="/trading" 
                data-testid="nav-trading"
                className={`font-medium transition-colors ${
                  currentPage === 'trading' 
                    ? 'text-orange-600' 
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                Trading
              </Link>
              <Link 
                to="/portfolio" 
                data-testid="nav-portfolio"
                className={`font-medium transition-colors ${
                  currentPage === 'portfolio' 
                    ? 'text-orange-600' 
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                Portfolio
              </Link>
              <Link 
                to="/market" 
                data-testid="nav-market"
                className={`font-medium transition-colors ${
                  currentPage === 'market' 
                    ? 'text-orange-600' 
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                Market
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-green-50 rounded-lg">
              <Wallet className="w-4 h-4 text-green-700" />
              <span className="font-medium text-green-700" data-testid="header-balance">
                ₹{user?.balance?.toLocaleString('en-IN') || '0'}
              </span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="rounded-full" data-testid="user-menu-trigger">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-green-700 flex items-center justify-center text-white font-semibold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div>
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-xs text-slate-500 font-normal">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" data-testid="logout-btn" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
