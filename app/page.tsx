import { API_URL } from "@/constant/variable";
import { HomeClient } from "./home-client";

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

  return (
    <HomeClient
      initialPeoples={fetchedPeoples}
      initialContents={fetchedContents}
    />
  );
}
