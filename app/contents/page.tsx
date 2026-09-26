import { API_URL } from "@/constant/variable";
import { ContentsClient } from "./contents-client";

export default async function ContentsPage() {
  let allContents = [];

  try {
    const res = await fetch(`${API_URL}/peoples/content/recent`, {
      cache: "no-store",
    });
    if (res.ok) {
      allContents = await res.json();
    }
  } catch (error) {
    console.error("Failed to fetch contents", error);
  }

  return <ContentsClient initialContents={allContents} />;
}
