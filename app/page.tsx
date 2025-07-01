"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import AnimateView from "../components/AnimateView";

export default function Home() {
  const [text, setText] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      router.push(`/scene?text=${encodeURIComponent(text)}`);
    }
  };

  return (
    <main className="min-h-screen text-white flex flex-col items-center w-full justify-center">
      <form
        onSubmit={handleSubmit}
        className=" flex flex-col gap-4 max-w-[350px] w-full pt-8"
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter a name or phrase"
          className="px-4 py-2 text-black border-2 rounded w-full border-gray-800"
        />
        <button
          type="submit"
          className="bg-blue-500 px-6 py-2 rounded hover:bg-blue-600 transition"
        >
          Animate
        </button>
      </form>
    </main>
  );
}
