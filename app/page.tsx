'use client';
import { useEffect, useState } from 'react';
import DataShader from './components/DataShader';
import GitHubArchive from './components/GitHubArchive';

/* ============================================
   💡 SITE IDENTITY — EDITABLE STRINGS
   ============================================ */
const SITE_NAME    = 'OPAQUEFILM_SYS';
const SITE_VERSION = 'v2.0';
const SITE_LOCATION = 'TOKYO';
const SYSTEM_ID    = 'AF-0001';
const SYSTEM_TYPE  = 'VISUAL SYSTEM';

/* ============================================
   💡 BOOT SEQUENCE — EDITABLE MESSAGES
   ============================================ */
const BOOT_MESSAGES = [
  '> booting system...',
  '> initializing modules...',
  '> loading interface...',
];
const BOOT_DELAY_MS    = 400;  // Delay between boot messages
const BOOT_FADE_DELAY  = 500;  // Delay before transitioning to main UI

/* ============================================
   💡 NAVIGATION LABELS — EDITABLE
   ============================================ */
const NAV_ITEMS = [
  { id: 'projects',    label: '[/01] PROJECTS'    },
  { id: 'experiments', label: '[/02] EXPERIMENTS' },
  { id: 'archive',     label: '[/03] ARCHIVE'     },
  { id: 'contact',     label: '[/04] CONTACT'     },
];

/* ============================================
   💡 VIEW CENTER LABELS — EDITABLE
   ============================================ */
const VIEW_LABELS: Record<string, string> = {
  home:       'SYSTEM READY',
  projects:   'ARTIFACT VIEW',
  experiments:'DATA STREAM',
  archive:    'ARCHIVE DATABASE',
  contact:    'CONTACT INTERFACE',
};

/* ============================================
   💡 FOOTER SYSTEM INFO — EDITABLE
   ============================================ */
const FOOTER_INFO = [
  'SYS.TIME 13:42:08',
  'SYS.LOAD 0.42',
  'MEMORY STABLE',
];

/* ============================================
   💡 LOADING MESSAGES — EDITABLE
   ============================================ */
const getLoadingMessages = (view: string) => [
  `> loading ${view}...`,
  '> fetching data...',
  '> ready',
];
const LOADING_DELAY_MS = 300;

export default function Home() {
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [bootComplete, setBootComplete] = useState(false);
  const [activeView, setActiveView] = useState('home');
  const [systemLines, setSystemLines] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setBootLines((prev) => [...prev, BOOT_MESSAGES[i]]);
      i++;
      if (i === BOOT_MESSAGES.length) {
        clearInterval(interval);
        setTimeout(() => setBootComplete(true), BOOT_FADE_DELAY);
      }
    }, BOOT_DELAY_MS);

    return () => clearInterval(interval);
  }, []);

  const handleNavClick = (view: string) => {
    setIsLoading(true);
    setSystemLines([]);

    const lines = getLoadingMessages(view);
    let i = 0;

    const interval = setInterval(() => {
      setSystemLines((prev) => [...prev, lines[i]]);
      i++;
      if (i === lines.length) {
        clearInterval(interval);
        setTimeout(() => {
          setActiveView(view);
          setIsLoading(false);
        }, LOADING_DELAY_MS);
      }
    }, LOADING_DELAY_MS);
  };

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

  return (
    <main className="w-screen h-screen bg-black text-[#EDEDED] flex">
      {/* LEFT PANEL */}
      <section className="w-[32%] min-w-[320px] max-w-[420px] h-full border-r border-white/10 px-8 py-10 flex flex-col justify-between">
        <div className="font-mono text-xs tracking-wider space-y-3 opacity-80">
          <p>&gt; {SITE_NAME} {SITE_VERSION}</p>
          <p>&gt; STATUS: ONLINE</p>
          <p>&gt; LOCATION: {SITE_LOCATION}</p>

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
          {NAV_ITEMS.map((item) => (
            <p
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`cursor-pointer transition duration-200 ${
                activeView === item.id
                  ? 'opacity-100'
                  : 'opacity-40 hover:opacity-70'
              }`}
            >
              {item.label}
            </p>
          ))}
        </nav>

        {/* Footer */}
        <div className="font-mono text-[10px] opacity-50 space-y-1">
          {FOOTER_INFO.map((info, i) => (
            <p key={i}>{info}</p>
          ))}
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

          {/* center content */}
          <div className="w-[70%] h-[70%] relative flex items-center justify-center">
            {activeView === 'home'       && <HomeVisual />}
            {activeView === 'experiments' && <DataVisual />}
            {activeView === 'projects'   && <ArtifactVisual />}
            {activeView === 'archive'    && <ArchiveVisual />}
            {activeView === 'contact'    && <ContactVisual />}
          </div>
        </div>

        <div className="absolute bottom-8 left-8 font-mono text-[10px] opacity-50 space-y-1 tracking-wide">
          <p>ID: {SYSTEM_ID}</p>
          <p>TYPE: {SYSTEM_TYPE}</p>
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
      <CenterLabel text={VIEW_LABELS.home} />
    </div>
  );
}

function DataVisual() {
  return (
    <div className="w-full h-full">
      <DataShader />
      <CenterLabel text={VIEW_LABELS.experiments} />
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
      <img
        src="/keycap.png"
        alt="artifact"
        className="artifact w-[220px] md:w-[300px] opacity-90 relative z-10"
        style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
      />

      <div
        className="absolute w-[260px] md:w-[340px] h-[260px] md:h-[340px] pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${50 + offset.x * 2}% ${50 + offset.y * 2}%, rgba(255,255,255,0.15), transparent 60%)`,
          filter: 'blur(40px)',
        }}
      />
      <CenterLabel text={VIEW_LABELS.projects} />
    </div>
  );
}

function ArchiveVisual() {
  return (
    <div className="w-full h-full overflow-hidden">
      <GitHubArchive />
    </div>
  );
}

function ContactVisual() {
  return (
    <div className="flex items-center justify-center w-full h-full font-mono text-xs opacity-40">
      <div className="text-center space-y-4">
        <p>{VIEW_LABELS.contact}</p>
        <div className="text-[10px] opacity-60 space-y-2">
          <p>&gt; email: opaquefilm.studio@gmail.com</p>
          <p>&gt; instagram: @opaquefilm</p>
          <p>&gt; github: github.com/reiiigns</p>
        </div>
      </div>
    </div>
  );
}

function CenterLabel({ text }: { text: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center font-mono text-xs opacity-50 pointer-events-none">
      {text}
    </div>
  );
}
