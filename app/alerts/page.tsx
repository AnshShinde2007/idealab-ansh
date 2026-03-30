import { AlertsPage } from '@/components/alerts-page';
import { Navigation, Header } from '@/components/navigation';

export default function Alerts() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <AlertsPage />
      <Navigation />
    </main>
  );
}
