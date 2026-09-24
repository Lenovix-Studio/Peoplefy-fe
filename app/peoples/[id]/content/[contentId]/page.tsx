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
  // Simulasi fetch detail konten (nantinya diganti dengan query DB / fetch backend)
  return {
    id: contentId,
    title: "Ganyu - Spring Blossom Set",
    platform: "Instagram",
    externalUrl: "https://instagram.com/p/Cxyz12345",
    items: [
      {
        id: "1",
        title: "Foto Cover / Portrait 1",
        type: "image",
        url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
        size: "2.4 MB",
        isCover: true,
      },
      {
        id: "2",
        title: "Action Pose Spring Set",
        type: "image",
        url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
        size: "3.1 MB",
        isCover: false,
      },
      {
        id: "3",
        title: "Close Up Details",
        type: "image",
        url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
        size: "2.8 MB",
        isCover: false,
      },
      {
        id: "4",
        title: "Short Reel / Teaser",
        type: "video",
        url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
        size: "15.8 MB",
        isCover: false,
      },
    ],
  };
}

interface PageProps {
  params: Promise<{ id: string; contentId: string }>;
}

export default async function Page({ params }: PageProps) {
  // Await params sesuai dengan App Router Next.js terbaru
  const { id, contentId } = await params;
  const pack = await getPackDetail(id, contentId);

  return <PackContentDetailPageClient personId={id} pack={pack} />;
}
