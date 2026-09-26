import { API_URL } from "@/constant/variable";
import { EditContentClient } from "./edit-content-client";
import { notFound } from "next/navigation";

export default async function EditContentPage({
  params,
}: {
  params: Promise<{ id: string; contentId: string }>;
}) {
  const { id, contentId } = await params;

  let initialPhotopack = null;
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

    const resPack = await fetch(
      `${API_URL}/peoples/${id}/photopacks/${contentId}`,
      { cache: "no-store" },
    );

    if (resPack.ok) {
      initialPhotopack = await resPack.json();
    } else {
      return notFound();
    }
  } catch (err) {
    console.error("Failed to fetch data for edit page", err);
    return notFound();
  }

  return (
    <EditContentClient
      initialPhotopack={initialPhotopack}
      initialPlatforms={uploadPlatforms}
    />
  );
}
