"use client";
import { useSearchParams } from "next/navigation";
import AnimateView from "@/components/AnimateView";

export default function ScenePage() {
  const searchParams = useSearchParams();
  const text = searchParams.get("text") || "";

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center">
      <div className="w-full">
        <div className="aspect-video">
          <AnimateView />
        </div>
      </div>
    </main>
  );
}
