// components/common/SplashScreen.tsx

export default function SplashScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        
        {/* Logo */}
        <div className="flex h-16 w-16 items-center justify-center rounded-xl border bg-card shadow-sm">
          <span className="text-xl font-bold">
            E
          </span>
        </div>

        {/* Brand */}
        <div className="text-center">
          <h1 className="text-xl font-semibold tracking-tight">
            E-Learning Platform
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Preparing your workspace...
          </p>
        </div>

        {/* Loader */}
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-foreground" />
          <div className="h-2 w-2 animate-pulse rounded-full bg-foreground [animation-delay:150ms]" />
          <div className="h-2 w-2 animate-pulse rounded-full bg-foreground [animation-delay:300ms]" />
        </div>

      </div>
    </div>
  );
}