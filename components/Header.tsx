import React from 'react';
import SparklesIcon from './icons/SparklesIcon';

const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-[var(--rich-blue)]/20 p-4 sticky top-0 z-10">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SparklesIcon className="h-8 w-8 text-[var(--rich-blue)]" />
          <h1 className="text-2xl font-bold tracking-tight text-[var(--rich-blue)]">
            Poster Designer by TFB
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;