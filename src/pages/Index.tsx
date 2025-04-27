
import Timer from '@/components/Timer';
import Settings from '@/components/Settings';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const Index = () => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="w-full max-w-md mx-auto">
        <div className="flex justify-end mb-4">
          <Button
            variant="outline"
            onClick={() => setShowSettings(!showSettings)}
          >
            {showSettings ? 'Hide Settings' : 'Show Settings'}
          </Button>
        </div>

        {showSettings ? (
          <Settings />
        ) : (
          <Timer />
        )}
      </div>
    </div>
  );
};

export default Index;
