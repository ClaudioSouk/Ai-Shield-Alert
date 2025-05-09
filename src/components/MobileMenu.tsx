import React, { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const MobileMenu = () => {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, logout, profile } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    navigate('/');
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[80%] sm:w-[350px]">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between border-b py-4">
            <span className="text-lg font-bold">AI Shield Alert</span>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {isAuthenticated && (
            <div className="py-4 px-2 border-b">
              <div className="font-medium">
                {profile?.full_name || 'User'}
              </div>
              <div className="text-sm text-muted-foreground">
                {profile?.email}
              </div>
            </div>
          )}
          
          <nav className="flex flex-col gap-4 py-6">
            <Link to="/about" className="px-2 py-2 text-lg hover:text-primary transition-colors" onClick={() => setOpen(false)}>About</Link>
            <a href="/#features" className="px-2 py-2 text-lg hover:text-primary transition-colors" onClick={() => setOpen(false)}>Features</a>
            <a href="/#how-it-works" className="px-2 py-2 text-lg hover:text-primary transition-colors" onClick={() => setOpen(false)}>How It Works</a>
            <a href="/#testimonials" className="px-2 py-2 text-lg hover:text-primary transition-colors" onClick={() => setOpen(false)}>Testimonials</a>
            <a href="/#pricing" className="px-2 py-2 text-lg hover:text-primary transition-colors" onClick={() => setOpen(false)}>Pricing</a>
            <Link to="/blog" className="px-2 py-2 text-lg hover:text-primary transition-colors" onClick={() => setOpen(false)}>Blog</Link>
            <a href="/#faq" className="px-2 py-2 text-lg hover:text-primary transition-colors" onClick={() => setOpen(false)}>FAQ</a>
            {isAuthenticated && (
              <Link to="/dashboard" className="px-2 py-2 text-lg hover:text-primary transition-colors" onClick={() => setOpen(false)}>Dashboard</Link>
            )}
          </nav>
          <div className="mt-auto flex flex-col gap-2 border-t pt-6">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" onClick={() => setOpen(false)}>
                  <Button className="w-full">Dashboard</Button>
                </Link>
                <Button variant="outline" className="w-full" onClick={handleLogout}>Log Out</Button>
              </>
            ) : (
              <>
                <Link to="/auth" onClick={() => setOpen(false)}>
                  <Button variant="outline" className="w-full">Log In</Button>
                </Link>
                <Link to="/#pricing" onClick={() => setOpen(false)}>
                  <Button className="w-full">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
