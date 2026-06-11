import { Link } from "@tanstack/react-router";
import { LuminaLogo } from "@/components/brand/LuminaMark";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-background">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-12 sm:grid-cols-[1.5fr_1fr_1fr] sm:px-8">
        <div className="space-y-3">
          <LuminaLogo />
          <p className="max-w-sm text-sm text-muted-foreground">
            Where ambition meets direction. Personalized academic guidance for professionals,
            graduates, and lifelong learners.
          </p>
        </div>
        <div>
          <h3 className="font-display text-sm font-semibold text-foreground">Platform</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/" className="hover:text-foreground">
                Home
              </Link>
            </li>
            <li>
              <Link to="/how-it-works" className="hover:text-foreground">
                How It Works
              </Link>
            </li>
            <li>
              <Link to="/get-started" className="hover:text-foreground">
                Get Started
              </Link>
            </li>
            <li>
              <Link to="/submissions" className="hover:text-foreground">
                Submissions
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-display text-sm font-semibold text-foreground">About</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>Personalized Recommendations</li>
            <li>Career-Focused Guidance</li>
            <li>Academic Growth Planning</li>
            <li>Professional Development</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/70">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-2 px-5 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:px-8">
          <p>© {new Date().getFullYear()} Lumina. All rights reserved.</p>
          <p>Built for clarity. Built for ambition.</p>
        </div>
      </div>
    </footer>
  );
}
