import { Switch, Route, Router as WouterRouter, Link, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

// Public pages
import { PublicLayout } from "@/components/layouts/PublicLayout";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { HomePage } from "@/pages/HomePage";
import { ServicesPageWrapper } from "@/pages/ServicesPageWrapper";
import { AboutPageWrapper } from "@/pages/AboutPageWrapper";
import { ContactPageWrapper } from "@/pages/ContactPageWrapper";
import { BookingPageWrapper } from "@/pages/BookingPageWrapper";
import { FaqPageWrapper } from "@/pages/FaqPageWrapper";
import { CuidadosPageWrapper } from "@/pages/CuidadosPageWrapper";
import { PromocoesPageWrapper } from "@/pages/PromocoesPageWrapper";

// Admin pages
import { AdminLoginPageWrapper } from "@/pages/admin/AdminLoginPageWrapper";
import { AdminDashboardWrapper } from "@/pages/admin/AdminDashboardWrapper";
import { AdminBookingsWrapper } from "@/pages/admin/AdminBookingsWrapper";
import { AdminServicesWrapper } from "@/pages/admin/AdminServicesWrapper";
import { AdminSettingsWrapper } from "@/pages/admin/AdminSettingsWrapper";
import { AdminReportsWrapper } from "@/pages/admin/AdminReportsWrapper";

const queryClient = new QueryClient();

function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-white/60">Página não encontrada</p>
        <Link href="/" className="mt-4 inline-block text-[#D4AF37] hover:underline">Voltar ao início</Link>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/">
        <PublicLayout><HomePage /></PublicLayout>
      </Route>
      <Route path="/servicos">
        <PublicLayout><ServicesPageWrapper /></PublicLayout>
      </Route>
      <Route path="/sobre">
        <PublicLayout><AboutPageWrapper /></PublicLayout>
      </Route>
      <Route path="/contato">
        <PublicLayout><ContactPageWrapper /></PublicLayout>
      </Route>
      <Route path="/agendar">
        <PublicLayout><BookingPageWrapper /></PublicLayout>
      </Route>
      <Route path="/faq">
        <PublicLayout><FaqPageWrapper /></PublicLayout>
      </Route>
      <Route path="/cuidados">
        <PublicLayout><CuidadosPageWrapper /></PublicLayout>
      </Route>
      <Route path="/promocoes">
        <PublicLayout><PromocoesPageWrapper /></PublicLayout>
      </Route>

      {/* Admin routes */}
      <Route path="/admin/login">
        <AdminLoginPageWrapper />
      </Route>
      <Route path="/admin/agendamentos">
        <AdminLayout><AdminBookingsWrapper /></AdminLayout>
      </Route>
      <Route path="/admin/servicos">
        <AdminLayout><AdminServicesWrapper /></AdminLayout>
      </Route>
      <Route path="/admin/configuracoes">
        <AdminLayout><AdminSettingsWrapper /></AdminLayout>
      </Route>
      <Route path="/admin/relatorios">
        <AdminLayout><AdminReportsWrapper /></AdminLayout>
      </Route>
      <Route path="/admin">
        <AdminLayout><AdminDashboardWrapper /></AdminLayout>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Router />
        <Toaster position="top-right" richColors />
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
