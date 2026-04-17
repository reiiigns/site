'use client';
import { useEffect, useState } from 'react';
import DataShader from './components/DataShader';

export default function Home() {
  // STATE
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [bootComplete, setBootComplete] = useState(false);
  const [activeView, setActiveView] = useState('home');
  const [systemLines, setSystemLines] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // BOOT SEQUENCE
  useEffect(() => {
    const lines = [
      '> booting system...',
      '> initializing modules...',
      '> loading interface...',
    ];

    let i = 0;

    const interval = setInterval(() => {
      setBootLines((prev) => [...prev, lines[i]]);
      i++;

      if (i === lines.length) {
        clearInterval(interval);
        setTimeout(() => setBootComplete(true), 500);
      }
    }, 400);

    return () => clearInterval(interval);
  }, []);

  // ✅ NAV HANDLER (IMPORTANT: OUTSIDE useEffect)
  const handleNavClick = (view: string) => {
    setIsLoading(true);
    setSystemLines([]);

    const lines = [`> loading ${view}...`, '> fetching data...', '> ready'];

    let i = 0;

    const interval = setInterval(() => {
      setSystemLines((prev) => [...prev, lines[i]]);
      i++;

      if (i === lines.length) {
        clearInterval(interval);
        setTimeout(() => {
          setActiveView(view);
          setIsLoading(false);
        }, 300);
      }
    }, 300);
  };

  // BOOT SCREEN
  if (!bootComplete) {
    return (
      <main className="w-screen h-screen bg-black text-[#EDEDED] flex items-center justify-center">
        <div className="font-mono text-sm space-y-2">
          {bootLines.map((line, index) => (
            <p key={index}>{line}</p>
          ))}
          <span className="inline-block w-2 h-4 bg-white ml-1 animate-pulse" />
        </div>
      </main>
    );
  }

  // MAIN UI
  return (
    <main className="w-screen h-screen bg-black text-[#EDEDED] flex">
      {/* LEFT PANEL */}
      <section className="w-[32%] min-w-[320px] max-w-[420px] h-full border-r border-white/10 px-8 py-10 flex flex-col justify-between">
        {/* Header + system logs */}
        <div className="font-mono text-xs tracking-wider space-y-3 opacity-80">
          <p>&gt; OPAQUEFILM_SYS v2.0</p>
          <p>&gt; STATUS: ONLINE</p>
          <p>&gt; LOCATION: TOKYO</p>

          <div className="mt-4 space-y-1 text-[10px] opacity-60">
            {systemLines.map((line, index) => (
              <p key={index}>{line}</p>
            ))}
            {isLoading && (
              <p className="text-[10px] opacity-60 animate-pulse">
                &gt; processing...
              </p>
            )}
          </div>
        </div>

        {/* NAV */}
        <nav className="font-mono text-base space-y-5 mt-10">
          <p
            onClick={() => handleNavClick('projects')}
            className={`cursor-pointer transition duration-200 ${
              activeView === 'projects'
                ? 'opacity-100'
                : 'opacity-40 hover:opacity-70'
            }`}
          >
            [/01] PROJECTS
          </p>

          <p
            onClick={() => handleNavClick('experiments')}
            className={`cursor-pointer transition duration-200 ${
              activeView === 'experiments'
                ? 'opacity-100'
                : 'opacity-40 hover:opacity-70'
            }`}
          >
            [/02] EXPERIMENTS
          </p>

          <p
            onClick={() => handleNavClick('archive')}
            className={`cursor-pointer transition duration-200 ${
              activeView === 'archive'
                ? 'opacity-100'
                : 'opacity-40 hover:opacity-70'
            }`}
          >
            [/03] ARCHIVE
          </p>

          <p
            onClick={() => handleNavClick('contact')}
            className={`cursor-pointer transition duration-200 ${
              activeView === 'contact'
                ? 'opacity-100'
                : 'opacity-40 hover:opacity-70'
            }`}
          >
            [/04] CONTACT
          </p>
        </nav>

        {/* Footer */}
        <div className="font-mono text-[10px] opacity-50 space-y-1">
          <p>SYS.TIME 13:42:08</p>
          <p>SYS.LOAD 0.42</p>
          <p>MEMORY STABLE</p>
        </div>
      </section>

      {/* RIGHT PANEL */}
      <section className="flex-1 h-full relative flex items-center justify-center">
        <div className="relative w-full h-full overflow-hidden">
          {/* animated grid */}
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-[size:40px_40px] animate-pulse" />
          </div>

          {/* moving scan line */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-white opacity-30 animate-[scan_4s_linear_infinite]" />

          {/* center label */}
          <div className="w-[70%] h-[70%] relative flex items-center justify-center">
            {activeView === 'home' && <HomeVisual />}
            {activeView === 'experiments' && <DataVisual />}
            {activeView === 'projects' && <ArtifactVisual />}
            {activeView === 'archive' && <ArchiveVisual />}
            {activeView === 'contact' && <ContactVisual />}
          </div>
        </div>

        <div className="absolute bottom-8 left-8 font-mono text-[10px] opacity-50 space-y-1 tracking-wide">
          <p>ID: AF-0001</p>
          <p>TYPE: VISUAL SYSTEM</p>
          <p>STATUS: ACTIVE</p>
        </div>
      </section>
    </main>
  );
}
function HomeVisual() {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>
      <CenterLabel text="SYSTEM READY" />
    </div>
  );
}

function DataVisual() {
  return (
    <div className="w-full h-full">
      <DataShader />
      <CenterLabel text="DATA STREAM" />
    </div>
  );
}

function ArtifactVisual() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  return (
    <div
      className="w-full h-full flex items-center justify-center relative"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.width / 2) / 40;
        const y = (e.clientY - rect.height / 2) / 40;
        setOffset({ x, y });
      }}
    >
      {/* artifact */}
      <img
        src="/keycap.png"
        alt="artifact"
        className="artifact w-[220px] md:w-[300px] opacity-90 relative z-10"
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px)`,
        }}
      />

      {/* LIGHT OVERLAY */}
      <div
        className="absolute w-[260px] md:w-[340px] h-[260px] md:h-[340px] pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${50 + offset.x * 2}% ${
            50 + offset.y * 2
          }%, rgba(255,255,255,0.15), transparent 60%)`,
          filter: 'blur(40px)',
        }}
      />
    </div>
  );
}

function ArchiveVisual() {
  return (
    <div className="flex items-center justify-center w-full h-full font-mono text-xs opacity-40">
      ARCHIVE DATABASE
    </div>
  );
}

function ContactVisual() {
  return (
    <div className="flex items-center justify-center w-full h-full font-mono text-xs opacity-40">
      CONTACT INTERFACE
    </div>
  );
}

function CenterLabel({ text }: { text: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center font-mono text-xs opacity-50">
      {text}
    </div>
  );
}
