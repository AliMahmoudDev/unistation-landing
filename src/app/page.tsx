"use client";

import { useState, useEffect, useRef, createContext, useContext } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import siteConfig from "@/data/site-config.json";

/* ═══════════════════════════════════════════════════
   Live Data Context (fetches from Turso DB)
   ═══════════════════════════════════════════════════ */
const SiteDataContext = createContext(siteConfig);
export function useSiteData() { return useContext(SiteDataContext); }

function SiteDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState(siteConfig);
  useEffect(() => {
    fetch('api/config')
      .then(r => r.json())
      .then(d => {
        if (d.stats) setData({
          ...siteConfig,
          stats: d.stats || siteConfig.stats,
          universities: d.universities || siteConfig.universities,
          basicPackage: d.basicPackage || siteConfig.basicPackage,
          additionalPackage: d.additionalPackage || siteConfig.additionalPackage,
          registration: d.registration || siteConfig.registration,
          faqs: (d.faqs || siteConfig.faqs).map((f: any) => f.question ? { q: f.question, a: f.answer } : f),
        });
      })
      .catch(() => {});
  }, []);
  return <SiteDataContext.Provider value={data}>{children}</SiteDataContext.Provider>;
}

/* ═══════════════════════════════════════════════════
   Scroll Animation Hook (lightweight IntersectionObserver)
   ═══════════════════════════════════════════════════ */
function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Safety fallback: show element after 2s even if observer fails
    const safetyTimer = setTimeout(() => setIsVisible(true), 2000);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
          clearTimeout(safetyTimer);
        }
      },
      { rootMargin: "-30px" }
    );
    observer.observe(el);
    return () => { observer.disconnect(); clearTimeout(safetyTimer); };
  }, []);

  return { ref, isVisible };
}

/* ═══════════════════════════════════════════════════
   Custom SVG Icons
   ═══════════════════════════════════════════════════ */

