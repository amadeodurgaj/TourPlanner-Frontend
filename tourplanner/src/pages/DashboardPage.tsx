import { useState } from "react";
import { Sidebar, MobileMenuButton } from "@/components/Sidebar";
import CreateTourDialog from "@/components/CreateTourDialog";

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className="flex min-h-[calc(100vh-80px)]">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onCreateTour={() => setIsCreateOpen(true)}
      />

      <MobileMenuButton
        isOpen={isSidebarOpen}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <CreateTourDialog
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={(data) => {
          console.log(data);
          setIsCreateOpen(false);
        }}
      />
    </div>
  );
}