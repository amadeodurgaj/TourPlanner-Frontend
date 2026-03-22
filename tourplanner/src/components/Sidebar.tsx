import { MenuIcon, XIcon, PlusIcon } from "lucide-react";
import { cn } from "../lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTour: () => void;
}

export const Sidebar = ({ isOpen, onClose, onCreateTour }: SidebarProps) => {
  return (
    <>
      {/*Desktop*/}
      <aside
        className={cn(
          "fixed left-4 top-[calc(80px+1rem)] z-40 h-[calc(100vh-80px-2rem)] w-80 bg-primary border border-solid border-2 shadow-sm rounded-xl pt-5 px-6",
          "hidden md:block",
        )}
      >
        <div className="flex flex-col gap-3">
          <h2 className="font-sans text-2xl font-bold text-accent text-center">
            Tours
          </h2>
          <button
            className="cursor-pointer rounded-lg group relative w-full font-sans text-sm font-medium tracking-wide text-primary bg-secondary overflow-hidden transition-all duration-300 hover:bg-accent hover:text-white focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-primary"
            onClick={onCreateTour}
          >
            <span  className="relative z-10 flex items-center justify-center gap-2 py-2.5">
              <PlusIcon size={14} />
              Create Tour
            </span>{" "}
            <span className="absolute inset-0 bg-accent-hover transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
          </button>
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}
      {/*Mobile*/}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 bg-primary border border-border/60 shadow-sm rounded-xl transition-transform duration-300 ease-in-out pt-20 px-6 md:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col gap-6">
          <h2 className="font-serif text-2xl font-bold tracking-tight text-secondary">
            Tours
          </h2>
          <button
            className="cursor-pointer group relative w-full font-serif text-base font-medium tracking-wide text-primary bg-secondary overflow-hidden transition-all duration-300 hover:bg-accent hover:text-white focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-primary"
            onClick={onCreateTour}
          >
            <span className="relative z-10 block py-2.5 text-center">
              + Create Tour
            </span>
            <span className="absolute inset-0 bg-accent-hover transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
          </button>
        </div>
      </aside>
    </>
  );
};

interface MobileMenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export const MobileMenuButton = ({
  isOpen,
  onClick,
}: MobileMenuButtonProps) => {
  return (
    <button
      className="fixed top-[calc(80px+1rem)] left-4 z-50 flex items-center justify-center w-10 h-10 rounded-full bg-primary border border-border/60 shadow-sm rounded-xl text-secondary hover:bg-accent/10 hover:text-accent transition-all duration-300 md:hidden"
      onClick={onClick}
      aria-label="Toggle sidebar"
    >
      {isOpen ? <XIcon size={18} /> : <MenuIcon size={18} />}
    </button>
  );
};
