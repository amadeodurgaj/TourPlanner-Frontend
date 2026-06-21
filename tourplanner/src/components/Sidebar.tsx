import { toast } from 'sonner';
import { Menu, X, Plus, Search, Download, Upload, RefreshCw } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "../lib/utils";
import { TourList } from "./TourList";
import { TourService } from "@/services/TourService";
import type { Tour } from "@/types/api";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTour: () => void;
  tours?: Tour[];
  selectedTourId?: string;
  onSelectTour?: (tour: Tour) => void;
  onDeleteTour?: (id: string) => void;
  searchQuery?: string;
  onSearch?: (query: string) => void;
  onRefresh?: () => void;
}

export function Sidebar({
  isOpen,
  onClose,
  onCreateTour,
  tours = [],
  selectedTourId,
  onSelectTour,
  onDeleteTour,
  searchQuery = "",
  onSearch,
  onRefresh,
}: SidebarProps) {
  const [query, setQuery] = useState(searchQuery);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setQuery(searchQuery);
  }, [searchQuery]);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearch?.(value);
    }, 300);
  };

  const handleExport = async () => {
    try {
      await TourService.exportTours();
      toast.success('Tours exported successfully');
    } catch {
      toast.error('Export failed');
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    try {
      await TourService.importTours(file);
      toast.success('Tours imported successfully');
      onRefresh?.();
    } catch {
      toast.error('Import failed. Please check the file format.');
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm transition-opacity md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar - Enhanced with better shadows and background */}
      <aside
        className={cn(
          "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-80 max-w-[86vw] border-r border-border/60 bg-card/95 backdrop-blur-lg shadow-strong md:translate-x-0 md:shadow-soft transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Mobile header */}
          <div className="flex items-center justify-between border-b border-border/70 p-4 md:hidden">
            <h2 className="text-lg font-semibold text-foreground">Tours</h2>
            <button
              onClick={onClose}
              className="icon-button"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search - Enhanced with better focus states */}
          <div className="border-b border-border/60 p-4">
            <div className="relative group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/80 group-focus-within:text-accent transition-colors" />
              <input
                type="text"
                placeholder="Search tours..."
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                className="field-control pl-11 focus:ring-accent/20"
              />
            </div>
          </div>

          {/* Tour list - Enhanced with better spacing and hierarchy */}
          <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                Your Tours
              </h3>
              <div className="flex items-center gap-1.5">
                {onRefresh && (
                  <button
                    onClick={onRefresh}
                    className="rounded-lg p-2 text-muted-foreground/80 transition-smooth hover:bg-accent/10 hover:text-accent active-press"
                    title="Refresh"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                )}
                <span className="rounded-full bg-accent/10 px-2.5 py-1 text-xs text-accent font-medium tabular-nums">{tours.length}</span>
              </div>
            </div>

            {onSelectTour && onDeleteTour ? (
              <TourList
                tours={tours}
                selectedId={selectedTourId}
                onSelect={onSelectTour}
                onDelete={onDeleteTour}
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-secondary/80">
                  <Search className="w-6 h-6 text-muted-foreground/70" />
                </div>
                <p className="text-sm font-medium text-foreground/80">No tours yet</p>
                <p className="text-xs text-muted-foreground/60 mt-1.5 max-w-xs">
                  Start your adventure by creating your first tour
                </p>
              </div>
            )}
          </div>

          {/* Actions - Enhanced button styling */}
          <div className="space-y-3 border-t border-border/60 p-4">
            <button
              onClick={onCreateTour}
              className="btn-primary w-full shadow-sm hover:shadow-md"
            >
              <Plus className="w-4 h-4" />
              Create Tour
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleExport}
                className="btn-secondary text-xs hover:border-accent/40 hover:bg-accent/10"
                title="Export Tours"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              <button
                onClick={handleImportClick}
                disabled={importing}
                className="btn-secondary text-xs hover:border-accent/40 hover:bg-accent/10 disabled:opacity-60"
                title="Import Tours"
              >
                <Upload className="w-4 h-4" />
                <span>{importing ? "..." : "Import"}</span>
              </button>
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            accept=".json"
            onChange={handleFileSelect}
            className="hidden"
          />
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
      className="fixed left-4 top-20 z-50 rounded-lg border border-border/70 bg-card p-2.5 text-foreground shadow-lg transition-smooth hover:border-accent/50 hover:text-accent active-press md:hidden"
      aria-label="Toggle menu"
    >
      {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
    </button>
  );
}
