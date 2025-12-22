import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border/50 bg-cream py-8">
        <div className="container px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Spiritual Network Directory. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">
              Connecting souls worldwide
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
