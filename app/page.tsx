import Link from "next/link";
import {
  Image as ImageIcon,
  ArrowRight,
  Globe,
  FolderHeart,
} from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Header } from "@/components/header";
import { FaInstagram, FaTwitter } from "react-icons/fa6";

const recentPhotopacks = [
  {
    id: "1",
    title: "Ganyu - Spring Blossom Set",
    cosplayer: "HaneAme",
    character: "Ganyu",
    series: "Genshin Impact",
    photoCount: 45,
    coverUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    addedAt: "2 jam yang lalu",
  },
  {
    id: "2",
    title: "Makarima - Devil Hunter",
    cosplayer: "Miu Cosplay",
    character: "Makima",
    series: "Chainsaw Man",
    photoCount: 32,
    coverUrl:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
    addedAt: "Yesterday",
  },
  {
    id: "3",
    title: "Marin Kitagawa - Shizuku-tan",
    cosplayer: "Alisa",
    character: "Marin Kitagawa",
    series: "My Dress-Up Darling",
    photoCount: 60,
    coverUrl:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80",
    addedAt: "3 hari yang lalu",
  },
  {
    id: "4",
    title: "Marin Kitagawa - Shizuku-tan",
    cosplayer: "Alisa",
    character: "Marin Kitagawa",
    series: "My Dress-Up Darling",
    photoCount: 60,
    coverUrl:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80",
    addedAt: "3 hari yang lalu",
  },
];

