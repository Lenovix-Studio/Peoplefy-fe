import { API_URL } from "@/constant/variable";
import { CreateContentClient } from "./create-content-client";

export default async function CreateContentPage() {
  let uploadPlatforms = [
    "Pilih Platform (Opsional)",
    "Instagram",
    "Twitter / X",
  ];

  try {
    const resPlat = await fetch(`${API_URL}/common-codes/types`, {
      cache: "no-store",
    });
    if (resPlat.ok) {
      const types = await resPlat.json();
      let combined: string[] = [];

      const socialType = types.find((t: any) => t.code === "SOCIAL_PLATFORMS");
      if (socialType?.details) {
        combined = [
          ...combined,
          ...socialType.details.map((d: any) => d.label),
        ];
      }

      const webType = types.find((t: any) => t.code === "WEB_PLATFORMS");
      if (webType?.details) {
        combined = [...combined, ...webType.details.map((d: any) => d.label)];
      }

      if (combined.length > 0) {
        combined = Array.from(new Set(combined));
        uploadPlatforms = ["Pilih Platform (Opsional)", ...combined];
      }
    }
  } catch (err) {
    console.error("Failed to fetch data for create content page", err);
  }

  return <CreateContentClient initialPlatforms={uploadPlatforms} />;
}