function IconGradCap({ className = "w-7 h-7" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 48 48" fill="none"><path d="M24 6L4 18L24 30L44 18L24 6Z" fill="currentColor" opacity="0.9"/><path d="M10 22V32C10 32 16 38 24 38C32 38 38 32 38 32V22L24 30L10 22Z" fill="currentColor" opacity="0.7"/><path d="M42 20V34" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/><circle cx="42" cy="36" r="2" fill="currentColor"/></svg>;
}
function IconGlobe({ className = "w-7 h-7" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="2.5"/><ellipse cx="24" cy="24" rx="8" ry="18" stroke="currentColor" strokeWidth="2"/><line x1="6" y1="24" x2="42" y2="24" stroke="currentColor" strokeWidth="2"/><path d="M9 14H39" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3"/><path d="M9 34H39" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3"/></svg>;
}
function IconDollar({ className = "w-7 h-7" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
}
function IconFileCheck({ className = "w-7 h-7" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 48 48" fill="none"><path d="M12 6H30L40 16V40C40 41.1 39.1 42 38 42H12C10.9 42 10 41.1 10 40V8C10 6.9 10.9 6 12 6Z" stroke="currentColor" strokeWidth="2.5"/><path d="M30 6V16H40" stroke="currentColor" strokeWidth="2"/><path d="M20 26L23 29L30 21" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function IconUsers({ className = "w-7 h-7" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 48 48" fill="none"><circle cx="24" cy="16" r="7" stroke="currentColor" strokeWidth="2.5"/><path d="M8 42C8 33.2 15.2 26 24 26C32.8 26 40 33.2 40 42" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>;
}
function IconShield({ className = "w-7 h-7" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 48 48" fill="none"><path d="M24 4L6 12V24C6 34 14 42 24 44C34 42 42 34 42 24V12L24 4Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/><path d="M18 24L22 28L32 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function IconNature({ className = "w-7 h-7" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 48 48" fill="none"><path d="M24 44V26" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/><path d="M24 26C24 26 14 20 14 12C14 4 24 6 24 6C24 6 34 4 34 12C34 20 24 26 24 26Z" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="2"/></svg>;
}
function IconStethoscope({ className = "w-6 h-6" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 40 40" fill="none"><path d="M12 6V18C12 23.5 16.5 28 22 28C27.5 28 32 23.5 32 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/><circle cx="12" cy="6" r="3" stroke="currentColor" strokeWidth="2"/><circle cx="22" cy="34" r="4" stroke="currentColor" strokeWidth="2"/><path d="M22 28V30" stroke="currentColor" strokeWidth="2.5"/></svg>;
}
function IconPassport({ className = "w-6 h-6" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M7 18C7 15.8 9.2 14 12 14C14.8 14 17 15.8 17 18" stroke="currentColor" strokeWidth="1.5"/></svg>;
}
function IconPhoto({ className = "w-6 h-6" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none"><rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2"/><circle cx="9" cy="10" r="2" stroke="currentColor" strokeWidth="1.5"/><path d="M6 18L10 13L13 16L16 12L20 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function IconGrades({ className = "w-6 h-6" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none"><path d="M4 4H16L20 8V20C20 21.1 19.1 22 18 22H6C4.9 22 4 21.1 4 20V6C4 4.9 4.9 4 6 4Z" stroke="currentColor" strokeWidth="2"/><path d="M8 12L10 14L15 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function IconTranslate({ className = "w-6 h-6" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 8l6 6"/><path d="M4 14l6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="M22 22l-5-10-5 10"/><path d="M14 18h6"/></svg>;
}
function IconAward({ className = "w-6 h-6" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="5" stroke="currentColor" strokeWidth="2"/><path d="M8 12L6 20L12 17L18 20L16 12" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>;
}
function IconAccept({ className = "w-6 h-6" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none"><path d="M12 2L14.5 8.5L21 9.5L16.5 14L18 21L12 17.5L6 21L7.5 14L3 9.5L9.5 8.5L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>;
}
function IconHome({ className = "w-6 h-6" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none"><path d="M3 12L12 3L21 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 10V20C5 21.1 5.9 22 7 22H10V16H14V22H17C18.1 22 19 21.1 19 20V10" stroke="currentColor" strokeWidth="2"/></svg>;
}
function IconVisa({ className = "w-6 h-6" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none"><rect x="2" y="4" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="2"/><circle cx="8" cy="12" r="2" fill="currentColor" opacity="0.4"/><path d="M12 10H20M12 14H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
}
function IconSupport({ className = "w-6 h-6" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>;
}
function IconPhone({ className = "w-6 h-6" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none"><path d="M22 16.92V19.92C22 20.48 21.56 20.93 21 20.97C20.17 21 19.33 21 18.5 21C10.5 21 4 14.5 3 6.5C3 5.67 3 4.83 3.03 4C3.07 3.44 3.52 3 4.08 3H7.08C7.56 3 7.97 3.34 8.05 3.82C8.17 4.56 8.38 5.28 8.67 5.96C8.82 6.31 8.73 6.72 8.45 6.98L7.17 8.26C8.41 10.53 10.47 12.59 12.74 13.83L14.02 12.55C14.28 12.27 14.69 12.18 15.04 12.33C15.72 12.62 16.44 12.83 17.18 12.95C17.66 13.03 18 13.44 18 13.92V16.92" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function IconMail({ className = "w-6 h-6" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none"><rect x="2" y="4" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="2"/><path d="M2 7L12 13L22 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function WhatsAppIcon({ className = "w-5 h-5" }: { className?: string }) {
  return <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>;
}

/* ─── Scroll Progress Bar ─── */
function ScrollProgressBar() {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const fn = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setWidth(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return <div className="scroll-progress-bar" style={{ width: `${width}%` }} />;
}

/* ═══════════════════════════════════════════════════
   EXPERIMENTAL: useCountUp hook (Counter Animation)
   ═══════════════════════════════════════════════════ */
function useCountUp(target: number, duration = 2000, startOnMount = false) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if ((!startOnMount && !hasStarted)) return;
    let startTime: number | null = null;
    let raf: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setCount(Math.floor(eased * target));
      if (progress < 1) raf = requestAnimationFrame(animate);
      else setCount(target);
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [hasStarted, target, duration, startOnMount]);

  return { count, ref };
}

/* ─── EXPERIMENTAL: AnimatedCounter component ─── */
function AnimatedCounter({ target, suffix = "", prefix = "", duration = 2000, delay = 0, divisor = 1 }: {
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  delay?: number;
  divisor?: number;
}) {
  const [started, setStarted] = useState(false);
  const countRef = useRef<HTMLDivElement>(null);
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    const el = countRef.current;
    if (!el) return;
    const safetyTimer = setTimeout(() => setStarted(true), 3000);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setStarted(true), delay);
          observer.disconnect();
          clearTimeout(safetyTimer);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => { observer.disconnect(); clearTimeout(safetyTimer); };
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    let startTime: number | null = null;
    let raf: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayCount(Math.floor(eased * target));
      if (progress < 1) raf = requestAnimationFrame(animate);
      else setDisplayCount(target);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [started, target, duration]);

  return (
    <div ref={countRef} className="text-3xl sm:text-4xl font-bold text-gold-gradient-shimmer stat-number-glow">
      {prefix}{divisor > 1 ? (displayCount / divisor).toFixed(1) : displayCount.toLocaleString()}{suffix}
    </div>
  );
}

/* ─── FadeIn (CSS scroll animation via IntersectionObserver) ─── */
function FadeIn({ children, delay = 0, className = "" }: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <div ref={ref} className={`${className} scroll-animate ${isVisible ? "is-visible" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function ScaleIn({ children, delay = 0, className = "" }: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <div ref={ref} className={`${className} scroll-animate scale-in ${isVisible ? "is-visible" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ─── Data ─── */
const advantages = [
  { Icon: IconGradCap, title: "تعليم عالي الجودة", desc: "برامج أكاديمية قوية في الطب، طب الأسنان، الصيدلة، الهندسة، إدارة الأعمال، وعلوم الحاسوب مع اعتمادات دولية متعددة." },
  { Icon: IconGlobe, title: "برامج باللغة الإنجليزية", desc: "مجموعة واسعة من البرامج الأكاديمية باللغة الإنجليزية، مما يتيح للطلاب الدوليين متابعة دراستهم دون حاجة لإتقان اللغة الجورجية." },
  { Icon: IconDollar, title: "تكاليف مناسبة", desc: "الرسوم الدراسية وتكاليف المعيشة أقل بكثير مقارنة بالعديد من الدول الأوروبية، مما يجعلها خياراً اقتصادياً ممتازاً." },
  { Icon: IconFileCheck, title: "سهولة التأشيرة", desc: "إجراءات الحصول على تأشيرة الدراسة والإقامة سهلة وميسرة مقارنة بالعديد من الوجهات الدراسية الأخرى حول العالم." },
  { Icon: IconUsers, title: "بيئة دولية متنوعة", desc: "الجامعات تستقطب آلاف الطلاب من مختلف دول العالم، مما يخلق بيئة تعليمية متعددة الثقافات وشبكة علاقات دولية." },
  { Icon: IconShield, title: "الأمان والاستقرار", desc: "جورجيا من الدول الآمنة للطلاب الدوليين، وتوفر بيئة مناسبة ومريحة للعيش والدراسة طوال فترة البرنامج الأكاديمي." },
  { Icon: IconNature, title: "طبيعة خلابة", desc: "طبيعة ساحرة تجمع بين الجبال والبحيرات والغابات والسواحل، مما يمنح الطلاب تجربة معيشية استثنائية ومميزة." },
];

/* data loaded via useSiteData() from Turso DB */

const services = [
  { Icon: IconTranslate, title: "ترجمة وتصديق الأوراق", desc: "ترجمة وتصديق جميع الأوراق المطلوبة للتقديم على الجامعات" },
  { Icon: IconAward, title: "الموافقة الوزارية", desc: "الحصول على الموافقة الوزارية اللازمة للدراسة في جورجيا" },
  { Icon: IconAccept, title: "القبول الجامعي", desc: "التقديم وتأمين القبول في إحدى الجامعات المتفق عليها" },
  { Icon: IconHome, title: "ترتيب السكن", desc: "المساعدة في اختيار وحجز السكن المناسب لميزانيتك" },
  { Icon: IconVisa, title: "إرشاد التأشيرة", desc: "إرشاد وتوجيه كامل لجميع إجراءات التأشيرة والسفر" },
  { Icon: IconSupport, title: "متابعة مستمرة", desc: "متابعة مستمرة حتى استكمال جميع إجراءات القبول" },
];

/* accompanimentServices removed — now in siteConfig.additionalPackage */
/* requiredDocs removed — now in siteConfig.registration.docs */

/* ═══════════════════════════════════════════════════
   Navbar — matches unistation.org header structure
   ═══════════════════════════════════════════════════ */

const BASE_URL = "https://unistation.org";

const navLinks = [
  { label: "عن الشركة", href: `${BASE_URL}/about-us` },
  { label: "وجهات الدراسة", href: `${BASE_URL}/destinations` },
];

const languageDropdown = [
  { label: "English", href: `${BASE_URL}/language-courses/english` },
  { label: "Turkish", href: `${BASE_URL}/language-courses/turkish` },
  { label: "German", href: `${BASE_URL}/language-courses/deutsch` },
  { label: "Spanish", href: `${BASE_URL}/language-courses/espanol` },
];

const examDropdown = [
  { label: "SAT", href: "https://en.wikipedia.org/wiki/SAT" },
  { label: "UCAT", href: "https://en.wikipedia.org/wiki/University_Clinical_Aptitude_Test" },
  { label: "GRE", href: "https://en.wikipedia.org/wiki/Graduate_Record_Examinations" },
  { label: "GMAT", href: "https://en.wikipedia.org/wiki/Graduate_Management_Admission_Test" },
  { label: "UEMS", href: "https://en.wikipedia.org/wiki/European_Union_of_Medical_Specialists" },
  { label: "IB", href: "https://en.wikipedia.org/wiki/International_Baccalaureate" },
  { label: "AP", href: "https://en.wikipedia.org/wiki/Advanced_Placement" },
];

const rightLinks = [
  { label: "باقاتنا", href: `${BASE_URL}/packages` },
];

const resourcesDropdown = [
  { label: "ندوات", href: `${BASE_URL}/webiners` },
  { label: "دورات تعليمية", href: `${BASE_URL}/tutorials` },
  { label: "بودكاست", href: `${BASE_URL}/coming-soon` },
  { label: "المدونة", href: `${BASE_URL}/blogs` },
];

/* ── Dropdown Trigger ── */
function DropdownTrigger({ label, isOpen, onToggle, scrolled }: { label: string; isOpen: boolean; onToggle: () => void; scrolled: boolean }) {
  return (
    <button onClick={(e) => { e.stopPropagation(); onToggle(); }}
      className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
        scrolled ? "text-gray-600 hover:text-brand-purple hover:bg-brand-gold/10" : "text-white/80 hover:text-white hover:bg-white/10"
      }`}
    >
      <span>{label}</span>
      <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
}

/* ── Dropdown Menu ── */
function DropdownMenu({ items, isOpen, onClose, scrolled }: { items: { label: string; href: string }[]; isOpen: boolean; onClose: () => void; scrolled: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, onClose]);
  return (
    <div ref={ref} className={`absolute top-full right-0 mt-1 w-52 rounded-xl shadow-xl border overflow-hidden transition-all duration-200 z-50 ${
      isOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
    } ${scrolled ? "bg-white border-gray-100" : "bg-brand-purple-dark/95 backdrop-blur-xl border-white/15"}`}>
      {items.map((item) => (
        <a key={item.href} href={item.href} target={item.href.startsWith("http") && !item.href.startsWith(BASE_URL) ? "_blank" : undefined} rel="noopener noreferrer"
          className={`block px-4 py-2.5 text-sm transition-colors ${
            scrolled ? "text-gray-600 hover:text-brand-purple hover:bg-brand-gold/10" : "text-white/80 hover:text-white hover:bg-white/10"
          }`}
        >{item.label}</a>
      ))}
    </div>
  );
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Close dropdown when scrolling
  useEffect(() => {
    if (scrolled) setOpenDropdown(null);
  }, [scrolled]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 animate-nav-entrance ${
      scrolled ? "bg-white/95 backdrop-blur-xl shadow-lg py-3" : "bg-transparent py-5"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href={BASE_URL} className="flex items-center gap-3">
            <Image src="/logos/Logo 01.png" alt="UniStation" width={44} height={44} className="rounded-xl" />
            <span className={`font-bold text-xl tracking-wide transition-colors ${scrolled ? "text-brand-purple" : "text-white"}`}>
              UniStation
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {/* Left section */}
            {navLinks.map((l) => (
              <a key={l.href} href={l.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  scrolled ? "text-gray-600 hover:text-brand-purple hover:bg-brand-gold/10" : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >{l.label}</a>
            ))}

            {/* Language Courses Dropdown */}
            <div className="relative">
              <DropdownTrigger label="دورات اللغات" isOpen={openDropdown === "lang"} onToggle={() => setOpenDropdown(openDropdown === "lang" ? null : "lang")} scrolled={scrolled} />
              <DropdownMenu items={languageDropdown} isOpen={openDropdown === "lang"} onClose={() => setOpenDropdown(null)} scrolled={scrolled} />
            </div>

            {/* Exam Prep Dropdown */}
            <div className="relative">
              <DropdownTrigger label="تحضير الامتحانات" isOpen={openDropdown === "exam"} onToggle={() => setOpenDropdown(openDropdown === "exam" ? null : "exam")} scrolled={scrolled} />
              <DropdownMenu items={examDropdown} isOpen={openDropdown === "exam"} onClose={() => setOpenDropdown(null)} scrolled={scrolled} />
            </div>

            {/* Right section divider */}
            <div className={`w-px h-5 mx-2 ${scrolled ? "bg-gray-200" : "bg-white/20"}`} />

            {rightLinks.map((l) => (
              <a key={l.href} href={l.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  scrolled ? "text-gray-600 hover:text-brand-purple hover:bg-brand-gold/10" : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >{l.label}</a>
            ))}

            {/* Resources Dropdown */}
            <div className="relative">
              <DropdownTrigger label="الموارد" isOpen={openDropdown === "resources"} onToggle={() => setOpenDropdown(openDropdown === "resources" ? null : "resources")} scrolled={scrolled} />
              <DropdownMenu items={resourcesDropdown} isOpen={openDropdown === "resources"} onClose={() => setOpenDropdown(null)} scrolled={scrolled} />
            </div>

            {/* Contact */}
            <a href={`${BASE_URL}/contact`}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                scrolled ? "text-gray-600 hover:text-brand-purple hover:bg-brand-gold/10" : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >تواصل معنا</a>

            {/* WhatsApp CTA */}
            <a href="https://wa.me/971522732589" target="_blank" rel="noopener noreferrer"
              className="mr-3 bg-brand-gold text-brand-purple-dark font-bold text-sm px-5 py-2.5 rounded-full flex items-center gap-2 shadow-lg cursor-pointer hover:shadow-brand-gold/40 transition-shadow"
            >
              <WhatsAppIcon className="w-4 h-4" />
              WhatsApp
            </a>
          </div>

          {/* Mobile Hamburger */}
          <button onClick={() => { setMobileOpen(!mobileOpen); setMobileDropdown(null); }}
            className={`lg:hidden p-2 rounded-xl ${scrolled ? "text-brand-purple" : "text-white"}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              {mobileOpen ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? "max-h-[2000px] opacity-100 mt-4" : "max-h-0 opacity-0"
        }`}>
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            {/* Simple links */}
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                className="block px-5 py-3.5 text-gray-700 hover:text-brand-purple hover:bg-brand-purple/5 text-sm font-medium border-b border-gray-50"
              >{l.label}</a>
            ))}

            {/* Mobile: Language Courses */}
            <div>
              <button onClick={() => setMobileDropdown(mobileDropdown === "lang" ? null : "lang")}
                className="w-full flex items-center justify-between px-5 py-3.5 text-gray-700 hover:text-brand-purple text-sm font-medium border-b border-gray-50 cursor-pointer"
              >
                <span>دورات اللغات</span>
                <svg className={`w-4 h-4 transition-transform duration-200 ${mobileDropdown === "lang" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </button>
              <div className={`overflow-hidden transition-all duration-200 ${mobileDropdown === "lang" ? "max-h-[300px]" : "max-h-0"}`}>
                {languageDropdown.map((item) => (
                  <a key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                    className="block pr-10 pl-5 py-2.5 text-sm text-gray-500 hover:text-brand-purple hover:bg-brand-purple/5"
                  >{item.label}</a>
                ))}
              </div>
            </div>

            {/* Mobile: Exam Prep */}
            <div>
              <button onClick={() => setMobileDropdown(mobileDropdown === "exam" ? null : "exam")}
                className="w-full flex items-center justify-between px-5 py-3.5 text-gray-700 hover:text-brand-purple text-sm font-medium border-b border-gray-50 cursor-pointer"
              >
                <span>تحضير الامتحانات</span>
                <svg className={`w-4 h-4 transition-transform duration-200 ${mobileDropdown === "exam" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </button>
              <div className={`overflow-hidden transition-all duration-200 ${mobileDropdown === "exam" ? "max-h-[400px]" : "max-h-0"}`}>
                {examDropdown.map((item) => (
                  <a key={item.href} href={item.href} onClick={() => setMobileOpen(false)} target={item.href.startsWith("https://en.wikipedia") ? "_blank" : undefined} rel="noopener noreferrer"
                    className="block pr-10 pl-5 py-2.5 text-sm text-gray-500 hover:text-brand-purple hover:bg-brand-purple/5"
                  >{item.label}</a>
                ))}
              </div>
            </div>

            {rightLinks.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                className="block px-5 py-3.5 text-gray-700 hover:text-brand-purple hover:bg-brand-purple/5 text-sm font-medium border-b border-gray-50"
              >{l.label}</a>
            ))}

            {/* Mobile: Resources */}
            <div>
              <button onClick={() => setMobileDropdown(mobileDropdown === "resources" ? null : "resources")}
                className="w-full flex items-center justify-between px-5 py-3.5 text-gray-700 hover:text-brand-purple text-sm font-medium border-b border-gray-50 cursor-pointer"
              >
                <span>الموارد</span>
                <svg className={`w-4 h-4 transition-transform duration-200 ${mobileDropdown === "resources" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </button>
              <div className={`overflow-hidden transition-all duration-200 ${mobileDropdown === "resources" ? "max-h-[300px]" : "max-h-0"}`}>
                {resourcesDropdown.map((item) => (
                  <a key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                    className="block pr-10 pl-5 py-2.5 text-sm text-gray-500 hover:text-brand-purple hover:bg-brand-purple/5"
                  >{item.label}</a>
                ))}
              </div>
            </div>

            {/* Contact */}
            <a href={`${BASE_URL}/contact`} onClick={() => setMobileOpen(false)}
              className="block px-5 py-3.5 text-gray-700 hover:text-brand-purple hover:bg-brand-purple/5 text-sm font-medium border-b border-gray-50"
            >تواصل معنا</a>

            {/* WhatsApp CTA */}
            <div className="p-3">
              <a href="https://wa.me/971522732589" target="_blank" rel="noopener noreferrer"
                className="block bg-brand-gold text-brand-purple-dark font-bold text-sm px-4 py-3 rounded-xl text-center"
              >تواصل عبر واتساب</a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

/* ═══════════════════════════════════════════════════
   Hero
   ═══════════════════════════════════════════════════ */
function HeroSection() {
  const { stats } = useSiteData();
  /* ── EXPERIMENTAL: Hero Video Background ──
     Fix 1: Video shows immediately (not waiting for loaded event)
     Fix 2: Crossfade loop — two video elements alternate to hide the restart jump
     The purple overlay + subtle fade at loop point mask the transition entirely.
  */
  const videoARef = useRef<HTMLVideoElement>(null);
  const videoBRef = useRef<HTMLVideoElement>(null);
  const [activeVideo, setActiveVideo] = useState<"A" | "B">("A");
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const playVideo = (v: HTMLVideoElement | null) => {
      if (!v) return;
      v.currentTime = 0;
      v.play().catch(() => {});
    };

    const a = videoARef.current;
    const b = videoBRef.current;

    if (a && b) {
      // Start video A immediately
      playVideo(a);

      // When A ends, crossfade to B (which also starts from 0)
      const onEndedA = () => {
        playVideo(b);
        setActiveVideo("B");
      };
      // When B ends, crossfade back to A
      const onEndedB = () => {
        playVideo(a);
        setActiveVideo("A");
      };

      a.addEventListener("ended", onEndedA);
      b.addEventListener("ended", onEndedB);

      return () => {
        a.removeEventListener("ended", onEndedA);
        b.removeEventListener("ended", onEndedB);
      };
    }
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        {/* EXPERIMENTAL: Dual video crossfade for seamless looping */}
        {/* Video A */}
        <video
          ref={videoARef}
          autoPlay
          muted
          playsInline
          onError={() => setVideoError(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
            activeVideo === "A" && !videoError ? "opacity-100" : "opacity-0"
          }`}
          style={{ filter: "brightness(0.7)" }}
        >
          <source src="/landing-page/hero-video.mp4" type="video/mp4" />
        </video>
        {/* Video B (same src, starts when A ends) */}
        <video
          ref={videoBRef}
          muted
          playsInline
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
            activeVideo === "B" && !videoError ? "opacity-100" : "opacity-0"
          }`}
          style={{ filter: "brightness(0.7)" }}
        >
          <source src="/landing-page/hero-video.mp4" type="video/mp4" />
        </video>
        {/* Image fallback — only shows if both videos fail */}
        <Image
          src="/hero-tbilisi.png"
          alt="Tbilisi"
          fill
          className={`object-cover transition-opacity duration-700 ${videoError ? "opacity-100" : "opacity-0"}`}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-purple-dark/85 via-brand-purple/70 to-brand-purple-dark/90" />
      </div>

      <div className="absolute top-20 right-10 w-72 h-72 bg-brand-gold/5 rounded-full blur-3xl hero-float blob-morph" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-brand-purple/20 rounded-full blur-3xl hero-float-slow blob-morph" />

      {/* Floating particles */}
      <div className="hero-particle-1 absolute top-[15%] right-[20%] w-2 h-2 bg-brand-gold/30 rounded-full" />
      <div className="hero-particle-2 absolute top-[40%] left-[15%] w-3 h-3 bg-brand-gold/20 rounded-full" />
      <div className="hero-particle-3 absolute top-[60%] right-[30%] w-1.5 h-1.5 bg-white/25 rounded-full" />
      <div className="hero-particle-4 absolute top-[25%] left-[40%] w-2.5 h-2.5 bg-brand-gold/15 rounded-full" />
      <div className="hero-particle-5 absolute bottom-[30%] right-[15%] w-2 h-2 bg-white/20 rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 text-center">
        <div className="hero-animate hero-delay-1">
          <span className="badge-bounce-in inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/15 text-brand-gold text-sm px-5 py-2 rounded-full mb-8">
            <IconStethoscope className="w-4 h-4" />
            بوابتك نحو التميز الأكاديمي
          </span>
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[1.1] hero-animate hero-delay-2">
          <span className="text-white">الدراسة في</span>
          <br />
          <span className="text-gold-gradient-shimmer">جورجيا</span>
        </h1>

        <p className="text-lg sm:text-xl text-white/70 max-w-3xl mx-auto mb-12 leading-relaxed hero-animate hero-delay-3">
          بوابتك للتعليم العالي المتميز في أفضل الجامعات الجورجية المعتمدة دولياً.
          دراسة الطب البشري، طب الأسنان، الصيدلة والمزيد بتكاليف مناسبة في بيئة آمنة.
        </p>

        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center hero-animate hero-delay-4">
          <a href="https://wa.me/971522732589" target="_blank" rel="noopener noreferrer"
            className="bg-brand-gold text-brand-purple-dark font-bold text-lg px-10 py-4 rounded-full flex items-center gap-3 min-w-[260px] justify-center cursor-pointer btn-gold-hover"
          >
            <WhatsAppIcon className="w-5 h-5" />
            احجز استشارة مجانية
          </a>
          <a href="#universities"
            className="border-2 border-white/20 text-white font-medium text-lg px-10 py-4 rounded-full flex items-center gap-3 min-w-[260px] justify-center backdrop-blur-sm cursor-pointer btn-outline-hover"
          >
            استكشف الجامعات
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </a>
        </div>

        {/* EXPERIMENTAL: Animated Counter Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-5 max-w-4xl mx-auto hero-animate hero-delay-5">
          {stats.map((s, i) => (
            <div key={i} className="bg-white/8 backdrop-blur-md border border-white/12 rounded-2xl p-5 hover:bg-white/15 transition-all duration-300 hover:-translate-y-1 hover:border-brand-gold/20">
              <AnimatedCounter target={s.target} prefix={s.prefix} suffix={s.suffix} divisor={s.divisor} duration={2500} delay={i * 200} />
              <div className="text-white/50 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hero-bounce-arrow">
        <svg className="w-8 h-8 text-white/30" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7" />
        </svg>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   Why Georgia
   ═══════════════════════════════════════════════════ */
function WhyGeorgiaSection() {
  return (
    <section id="why-georgia" className="py-24 sm:py-32 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-brand-purple/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <FadeIn className="text-center mb-16">
          <span className="inline-flex items-center gap-2 bg-brand-purple/5 text-brand-purple text-sm font-medium px-5 py-2 rounded-full mb-5 border border-brand-purple/10">
            <IconGlobe className="w-4 h-4" />
            لماذا جورجيا؟
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-purple mb-5 leading-tight">
            وجهة متميزة للتعليم
            <br />
            <span className="text-gold-gradient">الدولي</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-3xl mx-auto leading-relaxed">
            أصبحت جورجيا خلال السنوات الأخيرة من أكثر الوجهات جذباً للطلاب الدوليين،
            بتقديم تعليم عالي الجودة بتكاليف معقولة في بيئة آمنة ومتنوعة ثقافياً.
          </p>
          <div className="gold-line mx-auto mt-6" />
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {advantages.map((item, i) => (
            <ScaleIn key={i} delay={i * 60}>
              <Card className="group h-full hover:-translate-y-2 transition-all duration-300 border-0 bg-white shadow-sm rounded-2xl overflow-hidden relative hover:shadow-xl hover:shadow-brand-purple/10">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-gold to-brand-gold-light scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right" />
                <CardContent className="p-7 pt-8">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-gold/10 to-brand-gold/5 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <item.Icon className="w-7 h-7 text-brand-gold" />
                  </div>
                  <h3 className="font-bold text-brand-purple text-lg mb-3">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            </ScaleIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   Universities
   ═══════════════════════════════════════════════════ */
function UniversitiesSection() {
  const { universities } = useSiteData();
  return (
    <section id="universities" className="py-24 sm:py-32 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <span className="inline-flex items-center gap-2 bg-brand-gold/10 text-brand-gold-dark text-sm font-medium px-5 py-2 rounded-full mb-5 border border-brand-gold/20">
            <IconStethoscope className="w-4 h-4" />
            الجامعات الطبية الموصى بها
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-purple mb-5 leading-tight">
            أفضل 6 جامعات لدراسة
            <br />
            <span className="text-gold-gradient">الطب البشري</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-3xl mx-auto leading-relaxed">
            تضم جورجيا 15 جامعة تدرس الطب بالإنجليزية، ونوصي بهذه الجامعات الست المتميزة.
          </p>
          <div className="gold-line mx-auto mt-6" />
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {universities.map((uni, i) => (
            <ScaleIn key={i} delay={i * 80}>
              <Card className={`group h-full hover:-translate-y-2 transition-all duration-300 border-0 rounded-2xl overflow-hidden hover:shadow-xl ${uni.highlight ? "ring-2 ring-brand-gold/40" : ""}`}>
                <div className={`relative p-7 ${uni.highlight ? "bg-gradient-to-br from-brand-gold via-brand-gold to-brand-gold-dark" : "bg-gradient-to-br from-brand-purple to-brand-purple-light"}`}>
                  {uni.highlight && <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/25 backdrop-blur-sm text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">#1 الخيار الأفضل</div>}
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-white/20" />
                  <div className="flex items-center justify-between mb-3">
                    <span className={`font-mono text-sm font-bold ${uni.highlight ? "text-brand-purple-dark/70" : "text-white/60"}`}>{uni.abbr}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2.5 py-1 rounded-full ${uni.highlight ? "bg-brand-purple-dark/20 text-brand-purple-dark" : "bg-white/15 text-white"}`}>{uni.type}</span>
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${uni.highlight ? "bg-brand-purple-dark text-brand-gold" : "bg-brand-gold text-brand-purple-dark"}`}>#{uni.rank}</div>
                    </div>
                  </div>
                  <h3 className={`font-bold text-lg leading-tight ${uni.highlight ? "text-brand-purple-dark" : "text-white"}`}>{uni.nameAr}</h3>
                </div>
                <CardContent className="p-7">
                  <p className="text-gray-500 text-sm leading-relaxed mb-5">{uni.description}</p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {uni.features.map((f, j) => <span key={j} className="text-xs bg-brand-purple/5 text-brand-purple px-3 py-1.5 rounded-full font-medium">{f}</span>)}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-400">الرسوم السنوية</span>
                    <span className="text-xl font-bold text-brand-gold">{uni.fee}</span>
                  </div>
                </CardContent>
              </Card>
            </ScaleIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   Fees
   ═══════════════════════════════════════════════════ */
function FeesSection() {
  const { universities } = useSiteData();
  return (
    <section id="fees" className="py-24 sm:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <span className="inline-flex items-center gap-2 bg-brand-purple/5 text-brand-purple text-sm font-medium px-5 py-2 rounded-full mb-5 border border-brand-purple/10">
            <IconDollar className="w-4 h-4" />
            الرسوم الدراسية
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-purple mb-5 leading-tight">
            قارن <span className="text-gold-gradient">الرسوم السنوية</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-3xl mx-auto">الرسوم السنوية لدراسة الطب البشري في الجامعات الجورجية الموصى بها</p>
          <div className="gold-line mx-auto mt-6" />
        </FadeIn>

        <FadeIn delay={150}>
          <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-gray-100">
            <Table>
              <TableHeader>
                <TableRow className="bg-brand-purple hover:bg-brand-purple">
                  <TableHead className="text-brand-gold font-bold text-right py-5 px-6 text-sm">الجامعة</TableHead>
                  <TableHead className="text-brand-gold font-bold text-center py-5 px-6 text-sm">الرسوم السنوية</TableHead>
                  <TableHead className="text-brand-gold font-bold text-center py-5 px-6 text-sm hidden sm:table-cell">النوع</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {universities.map((u, i) => (
                  <TableRow key={i} className={`transition-colors hover:bg-brand-gold/5 ${i === 0 ? "bg-brand-gold/[0.04]" : ""}`}>
                    <TableCell className="py-5 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${i === 0 ? "bg-brand-gold text-brand-purple-dark" : "bg-brand-purple/10 text-brand-purple"}`}>{u.rank}</div>
                        <div>
                          <span className="font-bold text-brand-purple text-sm">{u.nameAr}</span>
                          <p className="text-xs text-gray-400 mt-0.5 font-mono" dir="ltr">{u.name}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center py-5 px-6">
                      <span className="text-lg font-bold text-brand-gold">{u.fee}</span>
                      <span className="text-xs text-gray-400 block">/ سنوياً</span>
                    </TableCell>
                    <TableCell className="text-center py-5 px-6 hidden sm:table-cell">
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${u.type === "حكومية" ? "bg-brand-purple/10 text-brand-purple" : "bg-brand-gold/10 text-brand-gold-dark"}`}>{u.type}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   Services
   ═══════════════════════════════════════════════════ */
function ServicesSection() {
  const { basicPackage, additionalPackage } = useSiteData();
  return (
    <section id="services" className="py-24 sm:py-32 bg-gradient-to-b from-gray-50/80 to-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <span className="inline-flex items-center gap-2 bg-brand-gold/10 text-brand-gold-dark text-sm font-medium px-5 py-2 rounded-full mb-5 border border-brand-gold/20">خدماتنا</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-purple mb-5 leading-tight">
            ماذا <span className="text-gold-gradient">نقدم لك؟</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-3xl mx-auto">باقة شاملة من الخدمات تضمن رحلة دراسية سلسة وناجحة</p>
          <div className="gold-line mx-auto mt-6" />
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {services.map((s, i) => (
            <FadeIn key={i} delay={i * 60}>
              <Card className="group h-full hover:-translate-y-2 transition-all duration-300 border-0 bg-white shadow-sm rounded-2xl overflow-hidden relative hover:shadow-xl hover:shadow-brand-purple/10">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-gold to-brand-gold-light scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right" />
                <CardContent className="p-7 flex gap-5">
                  <div className="shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-purple to-brand-purple-light flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shadow-lg shadow-brand-purple/20">
                    <s.Icon className="w-6 h-6 text-brand-gold" />
                  </div>
                  <div>
                    <h3 className="font-bold text-brand-purple mb-2">{s.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>

        {/* Pricing — Basic Package */}
        <FadeIn delay={150}>
          <div className="max-w-lg mx-auto">
            <Card className="border-2 border-brand-gold/30 rounded-2xl shadow-2xl relative pt-4 card-shine-effect card-3d-tilt">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 bg-brand-gold text-brand-purple-dark text-xs font-bold px-4 py-1.5 rounded-full shadow-lg whitespace-nowrap pulse-glow">{basicPackage.badge}</div>
              <div className="bg-gradient-to-br from-brand-purple to-brand-purple-light p-10 text-center relative overflow-hidden">
                <h3 className="text-2xl font-bold text-white mb-2 relative">{basicPackage.title}</h3>
                <p className="text-white/60 text-sm relative">{basicPackage.description}</p>
              </div>
              <CardContent className="p-10">
                <div className="text-center mb-8">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-sm text-gray-400">{basicPackage.currency}</span>
                    <span className="text-5xl font-bold text-brand-purple">{basicPackage.totalPrice}</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">{basicPackage.priceNote}</p>
                </div>
                <div className="space-y-4 mb-8">
                  {basicPackage.installments.map((inst: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-4 p-4 bg-brand-gold/5 rounded-xl border border-brand-gold/10">
                      <div className="w-8 h-8 rounded-full bg-brand-gold/20 flex items-center justify-center shrink-0"><span className="text-brand-gold font-bold text-xs">{idx + 1}</span></div>
                      <div><span className="font-bold text-brand-purple text-sm">{inst.label}:</span><span className="text-gray-600 text-sm mr-2">{inst.amount} {basicPackage.currency} {inst.note}</span></div>
                    </div>
                  ))}
                </div>
                <a href="https://wa.me/971522732589" target="_blank" rel="noopener noreferrer"
                  className="block bg-brand-gold text-brand-purple-dark font-bold text-center py-4 rounded-xl cursor-pointer btn-card-hover"
                >
                  احجز استشارتك الآن
                </a>
              </CardContent>
            </Card>
          </div>
        </FadeIn>

        {/* Additional Package — Accompaniment & Reception */}
        <FadeIn delay={200} className="mt-24">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 bg-brand-purple/10 text-brand-purple text-sm font-medium px-5 py-2 rounded-full border border-brand-purple/20">
              خدمة إضافية
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-brand-purple mt-5 mb-4 leading-tight">
              {additionalPackage.title}
            </h3>
            <p className="text-gray-500 text-base max-w-3xl mx-auto leading-relaxed">
              {additionalPackage.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {additionalPackage.services.map((s: any, i: number) => (
              <FadeIn key={i} delay={i * 60}>
                <div className="bg-gradient-to-br from-brand-purple to-brand-purple-dark rounded-2xl p-6 text-center h-full hover:-translate-y-1 transition-transform duration-300">
                  <div className="w-10 h-10 rounded-full bg-brand-gold/20 flex items-center justify-center mx-auto mb-3">
                    <span className="text-brand-gold font-bold text-sm">{i + 1}</span>
                  </div>
                  <h3 className="font-bold text-white text-sm mb-1">{s}</h3>
                </div>
              </FadeIn>
            ))}
          </div>

          <div className="mt-8 max-w-3xl mx-auto">
            <div className="bg-brand-purple/5 border border-brand-purple/10 rounded-xl p-5 text-center">
              <p className="text-brand-purple/70 text-sm leading-relaxed">{additionalPackage.note}</p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   Registration (Required Docs)
   ═══════════════════════════════════════════════════ */
const docIcons = [IconPassport, IconPhoto, IconGrades];

function RegistrationSection() {
  const { registration } = useSiteData();
  return (
    <section id="registration" className="py-24 sm:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <span className="inline-flex items-center gap-2 bg-brand-purple/5 text-brand-purple text-sm font-medium px-5 py-2 rounded-full mb-5 border border-brand-purple/10">خطوات التسجيل</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-purple mb-5 leading-tight">
            خطوات <span className="text-gold-gradient">التسجيل</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-3xl mx-auto">{registration.description}</p>
          <div className="gold-line mx-auto mt-6" />
        </FadeIn>

        {/* Required Docs */}
        <FadeIn delay={150}>
          <div className="max-w-3xl mx-auto">
            <h3 className="text-xl font-bold text-brand-purple text-center mb-8">الأوراق المطلوبة</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {registration.docs.map((doc: any, i: number) => {
                const DocIcon = docIcons[i] || IconFileCheck;
                return (
                  <Card key={i} className="border-0 bg-gray-50 rounded-2xl hover:shadow-md transition-shadow duration-300">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 rounded-xl bg-brand-gold/10 flex items-center justify-center mx-auto mb-4">
                        <DocIcon className="w-6 h-6 text-brand-gold" />
                      </div>
                      <h4 className="font-bold text-brand-purple text-sm mb-1">{doc.title}</h4>
                      <p className="text-gray-400 text-xs">{doc.desc}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   FAQ
   ═══════════════════════════════════════════════════ */
function FAQSection() {
  const { faqs } = useSiteData();
  return (
    <section id="faq" className="py-24 sm:py-32 bg-gradient-to-b from-gray-50/80 to-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <span className="inline-flex items-center gap-2 bg-brand-gold/10 text-brand-gold-dark text-sm font-medium px-5 py-2 rounded-full mb-5 border border-brand-gold/20">الأسئلة الشائعة</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-purple mb-5 leading-tight">
            إجابات على <span className="text-gold-gradient">أسئلتك</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">كل ما تحتاج معرفته عن الدراسة في جورجيا</p>
          <div className="gold-line mx-auto mt-6" />
        </FadeIn>

        <FadeIn delay={100}>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq: any, i: number) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border-0 bg-white rounded-2xl shadow-sm px-6 overflow-hidden hover:shadow-md transition-shadow duration-300">
                <AccordionTrigger className="text-brand-purple font-bold text-right py-5 hover:no-underline text-[15px]">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-gray-500 text-sm leading-relaxed pb-5">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </FadeIn>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   Contact
   ═══════════════════════════════════════════════════ */
function ContactSection() {
  const contactCards = [
    { Icon: IconPhone, label: "اتصل بنا", value: "+971 52 273 2589", href: "tel:+971522732589", color: "from-brand-purple to-brand-purple-light" },
    { Icon: WhatsAppIcon, label: "واتساب", value: "+971 52 273 2589", href: "https://wa.me/971522732589", color: "from-green-500 to-green-600" },
    { Icon: IconMail, label: "البريد الإلكتروني", value: "info@unistation.org", href: "mailto:info@unistation.org", color: "from-brand-gold to-brand-gold-dark" },
  ];

  return (
    <section id="contact" className="py-24 sm:py-32 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <span className="inline-flex items-center gap-2 bg-brand-purple/5 text-brand-purple text-sm font-medium px-5 py-2 rounded-full mb-5 border border-brand-purple/10">تواصل معنا</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-purple mb-5 leading-tight">
            نحن هنا <span className="text-gold-gradient">لمساعدتك</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">تواصل معنا عبر أي من الطرق التالية وسنرد عليك في أقرب وقت</p>
          <div className="gold-line mx-auto mt-6" />
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {contactCards.map((card, i) => (
            <FadeIn key={i} delay={i * 100}>
              <a href={card.href} target="_blank" rel="noopener noreferrer"
                className="block group"
              >
                <Card className="border-0 bg-white shadow-sm rounded-2xl overflow-hidden hover:-translate-y-2 transition-all duration-300 hover:shadow-xl">
                  <div className={`bg-gradient-to-br ${card.color} p-6 flex items-center justify-center`}>
                    <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <card.Icon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <CardContent className="p-5 text-center">
                    <p className="text-gray-400 text-xs mb-1">{card.label}</p>
                    <p className="font-bold text-brand-purple text-sm" dir="ltr">{card.value}</p>
                  </CardContent>
                </Card>
              </a>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   CTA
   ═══════════════════════════════════════════════════ */
function CTASection() {
  return (
    <section className="py-24 sm:py-32 bg-gradient-to-br from-brand-purple-dark via-brand-purple to-brand-purple-light relative overflow-hidden animate-gradient-bg">
      <div className="absolute inset-0 bg-[url('/landing-page/georgia-nature.png')] bg-cover bg-center opacity-10" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        <FadeIn>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            ابدأ رحلتك الأكاديمية
            <br />
            <span className="text-gold-gradient">في جورجيا اليوم</span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            لا تضيع الوقت. احجز استشارتك المجانية الآن واكتشف الفرصة المناسبة لك في أفضل الجامعات الجورجية.
          </p>
          <a href="https://wa.me/971522732589" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-brand-gold text-brand-purple-dark font-bold text-lg px-10 py-4 rounded-full cursor-pointer btn-cta-hover"
          >
            <WhatsAppIcon className="w-5 h-5" />
            احجز استشارة مجانية
          </a>
        </FadeIn>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   Footer
   ═══════════════════════════════════════════════════ */
function Footer() {
  return (
    <footer className="bg-brand-purple-dark py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          <div className="flex items-center gap-3">
            <Image src="/logos/Logo 01.png" alt="UniStation" width={48} height={48} className="rounded-xl" />
            <div>
              <span className="font-bold text-xl text-white block">UniStation</span>
              <span className="text-white/40 text-xs">YOUR GATEWAY TO STUDY ABROAD</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="https://wa.me/971522732589" target="_blank" rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl bg-white/10 hover:bg-brand-gold/20 flex items-center justify-center text-white hover:text-brand-gold transition-all"
            >
              <WhatsAppIcon className="w-5 h-5" />
            </a>
            <a href="mailto:info@unistation.org"
              className="w-10 h-10 rounded-xl bg-white/10 hover:bg-brand-gold/20 flex items-center justify-center text-white hover:text-brand-gold transition-all"
            >
              <IconMail className="w-5 h-5" />
            </a>
            <div className="w-px h-6 bg-white/15" />
            <a href="https://www.instagram.com/unistation1/" target="_blank" rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl bg-white/10 hover:bg-brand-gold/20 flex items-center justify-center text-white hover:text-brand-gold transition-all"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/25 text-sm">&copy; {new Date().getFullYear()} UniStation. جميع الحقوق محفوظة.</p>
          <p className="text-white/20 text-xs tracking-wider">YOUR GATEWAY TO STUDY ABROAD</p>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════
   Floating WhatsApp
   ═══════════════════════════════════════════════════ */
function FloatingWhatsApp() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  return (
    <a href="https://wa.me/971522732589" target="_blank" rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-50 bg-green-500 hover:bg-green-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl shadow-green-500/30 transition-all hover:scale-110 active:scale-95 floating-whatsapp-animate"
    >
      <WhatsAppIcon className="w-8 h-8" />
    </a>
  );
}

/* ═══════════════════════════════════════════════════
   Main Page
   ═══════════════════════════════════════════════════ */
export default function LandingPage() {
  return (
    <SiteDataProvider>
    <main className="min-h-screen flex flex-col bg-white">
      <ScrollProgressBar />
      <Navbar />
      <HeroSection />
      <WhyGeorgiaSection />
      <UniversitiesSection />
      <FeesSection />
      <ServicesSection />
      <RegistrationSection />
      <FAQSection />
      <ContactSection />
      <CTASection />
      <Footer />
      <FloatingWhatsApp />
    </main>
    </SiteDataProvider>
  );
}
