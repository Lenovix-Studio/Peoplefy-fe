import { API_URL } from "@/constant/variable";
import PackContentDetailPageClient from "./PackContentDetailPageClient";

export interface MediaItem {
  id: string;
  type: "image" | "video";
  url: string;
  title?: string;
  size?: string;
  isCover?: boolean;
}

export interface PackDetail {
  id: string;
  title: string;
  platform?: string | null;
  externalUrl?: string | null;
  items: MediaItem[];
}

async function getPackDetail(
  personId: string,
  contentId: string,
): Promise<PackDetail> {
  const res = await fetch(
    `${API_URL}/peoples/${personId}/photopacks/${contentId}`,
    {
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch photopack");
  }

  const data = await res.json();

  return {
    id: data.id,
    title: data.title,
    platform: data.platform,
    externalUrl: data.externalUrl,
    items: data.media.map((m: any) => ({
      id: m.id,
      type: m.type,
      url: m.url,
      title: "",
      size: "",
      isCover: m.isCover,
    })),
  };
}

interface PageProps {
  params: Promise<{ id: string; contentId: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id, contentId } = await params;
  const pack = await getPackDetail(id, contentId);

  return <PackContentDetailPageClient personId={id} pack={pack} />;
}
