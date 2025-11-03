import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import semoLogo from '/semo-codetutor-logo.svg';

export const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardRoute = () => {
    if (user) {
      return `/dashboard/${user.role}`;
    }
    return '/dashboard/student';
  };

  return (
    <header className="animated-gradient border-b shadow-[0_4px_12px_rgba(0,0,0,0.15)] sticky top-0 z-50 transition-all duration-300">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">💻</span>
            <span>SEMO CodeTutor AI</span>
          </h1>
        </Link>

        <nav className="flex items-center gap-4">
          <Link to="/learn" className="nav-link text-sm text-white hover:text-white/90 font-medium transition-all hover:text-glow">Learn</Link>
          <Link to="/ai-tutor" className="nav-link text-sm text-white hover:text-white/90 font-medium transition-all hover:text-glow">AI Tutor</Link>
          <Link to="/resources" className="nav-link text-sm text-white hover:text-white/90 font-medium transition-all hover:text-glow">Resources</Link>
          <Link to="/about" className="nav-link text-sm text-white hover:text-white/90 font-medium transition-all hover:text-glow">About</Link>
          <Link to="/help" className="nav-link text-sm text-white hover:text-white/90 font-medium transition-all hover:text-glow">Help</Link>
          {!isAuthenticated ? (
            <>
              <Link to="/login">
                <Button variant="ghost" className="text-white hover:bg-white/20 hover:text-white">Sign In</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-white text-[#b30000] hover:bg-white/90 shadow-[0_4px_10px_rgba(255,255,255,0.3)] hover:shadow-[0_6px_16px_rgba(255,255,255,0.4)] font-semibold">Get Started</Button>
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link to={getDashboardRoute()}>
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  {user.name} • <span className="capitalize">{user.role}</span>
                </span>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  Sign Out
                </Button>
              </div>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};