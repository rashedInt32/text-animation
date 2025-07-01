"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

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
    <main className="min-h-screen flex w-full">
      {/* Left Side: Unsplash Image */}
      <div className="w-1/2 relative hidden md:block">
        <Image
          src="/input-left-image.jpg"
          alt="Elegant abstract background"
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
      </div>

      {/* Right Side: Input Form */}
      <div className="w-full md:w-1/2 bg-neutral-100 flex flex-col items-center justify-center px-6 py-12">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 max-w-[350px] w-full"
        >
          <h1 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
            Animate a Name or Phrase
          </h1>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter a name or phrase"
            className="px-4 py-2 text-black border-2 rounded w-full border-gray-800"
          />
          <button
            type="submit"
            className="bg-blue-500 px-6 py-2 rounded hover:bg-blue-600 transition text-white"
          >
            Animate
          </button>
        </form>
      </div>
    </main>
  );
}
