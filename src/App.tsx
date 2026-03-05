import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import HowItWorks from "./pages/HowItWorks";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import SchedulePost from "./pages/SchedulePost";
import CalendarPage from "./pages/CalendarPage";
import StatsPage from "./pages/StatsPage";
import ResetPassword from "./pages/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";
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
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/comment-ca-fonctionne" element={<HowItWorks />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboard/programmer" element={<ProtectedRoute><SchedulePost /></ProtectedRoute>} />
            <Route path="/dashboard/calendrier" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
            <Route path="/dashboard/statistiques" element={<ProtectedRoute><StatsPage /></ProtectedRoute>} />
            <Route path="/reset-password" element={<ResetPassword />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
