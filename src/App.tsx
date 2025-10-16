import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import Toaster from "@/components/ui/toaster"; // Changed import to use default (if correct)
import Sonner from "@/components/ui/sonner";
import IndexPage from "@/pages/Index";
import RegionPage from "@/pages/RegionPage";
import NotFound from "@/pages/NotFound";


const queryClient = new QueryClient();

// Use a single inline default export to fix potential conflict
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Sonner />
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="/region/:region" element={<RegionPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
