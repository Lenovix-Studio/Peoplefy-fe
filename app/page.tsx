import Link from "next/link";
import {
  Image as ImageIcon,
  ArrowRight,
  Globe,
  FolderHeart,
  Video,
  Sparkles,
  Users,
} from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Header } from "@/components/header";
import { FaInstagram, FaTwitter } from "react-icons/fa6";

import { API_URL } from "@/constant/variable";

export default async function HomePage() {
  let fetchedPeoples = [];
  let fetchedContents = [];
  try {
    const res = await fetch(`${API_URL}/peoples`, { cache: "no-store" });
    if (res.ok) {
      fetchedPeoples = await res.json();
    }

    const resContents = await fetch(`${API_URL}/peoples/content/recent`, {
      cache: "no-store",
    });
    if (resContents.ok) {
      fetchedContents = await resContents.json();
    }
  } catch (error) {
    console.error("Failed to fetch peoples", error);
  }

  const displayPeoples = fetchedPeoples.slice(0, 4);
  const displayContents = fetchedContents.slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-10">
        {/* Recently Added Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Content Baru
            </h2>

            {displayContents.length > 0 && (
              <Link
                href="/contents"
                className={buttonVariants({
                  variant: "ghost",
                  className:
                    "text-xs font-semibold px-0 gap-1 flex items-center",
                })}
              >
                Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          {displayContents.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 rounded-xl border border-dashed border-border bg-card/50 text-center">
              <div className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-sm text-foreground">
                Belum ada konten tersimpan
              </h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                Arsip photopack masih kosong. Mulai tambahkan photopack baru
                melalui profil cosplayer.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
              {displayContents.map((pack: any) => (
                <Card
                  key={pack.id}
                  className="p-0 group overflow-hidden border-border bg-card shadow-xs hover:shadow-md hover:border-primary/20 transition-all flex flex-col select-none cursor-pointer rounded-xl"
                >
                  <Link href={`/peoples/${pack.personId}/content/${pack.id}`}>
                    <div className="relative aspect-4/3 overflow-hidden bg-muted">
                      {pack.coverUrl ? (
                        <img
                          src={pack.coverUrl}
                          alt={pack.title}
                          className="w-full h-full object-cover transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                          No cover
                        </div>
                      )}
                      <div className="absolute top-2.5 right-2.5 bg-black/60 text-white text-[10px] font-medium px-2 py-0.5 rounded-full backdrop-blur-xs flex items-center gap-1.5">
                        {pack.photoCount > 0 && (
                          <div className="flex items-center gap-1">
                            <ImageIcon className="w-3 h-3" />
                            <span>{pack.photoCount}</span>
                          </div>
                        )}
                        {pack.videoCount > 0 && (
                          <div className="flex items-center gap-1">
                            <Video className="w-3 h-3" />
                            <span>{pack.videoCount}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h3 className="font-semibold text-sm line-clamp-1 text-foreground group-hover:text-primary transition-colors mt-0.5">
                          {pack.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          by{" "}
                          {pack.person?.nickname?.split(",")[0] ||
                            pack.person?.fullName}
                        </p>
                      </div>
                    </CardContent>

                    <CardFooter className="px-4 pb-4 pt-2 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>
                        {new Date(pack.createdAt).toLocaleDateString()}
                      </span>
                      <span className="font-medium text-primary opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0 flex items-center gap-1">
                        Lihat Detail <ArrowRight className="w-3 h-3" />
                      </span>
                    </CardFooter>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Favorite Cosplayers Row */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              People
            </h2>

            {displayPeoples.length > 0 && (
              <Link
                href="/peoples"
                className={buttonVariants({
                  variant: "ghost",
                  className:
                    "text-xs font-semibold px-0 gap-1 flex items-center",
                })}
              >
                Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          {displayPeoples.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 rounded-xl border border-dashed border-border bg-card/50 text-center">
              <div className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-sm text-foreground">
                Belum ada daftar people
              </h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                Koleksi profil kreator & cosplayer favoritmu akan tampil di sini
                setelah ditambahkan melalui tombol Tambah di header.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayPeoples.map((person: any) => (
                <div
                  key={person.id}
                  className="group relative rounded-xl border border-border bg-card overflow-hidden hover:shadow-md hover:border-primary/20 transition-all flex flex-col justify-between select-none"
                >
                  <div className="relative aspect-4/3 w-full overflow-hidden bg-muted border-b border-border">
                    <img
                      src={
                        person.avatarUrl ||
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                      }
                      alt={person.fullName}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />

                    {person.socials.length > 0 && (
                      <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 bg-background/80 backdrop-blur-md px-2 py-1 rounded-lg border border-border/40 shadow-xs">
                        {person.socials?.find(
                          (s: any) => s.platform.toLowerCase() === "instagram",
                        ) && (
                          <a
                            href={
                              person.socials.find(
                                (s: any) =>
                                  s.platform.toLowerCase() === "instagram",
                              ).url
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors relative z-30"
                            aria-label="Instagram"
                          >
                            <FaInstagram className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {person.socials?.find(
                          (s: any) =>
                            s.platform.toLowerCase().includes("twitter") ||
                            s.platform.toLowerCase() === "x",
                        ) && (
                          <a
                            href={
                              person.socials.find(
                                (s: any) =>
                                  s.platform
                                    .toLowerCase()
                                    .includes("twitter") ||
                                  s.platform.toLowerCase() === "x",
                              ).url
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors relative z-30"
                            aria-label="Twitter"
                          >
                            <FaTwitter className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {person.websites?.[0] && (
                          <a
                            href={person.websites[0].url}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors relative z-30"
                            aria-label="Website"
                          >
                            <Globe className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="p-4 flex-1">
                    <h3 className="font-bold text-base text-card-foreground group-hover:text-primary transition-colors leading-tight">
                      <Link
                        href={`/peoples/${person.id}`}
                        className="focus:outline-hidden after:absolute after:inset-0 after:z-10"
                      >
                        {person.fullName}
                      </Link>
                    </h3>
                  </div>

                  <div className="px-4 py-3 border-t border-border bg-muted/20 flex items-center justify-between text-xs mt-auto relative z-20 pointer-events-none">
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <FolderHeart className="w-3.5 h-3.5 text-primary" />
                        <strong className="text-foreground font-semibold">
                          {person.packCount || 0}
                        </strong>{" "}
                        Packs
                      </span>
                    </div>

                    <span className="font-semibold text-primary opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0 flex items-center gap-0.5 text-xs">
                      Profil <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
