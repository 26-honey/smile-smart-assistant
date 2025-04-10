
import React from 'react';
import { Tooth } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b py-4 px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-dental-teal rounded-full p-1.5">
            <Tooth className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-medium text-dental-dark-blue">SmileSmartAssistant</h1>
        </div>
        <div className="text-sm text-muted-foreground">
          Your AI Dental Assistant
        </div>
      </div>
    </header>
  );
};

export default Header;
