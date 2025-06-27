"use client";

import { CanvasComponent } from "@/components/Canvas";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const router = useRouter();
  // Define Leva controls for position, rotation, and scale

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      router.push(`/scene?text=${encodeURIComponent(text)}`);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <div className="w-[800px] h-[500px]  mb-8 bg-white">
        <CanvasComponent />
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-4"
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter a name or phrase"
          className="px-4 py-2 rounded text-black bg-white"
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
