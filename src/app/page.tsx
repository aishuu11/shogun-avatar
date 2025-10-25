"use client";

import Scene from "@/app/components/Scene";
import ChatBox from "@/app/components/ChatBox";

export default function Page() {
  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-brand">Shogun Avatar ⚔️</h1>

      <div className="mb-6 bg-brand/5 border border-brand/20
                      rounded-[var(--radius-card)]
                      p-[var(--spacing-card)]">
        <p className="text-brand/80">Tailwind v4 tokens are live ✨</p>
      </div>

      <Scene />
      <ChatBox onSend={(m) => console.log("user said:", m)} />
    </main>
  );
}
