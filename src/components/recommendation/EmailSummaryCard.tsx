import { useMemo, useState } from "react";
import { Copy, Check } from "lucide-react";
import { formatEmailSummary } from "@/lib/email-summary";
import type { RecommendResult } from "@/lib/recommend";

export function EmailSummaryCard({
  result,
  recipientName,
}: {
  result: RecommendResult;
  recipientName?: string;
}) {
  const text = useMemo(() => formatEmailSummary(result, recipientName), [result, recipientName]);
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* noop */
    }
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-display text-xs uppercase tracking-[0.2em] text-accent">
            Email-ready summary
          </p>
          <h3 className="mt-1.5 font-display text-xl font-semibold tracking-tight">
            A concise version you can send or save.
          </h3>
        </div>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-accent/40 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre
        role="region"
        aria-label="Email summary — scroll to read full content"
        tabIndex={0}
        className="mt-5 max-h-[420px] overflow-auto whitespace-pre-wrap rounded-xl border border-border bg-background p-5 font-sans text-sm leading-relaxed text-foreground/90 focus:outline-none focus:ring-2 focus:ring-accent-ring"
      >
        {text}
      </pre>
      <p className="mt-3 text-xs text-muted-foreground">
        Ready for email delivery — drop into a notification flow when needed.
      </p>
    </section>
  );
}
