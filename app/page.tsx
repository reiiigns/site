'use client';
import { useEffect, useState } from 'react';
import DataShader from './components/DataShader';
import GitHubArchive from './components/GitHubArchive';

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

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
  { id: 'projects',     label: '[/01] PROJECTS'     },
  { id: 'experiments',  label: '[/02] EXPERIMENTS'  },
  { id: 'case-studies', label: '[/03] CASE STUDIES' },
  { id: 'archive',      label: '[/04] ARCHIVE'      },
  { id: 'contact',      label: '[/05] CONTACT'      },
];

/* ============================================
   💡 VIEW CENTER LABELS — EDITABLE
   ============================================ */
const VIEW_LABELS: Record<string, string> = {
  home:          'SYSTEM READY',
  projects:      'ARTIFACT VIEW',
  experiments:   'DATA STREAM',
  'case-studies':'CASE STUDIES',
  archive:       'ARCHIVE DATABASE',
  contact:       'CONTACT INTERFACE',
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  const handleNavClick = (view: string) => {
    setIsMenuOpen(false);
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

  const activeLabel = VIEW_LABELS[activeView] || VIEW_LABELS.home;

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
    <main className="min-h-screen w-full overflow-x-hidden bg-black text-[#EDEDED] md:h-screen md:overflow-hidden md:flex">
      <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-white/10 bg-black/90 px-4 backdrop-blur md:hidden">
        <button
          type="button"
          onClick={() => handleNavClick('home')}
          className="min-h-[44px] min-w-[44px] text-left font-mono text-[10px] tracking-wider text-white/70 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-white"
          aria-label="Go to system home"
        >
          &gt; {SITE_NAME}
        </button>
        <div className="min-w-0 px-3 text-center font-mono text-[10px] tracking-widest text-white/40">
          <span className="block truncate">{activeLabel}</span>
        </div>
        <button
          type="button"
          className="flex min-h-[44px] min-w-[44px] items-center justify-end font-mono text-xs tracking-widest text-white/80 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-white"
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-controls="mobile-nav"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {isMenuOpen ? 'CLOSE' : 'MENU'}
        </button>
      </header>

      {isMenuOpen && (
        <div className="fixed inset-0 z-30 bg-black/70 md:hidden" onClick={() => setIsMenuOpen(false)} />
      )}

      <aside
        id="mobile-nav"
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(84vw,320px)] flex-col justify-between border-r border-white/10 bg-black px-5 pb-6 pt-5 transition-transform duration-200 md:hidden ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          <div className="font-mono text-xs tracking-wider text-white/70">
            <p>&gt; {SITE_NAME} {SITE_VERSION}</p>
            <p className="mt-3">&gt; STATUS: ONLINE</p>
            <p className="mt-3">&gt; LOCATION: {SITE_LOCATION}</p>
          </div>

          <div className="mt-5 space-y-1 font-mono text-[10px] text-white/40">
            {systemLines.map((line, index) => (
              <p key={index}>{line}</p>
            ))}
            {isLoading && <p className="animate-pulse">&gt; processing...</p>}
          </div>

          <nav className="mt-10 space-y-2 font-mono text-sm" aria-label="Mobile navigation">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`block min-h-[44px] w-full text-left tracking-wider transition-colors duration-200 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-white ${
                  activeView === item.id
                    ? 'text-white'
                    : 'text-white/45 hover:text-white/75'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="space-y-1 font-mono text-[10px] text-white/45">
          {FOOTER_INFO.map((info, i) => (
            <p key={i}>{info}</p>
          ))}
        </div>
      </aside>

      {/* LEFT PANEL */}
      <section className="hidden h-full w-[32%] min-w-[320px] max-w-[420px] flex-col justify-between border-r border-white/10 px-8 py-10 md:flex">
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
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavClick(item.id)}
              className={`block w-full min-h-[44px] text-left transition duration-200 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-white ${
                activeView === item.id
                  ? 'opacity-100'
                  : 'opacity-40 hover:opacity-70'
              }`}
            >
              {item.label}
            </button>
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
      <section className="relative flex min-h-screen w-full flex-1 items-stretch justify-center pt-14 md:h-full md:min-h-0 md:items-center md:pt-0">
        <div className="relative min-h-screen w-full overflow-hidden md:h-full md:min-h-0">
          {/* animated grid */}
          <div className="absolute inset-0 opacity-[0.06] md:opacity-10">
            <div className="h-full w-full bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-[size:32px_32px] motion-safe:animate-pulse md:bg-[size:40px_40px]" />
          </div>

          {/* moving scan line */}
          <div className="absolute left-0 top-0 h-[2px] w-full bg-white opacity-15 motion-safe:animate-[scan_4s_linear_infinite] md:opacity-30" />

          {/* center content */}
          <div className="relative mx-auto flex min-h-[calc(100vh-3.5rem)] w-full items-center justify-center px-4 py-8 md:h-[70%] md:min-h-0 md:w-[70%] md:px-0 md:py-0">
            {activeView === 'home'          && <HomeVisual />}
            {activeView === 'experiments'   && <DataVisual />}
            {activeView === 'projects'      && <ArtifactVisual />}
            {activeView === 'case-studies'  && <CaseStudiesVisual />}
            {activeView === 'archive'       && <ArchiveVisual />}
            {activeView === 'contact'       && <ContactVisual />}
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-4 left-4 font-mono text-[10px] tracking-wide opacity-35 md:bottom-8 md:left-8 md:opacity-50">
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
    <div className="relative min-h-[360px] w-full overflow-hidden md:h-full md:min-h-0">
      <div className="absolute inset-0 opacity-[0.06] md:opacity-10">
        <div className="h-full w-full bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-[size:32px_32px] md:bg-[size:40px_40px]" />
      </div>
      <CenterLabel text={VIEW_LABELS.home} />
    </div>
  );
}

function DataVisual() {
  return (
    <div className="relative min-h-[380px] w-full md:h-full md:min-h-0">
      <DataShader />
      <CenterLabel text={VIEW_LABELS.experiments} />
    </div>
  );
}

function ArtifactVisual() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  return (
    <div
      className="relative flex min-h-[380px] w-full items-center justify-center md:h-full md:min-h-0"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.width / 2) / 40;
        const y = (e.clientY - rect.height / 2) / 40;
        setOffset({ x, y });
      }}
    >
      <img
        src={`${BASE_PATH}/keycap.png`}
        alt="artifact"
        className="artifact relative z-10 w-[190px] opacity-90 md:w-[300px]"
        style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
      />

      <div
        className="pointer-events-none absolute h-[230px] w-[230px] md:h-[340px] md:w-[340px]"
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
    <div className="h-[calc(100vh-7rem)] w-full overflow-hidden md:h-full">
      <GitHubArchive />
    </div>
  );
}

function ContactVisual() {
  return (
    <div className="flex min-h-[360px] w-full items-center justify-center px-2 font-mono text-xs opacity-50 md:h-full md:min-h-0 md:opacity-40">
      <div className="max-w-full space-y-4 text-center">
        <p>{VIEW_LABELS.contact}</p>
        <div className="space-y-2 break-words text-[10px] opacity-70">
          <p>&gt; email: opaquefilm.studio@gmail.com</p>
          <p>&gt; instagram: @opaquefilm</p>
          <p>&gt; github: github.com/reiiigns</p>
        </div>
      </div>
    </div>
  );
}

// ── Case Studies Visual ────────────────────────────────────────

interface CaseStudy {
  id: string;
  num: string;
  title: string;
  tag: string;
  signal: string;
  status: string;
  href: string | null;
  playHref?: string;
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id:       'browser-game',
    num:      '01',
    title:    'JS BROWSER HORROR GAME',
    tag:      'Interaction Design / Feedback Systems',
    signal:   'Systems that respond to users',
    status:   'COMPLETE',
    href:     '/case-studies/browser-game/case-study-browser-game.html',
    playHref: '/case-studies/browser-game/play/index.html',
  },
  {
    id:     'soft-city',
    num:    '02',
    title:  'SOFT CITY',
    tag:    'Conceptual Systems / Worldbuilding',
    signal: 'Systems that explore ideas',
    status: 'COMPLETE',
    href:   '/case-studies/soft-city/case-study-soft-city.html',
  },
  {
    id:     'github-site',
    num:    '03',
    title:  'GITHUB SITE',
    tag:    'Real-world Constraints / Performance',
    signal: 'Systems that ship and work',
    status: 'COMING',
    href:   null,
  },
];

function CaseStudiesVisual() {
  return (
    <div className="scrollbar-thin flex h-[calc(100vh-7rem)] w-full items-start justify-center overflow-y-auto px-0 py-3 md:h-full md:px-2 md:py-8">
      <div className="w-full max-w-md space-y-[1px]">
        {CASE_STUDIES.map((cs) => (
          <div
            key={cs.id}
            className="border border-white/10 bg-black group"
          >
            <div className="flex flex-col gap-4 p-4 min-[380px]:flex-row min-[380px]:items-start min-[380px]:justify-between">
              <div className="flex-1 min-w-0">
                <div className="font-mono text-[9px] text-white/30 tracking-widest mb-1 uppercase">
                  {cs.num} / {cs.tag}
                </div>
                <div className="font-mono text-xs text-white/80 tracking-wider mb-1">
                  {cs.title}
                </div>
                <div className="font-mono text-[9px] text-white/30 italic">
                  &ldquo;{cs.signal}&rdquo;
                </div>
              </div>
              <div className="flex flex-shrink-0 flex-row items-center gap-3 min-[380px]:flex-col min-[380px]:items-end min-[380px]:gap-2">
                <span
                  className={`font-mono text-[8px] tracking-widest px-2 py-0.5 border ${
                    cs.status === 'COMPLETE'
                      ? 'border-white/20 text-white/60'
                      : 'border-white/10 text-white/20'
                  }`}
                >
                  {cs.status}
                </span>
                {cs.href && (
                  <a
                    href={`${BASE_PATH}${cs.href}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center font-mono text-[8px] tracking-widest text-white/50 underline underline-offset-2 transition-colors duration-200 hover:text-white/80 min-[380px]:min-h-0"
                  >
                    VIEW →
                  </a>
                )}
                {cs.playHref && (
                  <a
                    href={`${BASE_PATH}${cs.playHref}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center font-mono text-[8px] tracking-widest text-white/70 underline underline-offset-2 transition-colors duration-200 hover:text-white min-[380px]:min-h-0"
                  >
                    ▶ PLAY
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}

        <div className="pt-4 font-mono text-[9px] text-white/20 tracking-widest">
          &gt; {CASE_STUDIES.filter(c => c.status === 'COMPLETE').length} OF {CASE_STUDIES.length} CASE STUDIES ONLINE
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
