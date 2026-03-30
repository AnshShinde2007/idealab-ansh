import { FeedPage } from '@/components/feed-page';
import { Navigation, Header } from '@/components/navigation';

export default function Feed() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <FeedPage />
      <Navigation />
    </main>
  );
}
