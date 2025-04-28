import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useLanguage } from '@/context/LanguageContext';

interface HeaderProps {
  toggleSidebar: () => void;
}

export function Header({ toggleSidebar }: HeaderProps) {
  const { logout, isAuthenticated, isAdmin, currentUser } = useAuth();
  const isMobile = useIsMobile();

  return (
    <header className="flex items-center justify-between px-3 md:px-4 py-3 bg-brand-blue text-white shadow-md">
      <div className="flex items-center gap-2 md:gap-4">
        {isAuthenticated && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="text-white hover:bg-brand-lightBlue"
          >
            <Menu />
          </Button>
        )}
        <Link to="/" className="flex items-center gap-1 md:gap-2">
          {!isMobile && (
            <>
              <span className="text-sm font-light">|</span>
              <span className="text-lg md:text-xl font-bold">DevSphere Online IT</span>
              <span className="ml-1 md:ml-2 text-xs md:text-sm">Академия</span>
            </>
          )}
          {isMobile && (
            <span className="text-xs ml-1">Академия</span>
          )}
        </Link>
      </div>

      <div className="flex items-center gap-2">
        {/* <LanguageSelector /> */}
        
        {isAuthenticated ? (
          <div className="flex items-center gap-2 md:gap-4">
            {!isMobile && (
              <span className="text-sm">
                {isAdmin ? 'Администратор' : 'Пользователь'}: {currentUser?.username}
              </span>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-1 md:gap-2 hover:bg-brand-lightBlue px-2"
              onClick={logout}
            >
              <LogOut size={16} />
              {!isMobile && <span>Выход</span>}
            </Button>
          </div>
        ) : (
          <div>
            <Link to="/login">
              <Button variant="outline" size={isMobile ? "sm" : "default"} className="border-white text-white hover:bg-brand-lightBlue">
              Авторизоваться
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
