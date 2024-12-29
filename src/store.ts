import { writable } from "svelte/store";

interface Chapter {
  timestamp: string;
  title: string;
}

const stored = JSON.parse(localStorage.getItem("chapters") || "null");
export const chapters = writable<Chapter[]>(
  stored || [
    {
      timestamp: "00:00:00",
      title: "",
    },
  ]
);

chapters.subscribe((value) =>
  localStorage.setItem("chapters", JSON.stringify(value))
);
