import { DashboardPage } from '@/components/dashboard-page';
import { Navigation, Header } from '@/components/navigation';

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <DashboardPage />
      <Navigation />
    </main>
  );
}
