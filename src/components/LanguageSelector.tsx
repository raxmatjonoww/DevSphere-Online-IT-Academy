
import React from 'react';
import { useLanguage, Language } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const LanguageSelector = () => {
  const { language, setLanguage, availableLanguages } = useLanguage();
  
  const getLanguageName = (code: Language): string => {
    switch (code) {
      case 'ru': return 'Русский';
      default: return code;
    }
  };
  
  const getFlag = (code: Language): string => {
    switch (code) {
      case 'ru': return '🇷🇺';
      default: return '🌐';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-2 text-white hover:bg-brand-lightBlue"
        >
          <Globe size={16} />
          <span className="flex items-center gap-1">
            {getFlag(language)}
            <span className="hidden md:inline">{getLanguageName(language)}</span>
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        {availableLanguages.map((lang) => (
          <DropdownMenuItem 
            key={lang.code} 
            onClick={() => setLanguage(lang.code)}
            className={`flex items-center gap-2 ${language === lang.code ? "bg-accent" : ""}`}
          >
            <span className="text-lg">{getFlag(lang.code)}</span>
            <span className="flex-1">{getLanguageName(lang.code)}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
