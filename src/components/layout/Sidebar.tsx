import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Users, 
  FolderTree, 
  Video, 
  BookOpen,
  ChevronRight,
  X,
  GraduationCap,
  FileText,
  Award,
  MessageCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';

interface SidebarProps {
  isOpen: boolean;
}

export function Sidebar({ isOpen }: SidebarProps) {
  const { isAdmin, isTeacher, isAuthenticated } = useAuth();
  const isMobile = useIsMobile();
  const { t } = useLanguage();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black/50 z-20"
          onClick={(e) => e.stopPropagation()}
        />
      )}
      
      <aside 
        className={cn(
          "fixed left-0 top-16 h-[calc(100vh-64px)] bg-brand-blue text-white transition-all duration-300 z-30 shadow-lg overflow-hidden",
          isOpen ? (isMobile ? "w-4/5 sm:w-64" : "w-64") : "w-0"
        )}
      >
        <nav className="p-4 h-full flex flex-col">
          {/* Close button - only visible on mobile */}
          {isMobile && isOpen && (
            <div className="flex justify-end mb-4 -mt-1 -mr-1">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-brand-lightBlue"
                onClick={(e) => {
                  e.stopPropagation();
                  // Dispatch a custom event to notify the Layout component
                  window.dispatchEvent(new CustomEvent('toggle-sidebar'));
                }}
              >
                <X size={18} />
              </Button>
            </div>
          )}
          
          <ul className="space-y-2 flex-1">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-4 py-2 rounded-md hover:bg-brand-lightBlue transition-colors",
                    isActive && "bg-brand-lightBlue"
                  )
                }
              >
                <Home size={18} />
                <span>Домашняя страница</span>
              </NavLink>
            </li>
            
            <li>
              <NavLink
                to="/lessons"
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-4 py-2 rounded-md hover:bg-brand-lightBlue transition-colors",
                    isActive && "bg-brand-lightBlue"
                  )
                }
              >
                <BookOpen size={18} />
                <span>Мои уроки</span>
              </NavLink>
            </li>

            {isTeacher && (
              <>
                <li className="pt-4">
                  <div className="flex items-center px-4 pb-2 text-sm text-gray-400">
                    <ChevronRight size={14} />
                    <span>Панель учителя</span>
                  </div>
                </li>
                <li>
                  <NavLink
                    to="/teacher/lessons"
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 px-4 py-2 rounded-md hover:bg-brand-lightBlue transition-colors",
                        isActive && "bg-brand-lightBlue"
                      )
                    }
                  >
                    <Video size={18} />
                    <span>Мои материалы</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/teacher/homework"
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 px-4 py-2 rounded-md hover:bg-brand-lightBlue transition-colors",
                        isActive && "bg-brand-lightBlue"
                      )
                    }
                  >
                    <FileText size={18} />
                    <span>Проверка домашнего задания</span>
                  </NavLink>
                </li>
              </>
            )}

            {isAdmin && (
              <>
                <li className="pt-4">
                  <div className="flex items-center px-4 pb-2 text-sm text-gray-400">
                    <ChevronRight size={14} />
                    <span>Панель администратора</span>
                  </div>
                </li>
                <li>
                  <NavLink
                    to="/admin/dashboard"
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 px-4 py-2 rounded-md hover:bg-brand-lightBlue transition-colors",
                        isActive && "bg-brand-lightBlue"
                      )
                    }
                  >
                    <Home size={18} />
                    <span>Панель управления</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/admin/users"
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 px-4 py-2 rounded-md hover:bg-brand-lightBlue transition-colors",
                        isActive && "bg-brand-lightBlue"
                      )
                    }
                  >
                    <Users size={18} />
                    <span>Пользователи</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/admin/teachers"
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 px-4 py-2 rounded-md hover:bg-brand-lightBlue transition-colors",
                        isActive && "bg-brand-lightBlue"
                      )
                    }
                  >
                    <GraduationCap size={18} />
                    <span>Учителя</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/admin/categories"
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 px-4 py-2 rounded-md hover:bg-brand-lightBlue transition-colors",
                        isActive && "bg-brand-lightBlue"
                      )
                    }
                  >
                    <FolderTree size={18} />
                    <span>Категории</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/admin/lessons"
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 px-4 py-2 rounded-md hover:bg-brand-lightBlue transition-colors",
                        isActive && "bg-brand-lightBlue"
                      )
                    }
                  >
                    <Video size={18} />
                    <span>Уроки</span>
                  </NavLink>
                </li>
              </>
            )}
            
            {isAuthenticated && (
              <li>
                <NavLink
                  to="/chat"
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-4 py-2 rounded-md hover:bg-brand-lightBlue transition-colors",
                      isActive && "bg-brand-lightBlue"
                    )
                  }
                >
                  <MessageCircle size={18} />
                  <span>Сообщения</span>
                </NavLink>
              </li>
            )}
          </ul>
        </nav>
      </aside>
    </>
  );
}
