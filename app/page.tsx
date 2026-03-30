import { ReportPage } from '@/components/report-page';
import { Navigation } from '@/components/navigation';
import { Header } from '@/components/navigation';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <ReportPage />
      <Navigation />
    </main>
  );
}