const allPeoples = [
  {
    id: "1",
    name: "HaneAme",
    handle: "@haneame_cos",
    bio: "Cosplayer, Model & Costume Maker based in Taiwan.",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    banner:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    packCount: 18,
    photoCount: 850,
    socials: {
      instagram: "haneame_cos",
      twitter: "HaneAme_cos",
      website: "https://haneame.com",
    },
  },
  {
    id: "2",
    name: "Miu Cosplay",
    handle: "@miu_cos",
    bio: "Vietnamese Cosplayer & Digital Creator.",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
    banner:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
    packCount: 12,
    photoCount: 420,
    socials: {
      instagram: "miu_cos",
      twitter: "miu_cosplay",
    },
  },
  {
    id: "3",
    name: "Alisa",
    handle: "@alisa_cos",
    bio: "Anime enthusiast & craft maker.",
    avatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80",
    banner:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
    packCount: 8,
    photoCount: 290,
    socials: {
      instagram: "alisa_cosplay",
    },
  },
  {
    id: "4",
    name: "Yuki",
    handle: "@yuki_cosplay",
    bio: "Gamer & Cosplayer. Loving VTubers & RPGs.",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
    banner:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
    packCount: 9,
    photoCount: 310,
    socials: {
      twitter: "yuki_cos",
    },
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-8">
        {/* Recently Added Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Content Baru
              </h2>
            </div>

            {/* Menggunakan buttonVariants dengan variant="link" agar tetap berupa tautan teks */}
            <Link
              href="/contents"
              className={buttonVariants({
                variant: "ghost",
                className: "text-xs font-semibold px-0 gap-1 flex items-center",
              })}
            >
              Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {recentPhotopacks.map((pack) => (
              /* Pindahkan KEY ke elemen paling luar di sini */
              <Card
                key={pack.id}
                className="p-0 group overflow-hidden border-border bg-card shadow-xs hover:shadow-md hover:border-primary/20 transition-all flex flex-col select-none cursor-pointer rounded-xl"
              >
                {/* harusnya /peoples/${people.id}/contents/${pack.id}, tapi karena ini prototype*/}
                <Link href={`/peoples/${pack.id}/content/${pack.id}`}>
                  {/* Image Cover Preview */}
                  <div className="relative aspect-4/3 overflow-hidden bg-muted">
                    <img
                      src={pack.coverUrl}
                      alt={pack.title}
                      className="w-full h-full object-cover transition-transform"
                    />
                    <div className="absolute top-2.5 right-2.5 bg-black/60 text-white text-[10px] font-medium px-2 py-0.5 rounded-full backdrop-blur-xs flex items-center gap-1">
                      <ImageIcon className="w-3 h-3" />
                      <span>{pack.photoCount} foto</span>
                    </div>
                  </div>

                  {/* Content Info */}
                  <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="font-semibold text-sm line-clamp-1 text-foreground group-hover:text-primary transition-colors mt-0.5">
                        {pack.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        by {pack.cosplayer}
                      </p>
                    </div>
                  </CardContent>

                  {/* Footer */}
                  <CardFooter className="px-4 pb-4 pt-2 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>Diunggah {pack.addedAt}</span>
                    <span className="font-medium text-primary opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0 flex items-center gap-1">
                      Lihat Detail <ArrowRight className="w-3 h-3" />
                    </span>
                  </CardFooter>
                </Link>
              </Card>
            ))}
          </div>
        </section>

        {/* Favorite Cosplayers Row */}
        <section className="space-y-4">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                People
              </h2>
            </div>
            <Link
              href="/peoples"
              className={buttonVariants({
                variant: "ghost",
                className: "text-xs font-semibold px-0 gap-1 flex items-center",
              })}
            >
              Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Grid Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {allPeoples.map((cosplayer) => (
              <div
                key={cosplayer.id}
                className="group relative rounded-xl border border-border bg-card overflow-hidden hover:shadow-md hover:border-primary/20 transition-all flex flex-col justify-between select-none"
              >
                {/* 1. Foto Profil Berukuran Besar */}
                <div className="relative aspect-4/3 w-full overflow-hidden bg-muted border-b border-border">
                  <img
                    src={cosplayer.avatar}
                    alt={cosplayer.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />

                  {/* Overlay Tombol Media Sosial (Aman dari Tabrakan Link) */}
                  <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 bg-background/80 backdrop-blur-md px-2 py-1 rounded-lg border border-border/40 shadow-xs">
                    {cosplayer.socials?.instagram && (
                      <a
                        href={`https://instagram.com/${cosplayer.socials.instagram}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors relative z-30"
                        aria-label="Instagram"
                      >
                        <FaInstagram className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {cosplayer.socials?.twitter && (
                      <a
                        href={`https://twitter.com/${cosplayer.socials.twitter}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors relative z-30"
                        aria-label="Twitter"
                      >
                        <FaTwitter className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {cosplayer.socials?.website && (
                      <a
                        href={cosplayer.socials.website}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors relative z-30"
                        aria-label="Website"
                      >
                        <Globe className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>

                {/* 2. Informasi Nama Utama & Detail */}
                <div className="p-4 flex-1">
                  <h3 className="font-bold text-base text-card-foreground group-hover:text-primary transition-colors leading-tight">
                    {/* Tautannya melar mengisi satu kartu penuh berkat kelas 'after:absolute' */}
                    <Link
                      href={`/peoples/${cosplayer.id}`}
                      className="focus:outline-hidden after:absolute after:inset-0 after:z-10"
                    >
                      {cosplayer.name}
                    </Link>
                  </h3>
                </div>

                {/* 3. Footer Statistik */}
                <div className="px-4 py-3 border-t border-border bg-muted/20 flex items-center justify-between text-xs mt-auto relative z-20 pointer-events-none">
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <FolderHeart className="w-3.5 h-3.5 text-primary" />
                      <strong className="text-foreground font-semibold">
                        {cosplayer.packCount}
                      </strong>{" "}
                      Packs
                    </span>
                    <span className="flex items-center gap-1">
                      <ImageIcon className="w-3.5 h-3.5 text-primary" />
                      <strong className="text-foreground font-semibold">
                        {cosplayer.photoCount || 0}
                      </strong>{" "}
                      Foto
                    </span>
                  </div>

                  <span className="font-semibold text-primary opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0 flex items-center gap-0.5 text-xs">
                    Profil <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
