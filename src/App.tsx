import { ROUTER_BASE } from "@/lib/basePath";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CookieConsent } from "@/components/common/CookieConsent";
import { Analytics } from "@vercel/analytics/react";
import Index from "./pages/Index";
import RegionPage from "./pages/RegionPage";
import NotFound from "./pages/NotFound";
import DesignSystem from "./pages/DesignSystem";
import AdminRegions from "./pages/AdminRegions";
import Auth from "./pages/Auth";
import { Helmet } from "react-helmet-async";
import { RequireAdmin } from "@/components/admin/RequireAdmin";

const NoIndex = ({ children }: { children: React.ReactNode }) => (
  <>
    <Helmet><meta name="robots" content="noindex, nofollow" /></Helmet>
    {children}
  </>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <CookieConsent />
      <BrowserRouter basename={ROUTER_BASE}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/design-system" element={<NoIndex><DesignSystem /></NoIndex>} />
          <Route path="/auth" element={<NoIndex><Auth /></NoIndex>} />
          <Route path="/admin/regions" element={<NoIndex><RequireAdmin><AdminRegions /></RequireAdmin></NoIndex>} />
          <Route path="/404" element={<NotFound />} />
          <Route path="/:region" element={<RegionPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Analytics />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
