import "./global.css";

import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { mockUsers, User } from "@/data/mockData";
import Index from "./pages/Index";
import PayDues from "./pages/PayDues";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);

  const handlePaymentSuccess = (paidUserIds: string[]) => {
    setUsers(prev => prev.map(user =>
      paidUserIds.includes(user.id)
        ? { ...user, paymentStatus: 'Paid' as const }
        : user
    ));
  };

  return (
    <Routes>
      <Route path="/" element={<Index users={users} setUsers={setUsers} />} />
      <Route path="/pay-dues" element={<PayDues users={users} onPaymentSuccess={handlePaymentSuccess} />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
