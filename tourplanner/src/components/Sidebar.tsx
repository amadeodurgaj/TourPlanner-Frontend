import { Menu, X, Plus } from "lucide-react";
import { cn } from "../lib/utils";
import { TourList } from "./TourList";
import type { Tour } from "@/types/api";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTour: () => void;
  tours?: Tour[];
  selectedTourId?: string;
  onSelectTour?: (tour: Tour) => void;
  onDeleteTour?: (id: string) => void;
}

export function Sidebar({
  isOpen,
  onClose,
  onCreateTour,
  tours = [],
  selectedTourId,
  onSelectTour,
  onDeleteTour,
}: SidebarProps) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-72 bg-primary border-r border-border/50 transition-transform duration-300 ease-out md:translate-x-0 md:top-navbar md:left-0 md:h-[calc(100vh-navbar)] md:w-72",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-border/50 md:hidden">
            <h2 className="text-xl font-bold text-secondary">Tours</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-muted hover:text-secondary hover:bg-primary transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-muted-light uppercase tracking-wider">
                Your Tours
              </h2>
              <span className="text-xs text-muted-light">{tours.length}</span>
            </div>

            {onSelectTour && onDeleteTour ? (
              <TourList
                tours={tours}
                selectedId={selectedTourId}
                onSelect={onSelectTour}
                onDelete={onDeleteTour}
              />
            ) : (
              <p className="text-sm text-muted-light text-center py-8">
                No tours yet.
              </p>
            )}
          </div>

          <div className="p-4 border-t border-border/50">
          <button
            onClick={onCreateTour}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-accent text-primary font-medium hover:bg-accent-hover transition-colors cursor-pointer"
          >
              <Plus className="w-4 h-4" />
              Create Tour
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

interface MobileMenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export function MobileMenuButton({ isOpen, onClick }: MobileMenuButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed top-24 left-4 z-50 p-2.5 rounded-xl bg-primary border border-border/50 text-secondary hover:text-accent hover:border-accent/50 transition-colors md:hidden shadow-lg cursor-pointer"
      aria-label="Toggle menu"
    >
      {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
    </button>
  );
}