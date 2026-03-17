import { useState } from 'react';
import { 
  Search, 
  Folder, 
  FolderPlus, 
  ChevronDown, 
  ChevronRight,
  Scale,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dossier } from '@/types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mock dossiers for demonstration
const mockDossiers: Dossier[] = [
  { id: '1', name: 'Affaire Dupont', createdAt: new Date(), updatedAt: new Date(), searchCount: 5 },
  { id: '2', name: 'Dossier Fraude fiscale', createdAt: new Date(), updatedAt: new Date(), searchCount: 3 },
  { id: '3', name: 'Procédure Müller', createdAt: new Date(), updatedAt: new Date(), searchCount: 8 },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [dossiersExpanded, setDossiersExpanded] = useState(true);
  const [activeDossierId, setActiveDossierId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'search' | 'dossiers'>('search');

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-foreground/20 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-72 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo and header */}
        <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Scale className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-serif text-lg font-semibold text-sidebar-foreground">
                SKANDAMIS
              </h1>
              <p className="text-xs text-muted-foreground">Recherche juridique</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 py-4">
          <nav className="px-3 space-y-1">
            {/* New Search */}
            <button
              onClick={() => setActiveSection('search')}
              className={cn(
                "nav-item w-full",
                activeSection === 'search' && "active"
              )}
            >
              <Search className="w-5 h-5" />
              <span>Nouvelle recherche</span>
            </button>

            {/* Dossiers section */}
            <div className="pt-4">
              <button
                onClick={() => setDossiersExpanded(!dossiersExpanded)}
                className="nav-item w-full justify-between"
              >
                <div className="flex items-center gap-3">
                  <Folder className="w-5 h-5" />
                  <span>Dossiers</span>
                </div>
                {dossiersExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>

              {dossiersExpanded && (
                <div className="ml-4 mt-1 space-y-0.5 border-l border-sidebar-border pl-4">
                  {mockDossiers.map((dossier) => (
                    <button
                      key={dossier.id}
                      onClick={() => {
                        setActiveDossierId(dossier.id);
                        setActiveSection('dossiers');
                      }}
                      className={cn(
                        "nav-item w-full text-sm",
                        activeDossierId === dossier.id && activeSection === 'dossiers' && "active"
                      )}
                    >
                      <span className="truncate">{dossier.name}</span>
                      <span className="ml-auto text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                        {dossier.searchCount}
                      </span>
                    </button>
                  ))}

                  {/* Add new dossier button */}
                  <button className="nav-item w-full text-sm text-muted-foreground hover:text-foreground">
                    <FolderPlus className="w-4 h-4" />
                    <span>Nouveau dossier</span>
                  </button>
                </div>
              )}
            </div>
          </nav>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
              <span className="text-sm font-medium text-secondary-foreground">AS</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                Avocat
              </p>
              <p className="text-xs text-muted-foreground truncate">
                Étude SKANDAMIS
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
