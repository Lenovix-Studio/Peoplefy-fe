import { API_URL } from "@/constant/variable";
import { PeoplesClient } from "./peoples-client";

export default async function PeoplesPage() {
  let allPeoples = [];

  try {
    const res = await fetch(`${API_URL}/peoples`, { cache: "no-store" });
    if (res.ok) {
      allPeoples = await res.json();
    }
  } catch (error) {
    console.error("Failed to fetch peoples", error);
  }

  return <PeoplesClient initialPeoples={allPeoples} />;
}
