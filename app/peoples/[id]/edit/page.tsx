import { API_URL } from "@/constant/variable";
import { EditPersonClient } from "./edit-person-client";
import { notFound } from "next/navigation";

export default async function EditProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let initialPerson = null;
  let socialPlatforms = ["Instagram", "Twitter / X", "TikTok", "YouTube"];
  let webPlatforms = ["Personal Website", "Trakteer", "Patreon", "Lainnya"];
  let presetTags = ["Cosplayer", "Orang Biasa", "Model"];
  let presetTagsTypeId = "";

  try {
    const resCodes = await fetch(`${API_URL}/common-codes/types`, {
      cache: "no-store",
    });
    if (resCodes.ok) {
      const types = await resCodes.json();

      const socialType = types.find((t: any) => t.code === "SOCIAL_PLATFORMS");
      if (socialType?.details?.length > 0) {
        socialPlatforms = socialType.details.map((d: any) => d.label);
      }

      const webType = types.find((t: any) => t.code === "WEB_PLATFORMS");
      if (webType?.details?.length > 0) {
        webPlatforms = webType.details.map((d: any) => d.label);
      }

      const tagsType = types.find((t: any) => t.code === "PRESET_TAGS");
      if (tagsType?.details?.length > 0) {
        presetTagsTypeId = tagsType.id;
        presetTags = tagsType.details.map((d: any) => d.label);
      }
    }

    const resPerson = await fetch(`${API_URL}/peoples/${id}`, {
      cache: "no-store",
    });
    if (resPerson.ok) {
      initialPerson = await resPerson.json();
    } else {
      return notFound();
    }
  } catch (error) {
    console.error("Failed to load initial edit profile data", error);
    return notFound();
  }

  return (
    <EditPersonClient
      initialPerson={initialPerson}
      initialSocialPlatforms={socialPlatforms}
      initialWebPlatforms={webPlatforms}
      initialPresetTags={presetTags}
      initialPresetTagsTypeId={presetTagsTypeId}
    />
  );
}
