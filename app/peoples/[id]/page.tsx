import { API_URL } from "@/constant/variable";
import { PersonDetailClient } from "./person-detail-client";

export default async function PersonDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let personDetail = null;

  try {
    const res = await fetch(`${API_URL}/peoples/${id}`, { cache: "no-store" });
    if (res.ok) {
      personDetail = await res.json();

      if (personDetail) {
        if (!personDetail.photopacks) personDetail.photopacks = [];
        personDetail.stats = {
          totalPacks: personDetail.photopacks.length,
          totalPhotos: personDetail.photopacks.reduce(
            (acc: number, cur: any) => acc + (cur.photoCount || 0),
            0,
          ),
        };
      }
    }
  } catch (error) {
    console.error("Failed to fetch person detail", error);
  }

  return <PersonDetailClient initialPerson={personDetail} />;
}
