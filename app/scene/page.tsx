"use client";
import { Suspense } from "react";
import AnimateView from "@/components/AnimateView";

export default function ScenePage() {
  return (
    <main className="min-h-screen bg-white text-white flex flex-col items-center p-4">
      <div className="w-full">
        <div className="aspect-video">
          <Suspense fallback={null}>
            <AnimateView />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
