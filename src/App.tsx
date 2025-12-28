import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/lib/auth-context";
import { DevoteeRoute } from "@/components/DevoteeRoute";
import { AdminRoute } from "@/components/AdminRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Guidelines from "./pages/Guidelines";
import Directory from "./pages/Directory";
import Profile from "./pages/Profile";
import Announcements from "./pages/Announcements";
import NewAnnouncement from "./pages/NewAnnouncement";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes - accessible to everyone */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/about" element={<About />} />
            <Route path="/guidelines" element={<Guidelines />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Profile route - requires authentication but NOT a profile (so users can create one) */}
            <Route path="/profile" element={<Profile />} />
            
            {/* Devotee routes - requires authentication AND a profile */}
            <Route path="/directory" element={<DevoteeRoute><Directory /></DevoteeRoute>} />
            <Route path="/announcements" element={<DevoteeRoute><Announcements /></DevoteeRoute>} />
            <Route path="/announcements/new" element={<DevoteeRoute><NewAnnouncement /></DevoteeRoute>} />
            
            {/* Admin routes - requires admin role */}
            <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
