"use client";

import { useState, type ReactNode } from "react";

// Groups a long settings form into named sub-sections so staff can jump
// straight to the part of the site they need instead of scrolling past
// everything else. All tab panels stay mounted (just hidden), so every
// field remains part of the surrounding <form> and submits normally no
// matter which tab was active when "Save" was clicked.
export default function SettingsTabs({ tabs }: { tabs: { id: string; label: string; content: ReactNode }[] }) {
  const [active, setActive] = useState(tabs[0].id);

  return (
    <div>
      <div className="flex flex-wrap gap-2 border-b border-secondary/20 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActive(tab.id)}
            aria-current={active === tab.id ? "true" : undefined}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              active === tab.id
                ? "bg-primary text-white"
                : "bg-secondary/10 text-foreground/70 hover:bg-secondary/20"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-6">
        {tabs.map((tab) => (
          <div key={tab.id} hidden={active !== tab.id} className="space-y-6">
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}
