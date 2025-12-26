import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { Globe, User, LogOut, Shield, Menu, X } from 'lucide-react';
import { useState } from 'react';

export const Header = () => {
  const { user, signOut, isAdmin, isMember } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Home' },
    ...(user ? [
      { to: '/directory', label: 'Directory' },
      { to: '/announcements', label: 'Announcements' },
    ] : []),
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform group-hover:scale-105">
            <Globe className="h-5 w-5" />
          </div>
          <span className="font-serif text-xl font-semibold text-foreground">
            Spiritual Network
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive(link.to) ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              {isAdmin && (
                <Button variant="subtle" size="sm" asChild>
                  <Link to="/admin">
                    <Shield className="h-4 w-4 mr-1" />
                    Admin
                  </Link>
                </Button>
              )}
              {isMember && (
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/profile">
                    <User className="h-4 w-4 mr-1" />
                    Profile
                  </Link>
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-1" />
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
              <Button variant="default" size="sm" asChild>
                <Link to="/auth?mode=signup">Join Us</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background animate-fade-in">
          <nav className="container flex flex-col gap-2 p-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-border my-2" />
            {user ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted flex items-center gap-2"
                  >
                    <Shield className="h-4 w-4" />
                    Admin Dashboard
                  </Link>
                )}
                {isMember && (
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    My Profile
                  </Link>
                )}
                <button
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted flex items-center gap-2 text-left"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/auth"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth?mode=signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground text-center"
                >
                  Join Us
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
