"use client";

import { useState } from "react";
import { Database, SlidersHorizontal } from "lucide-react";
import { CommonCodesManager } from "@/components/settings/common-codes-manager";
import { DangerZone } from "@/components/settings/danger-zone";
import { CommonCodeType } from "@/types/common-code";

interface SettingsTabsProps {
  initialTypes: CommonCodeType[];
}

export function SettingsTabs({ initialTypes }: SettingsTabsProps) {
  const [activeTab, setActiveTab] = useState<"common-codes" | "other">(
    "common-codes",
  );

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex border-b border-border">
        <button
          type="button"
          onClick={() => setActiveTab("common-codes")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors cursor-pointer ${
            activeTab === "common-codes"
              ? "border-primary text-primary font-semibold"
              : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
          }`}
        >
          <Database className="w-4 h-4" />
          Common Code
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("other")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors cursor-pointer ${
            activeTab === "other"
              ? "border-primary text-primary font-semibold"
              : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Other
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === "common-codes" && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          <CommonCodesManager initialTypes={initialTypes} />
        </div>
      )}

      {activeTab === "other" && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          <DangerZone />
        </div>
      )}
    </div>
  );
}
