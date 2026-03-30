'use client';

import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';

export function LanguageToggle() {
  const { language, setLanguage } = useStore();

  return (
    <div className="flex items-center gap-1 rounded-lg bg-secondary p-1">
      <Button
        variant={language === 'en' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setLanguage('en')}
        className="h-8 px-3 text-sm font-medium"
      >
        EN
      </Button>
      <Button
        variant={language === 'bn' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setLanguage('bn')}
        className="h-8 px-3 text-sm font-medium"
      >
        বাং
      </Button>
    </div>
  );
}
