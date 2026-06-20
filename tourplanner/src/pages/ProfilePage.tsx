import { User } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-6 py-16 sm:py-24">
      <div className="panel-soft max-w-2xl px-10 py-12 text-center">
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-accent/20 to-accent/10 ring-1 ring-accent/20 shadow-medium">
          <User className="w-10 h-10 text-accent" />
        </div>
        
        <h1 className="text-4xl font-bold text-foreground tracking-tight mb-4">
          Profile
        </h1>
        <p className="text-lg text-muted-foreground/80">
          Manage your account settings and preferences.
        </p>
        
        <div className="mt-10 text-center">
          <p className="text-sm text-muted-foreground/60 mb-4">
            Profile management features coming soon...
          </p>
          <div className="inline-flex items-center gap-2 text-muted-foreground/70">
            <span className="text-xs">Under Development</span>
          </div>
        </div>
      </div>
    </div>
  );
}
