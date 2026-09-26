import type { Metadata } from "next";
import { Settings } from "lucide-react";
import { Header } from "@/components/header";
import { API_URL } from "@/constant/variable";
import { CommonCodeType } from "@/types/common-code";
import { SettingsTabs } from "@/components/settings/settings-tabs";

export const metadata: Metadata = {
  title: "Setting System",
};

async function getCodeTypes(): Promise<CommonCodeType[]> {
  try {
    const res = await fetch(`${API_URL}/common-codes/types`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch initial types on server:", error);
    return [];
  }
}

export default async function SettingsPage() {
  const initialTypes = await getCodeTypes();

  return (
    <>
      <Header
        center={
          <div className="flex justify-center">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <Settings className="w-6 h-6 text-primary" /> Setting System
            </h1>
          </div>
        }
      />
      <main className="w-7xl mx-auto p-6">
        <SettingsTabs initialTypes={initialTypes} />
      </main>
    </>
  );
}
