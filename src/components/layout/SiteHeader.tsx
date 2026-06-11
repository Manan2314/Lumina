import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { LuminaLogo } from "@/components/brand/LuminaMark";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/submissions", label: "Submissions" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 py-3.5 sm:px-8">
        <div className="flex min-w-0 items-center gap-8">
          <Link
            to="/"
            className="inline-flex shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
          >
            <LuminaLogo />
          </Link>
          <nav className="hidden items-center gap-7 md:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-foreground data-[status=active]:font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle className="hidden sm:inline-flex" />
          <Button
            asChild
            size="sm"
            className="hidden bg-accent text-accent-foreground hover:bg-accent/90 md:inline-flex"
          >
            <Link to="/get-started">Get Started</Link>
          </Button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-foreground/80 md:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        className={cn("border-t border-border/70 md:hidden", open ? "block" : "hidden")}
      >
        <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-3">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              activeOptions={{ exact: item.to === "/" }}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground data-[status=active]:bg-muted data-[status=active]:text-foreground"
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-2 flex items-center justify-between gap-2 px-1">
            <ThemeToggle />
            <Button
              asChild
              size="sm"
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Link to="/get-started" onClick={() => setOpen(false)}>
                Get Started
              </Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
