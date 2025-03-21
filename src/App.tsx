
import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import SOSButton from "./components/SOSButton";

// Lazy-loaded pages
const Index = lazy(() => import("./pages/Index"));
const FIRForm = lazy(() => import("./components/FIRForm"));
const CaseTracker = lazy(() => import("./components/CaseTracker"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Loading fallback
const PageLoading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-pulse-slow h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
      <div className="h-8 w-8 rounded-full bg-primary/20 animate-pulse"></div>
    </div>
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <NavBar />
        <Suspense fallback={<PageLoading />}>
          <div className="pt-16"> {/* Add padding to account for fixed navbar */}
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/file-fir" element={
                <div className="container mx-auto p-4 py-8">
                  <FIRForm />
                </div>
              } />
              <Route path="/track-case" element={
                <div className="container mx-auto p-4 py-8">
                  <CaseTracker />
                </div>
              } />
              <Route path="/emergency" element={
                <div className="container mx-auto p-4 py-8">
                  <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-3xl font-bold mb-6">Emergency Assistance</h1>
                    <p className="text-lg mb-8">
                      In case of emergency, press and hold the SOS button for 2 seconds to alert the nearest police station and send your location.
                    </p>
                    <div className="inline-block p-8 rounded-full bg-destructive/10 animate-pulse-slow">
                      <div className="p-4 rounded-full bg-destructive/20">
                        <SOSButton />
                      </div>
                    </div>
                  </div>
                </div>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
