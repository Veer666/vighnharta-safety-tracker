
import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, FileText, Search, AlertTriangle } from 'lucide-react';

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const navItems = [
    { path: '/', label: 'Home', icon: Shield },
    { path: '/file-fir', label: 'File FIR', icon: FileText },
    { path: '/track-case', label: 'Track Case', icon: Search },
    { path: '/emergency', label: 'Emergency', icon: AlertTriangle, highlight: true },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 px-4 transition-all duration-300 ease-apple',
        scrolled 
          ? 'py-2 bg-white/80 dark:bg-black/80 backdrop-blur-lg shadow-sm' 
          : 'py-4 bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <Shield className="h-6 w-6 text-primary" />
          <span className="font-semibold text-xl tracking-tight">Vighnharta</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-apple',
                location.pathname === item.path
                  ? 'bg-primary text-primary-foreground'
                  : item.highlight
                    ? 'bg-destructive/10 text-destructive hover:bg-destructive/20'
                    : 'hover:bg-secondary'
              )}
            >
              <div className="flex items-center space-x-2">
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </div>
            </button>
          ))}
        </nav>
        
        <div className="md:hidden">
          {/* Mobile menu button will go here */}
          <button className="p-2 rounded-full hover:bg-secondary">
            <span className="sr-only">Open menu</span>
            <div className="w-5 h-0.5 bg-foreground mb-1"></div>
            <div className="w-5 h-0.5 bg-foreground mb-1"></div>
            <div className="w-5 h-0.5 bg-foreground"></div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
