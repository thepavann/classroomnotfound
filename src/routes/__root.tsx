import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { ThemeProvider } from "../hooks/use-theme";
import { Navbar } from "../components/navbar";
import { Toaster } from "../components/ui/sonner";
import { AuthProvider } from "../hooks/use-auth";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "AIML-B Hub — Live Timetable & Class Dashboard" },
      {
        name: "description",
        content:
          "AIML-B Hub for Sreenidhi Institute of Technology. See your current class, next class, room, faculty and countdown at a glance — plus faculty, events, announcements and CRs.",
      },
      { name: "author", content: "AIML-B, Sreenidhi Institute of Technology" },
      { property: "og:title", content: "AIML-B Hub — Live Timetable & Class Dashboard" },
      {
        property: "og:description",
        content: "AIML-B Hub for Sreenidhi Institute of Technology. See your current class, next class, room, faculty and countdown at a glance — plus faculty, events, announcements and CRs.",
      },
      { property: "og:type", content: "website" },
      { name: "google-site-verification", content: "IgOKfz0mMRJhtkIZy6q8iJISI4je-ByUx0Bjp7CBbNo" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "AIML-B Hub — Live Timetable & Class Dashboard" },
      { name: "twitter:description", content: "AIML-B Hub for Sreenidhi Institute of Technology. See your current class, next class, room, faculty and countdown at a glance — plus faculty, events, announcements and CRs." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/220663ae-4820-41ef-8c77-d3d23c5c569f/id-preview-67c1d044--359b4b50-4393-49a1-9975-468e10991295.lovable.app-1783751706663.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/220663ae-4820-41ef-8c77-d3d23c5c569f/id-preview-67c1d044--359b4b50-4393-49a1-9975-468e10991295.lovable.app-1783751706663.png" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
              {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
              <Outlet />
            </main>
            <footer className="border-t border-border/60 py-8">
              <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 text-center text-sm text-muted-foreground sm:flex-row sm:text-left sm:px-6">
                <p>AIML-B Hub · Second Year, Semester 1</p>
                <p>Sreenidhi Institute of Technology · Class AIML-B</p>
              </div>
            </footer>
          </div>
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
