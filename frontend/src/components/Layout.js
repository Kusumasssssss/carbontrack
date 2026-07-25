import React from "react";
import Topbar from "./Topbar";

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-bg-dark text-slate-50 relative selection:bg-brand-500/30">
      {/* Ambient background blobs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-brand-500/5 rounded-full mix-blend-screen filter blur-[120px] animate-blob" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-accent/5 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-2000" />
      </div>

      {/* Horizontal topbar — fixed, z-50 */}
      <Topbar />

      {/* Page content — push down by topbar height (64px = h-16) */}
      <main className="relative z-10 pt-16 min-h-screen">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}

export default Layout;
