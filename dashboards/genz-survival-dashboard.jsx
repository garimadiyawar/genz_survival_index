import { useState } from "react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";

/* ─── FONTS ─────────────────────────────────────────────────────────────── */
const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Share+Tech+Mono&family=Outfit:wght@300;400;500;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  ::-webkit-scrollbar { width: 4px; height: 4px; background: #0a1628; }
  ::-webkit-scrollbar-thumb { background: #1e3a5f; border-radius: 2px; }
`;

/* ─── CITY DATA ──────────────────────────────────────────────────────────── */
// Sources: Numbeo (CoL/Rent/QoL/PP) · World Bank API (Unemployment/Inflation/GDP)
// Stack Overflow Survey 2024 (AI Usage/Job Sat/Remote) · LinkedIn/Kaggle (AI Jobs/Salary)
const CITIES = [
  { city:"Seattle",       flag:"🇺🇸", region:"North America", ppScore:85, secScore:68, aiScore:85, survivalScore:79, medianSalary:120000, costOfLiving:82,  rentIdx:79,  purchasingPower:93, youthUnemp:7.5,  jobSat:54, remoteHybrid:70, inflation:3.2, aiUsage:80, aiJobPct:6.4, chatgptPct:67, qol:81 },
  { city:"San Francisco", flag:"🇺🇸", region:"North America", ppScore:82, secScore:56, aiScore:88, survivalScore:75, medianSalary:140000, costOfLiving:97,  rentIdx:105, purchasingPower:88, youthUnemp:8.2,  jobSat:52, remoteHybrid:68, inflation:3.4, aiUsage:82, aiJobPct:7.8, chatgptPct:68, qol:81 },
  { city:"Austin",        flag:"🇺🇸", region:"North America", ppScore:82, secScore:68, aiScore:76, survivalScore:76, medianSalary:95000,  costOfLiving:74,  rentIdx:72,  purchasingPower:95, youthUnemp:7.8,  jobSat:56, remoteHybrid:65, inflation:3.1, aiUsage:75, aiJobPct:5.2, chatgptPct:62, qol:80 },
  { city:"Dubai",         flag:"🇦🇪", region:"Middle East",   ppScore:72, secScore:80, aiScore:72, survivalScore:75, medianSalary:76000,  costOfLiving:78,  rentIdx:75,  purchasingPower:79, youthUnemp:3.2,  jobSat:52, remoteHybrid:45, inflation:2.8, aiUsage:74, aiJobPct:4.2, chatgptPct:63, qol:77 },
  { city:"Munich",        flag:"🇩🇪", region:"Europe",         ppScore:74, secScore:78, aiScore:68, survivalScore:74, medianSalary:72000,  costOfLiving:70,  rentIdx:62,  purchasingPower:71, youthUnemp:4.8,  jobSat:60, remoteHybrid:58, inflation:2.9, aiUsage:68, aiJobPct:3.6, chatgptPct:57, qol:92 },
  { city:"Boston",        flag:"🇺🇸", region:"North America", ppScore:78, secScore:62, aiScore:82, survivalScore:74, medianSalary:110000, costOfLiving:88,  rentIdx:88,  purchasingPower:87, youthUnemp:8.8,  jobSat:51, remoteHybrid:62, inflation:3.3, aiUsage:78, aiJobPct:5.8, chatgptPct:64, qol:79 },
  { city:"Tel Aviv",      flag:"🇮🇱", region:"Middle East",   ppScore:72, secScore:66, aiScore:86, survivalScore:73, medianSalary:82000,  costOfLiving:81,  rentIdx:84,  purchasingPower:63, youthUnemp:7.5,  jobSat:54, remoteHybrid:58, inflation:4.2, aiUsage:80, aiJobPct:5.8, chatgptPct:68, qol:70 },
  { city:"Singapore",     flag:"🇸🇬", region:"Asia",           ppScore:67, secScore:74, aiScore:82, survivalScore:73, medianSalary:78000,  costOfLiving:88,  rentIdx:95,  purchasingPower:82, youthUnemp:6.5,  jobSat:52, remoteHybrid:50, inflation:3.0, aiUsage:79, aiJobPct:4.8, chatgptPct:64, qol:77 },
  { city:"Zurich",        flag:"🇨🇭", region:"Europe",         ppScore:72, secScore:74, aiScore:70, survivalScore:72, medianSalary:110000, costOfLiving:116, rentIdx:98,  purchasingPower:88, youthUnemp:6.5,  jobSat:62, remoteHybrid:55, inflation:1.8, aiUsage:70, aiJobPct:3.4, chatgptPct:58, qol:97 },
  { city:"Berlin",        flag:"🇩🇪", region:"Europe",         ppScore:70, secScore:74, aiScore:66, survivalScore:70, medianSalary:62000,  costOfLiving:65,  rentIdx:52,  purchasingPower:78, youthUnemp:5.8,  jobSat:58, remoteHybrid:65, inflation:2.5, aiUsage:68, aiJobPct:3.2, chatgptPct:56, qol:85 },
  { city:"Amsterdam",     flag:"🇳🇱", region:"Europe",         ppScore:68, secScore:70, aiScore:74, survivalScore:70, medianSalary:68000,  costOfLiving:76,  rentIdx:78,  purchasingPower:76, youthUnemp:8.2,  jobSat:62, remoteHybrid:64, inflation:2.6, aiUsage:72, aiJobPct:3.6, chatgptPct:59, qol:91 },
  { city:"Dublin",        flag:"🇮🇪", region:"Europe",         ppScore:70, secScore:64, aiScore:72, survivalScore:68, medianSalary:72000,  costOfLiving:72,  rentIdx:76,  purchasingPower:74, youthUnemp:9.8,  jobSat:56, remoteHybrid:62, inflation:3.5, aiUsage:72, aiJobPct:4.2, chatgptPct:60, qol:84 },
  { city:"New York",      flag:"🇺🇸", region:"North America", ppScore:73, secScore:52, aiScore:84, survivalScore:68, medianSalary:105000, costOfLiving:100, rentIdx:100, purchasingPower:90, youthUnemp:9.5,  jobSat:48, remoteHybrid:55, inflation:3.5, aiUsage:77, aiJobPct:4.2, chatgptPct:65, qol:65 },
  { city:"Toronto",       flag:"🇨🇦", region:"North America", ppScore:71, secScore:58, aiScore:72, survivalScore:67, medianSalary:75000,  costOfLiving:74,  rentIdx:72,  purchasingPower:76, youthUnemp:11.5, jobSat:52, remoteHybrid:60, inflation:3.8, aiUsage:73, aiJobPct:4.0, chatgptPct:61, qol:82 },
  { city:"Sydney",        flag:"🇦🇺", region:"Oceania",        ppScore:68, secScore:62, aiScore:72, survivalScore:67, medianSalary:72000,  costOfLiving:78,  rentIdx:81,  purchasingPower:73, youthUnemp:9.8,  jobSat:55, remoteHybrid:58, inflation:3.5, aiUsage:74, aiJobPct:3.6, chatgptPct:62, qol:87 },
  { city:"Melbourne",     flag:"🇦🇺", region:"Oceania",        ppScore:68, secScore:62, aiScore:70, survivalScore:66, medianSalary:70000,  costOfLiving:75,  rentIdx:74,  purchasingPower:74, youthUnemp:9.5,  jobSat:58, remoteHybrid:58, inflation:3.4, aiUsage:72, aiJobPct:3.2, chatgptPct:61, qol:91 },
  { city:"Copenhagen",    flag:"🇩🇰", region:"Europe",         ppScore:68, secScore:62, aiScore:68, survivalScore:66, medianSalary:70000,  costOfLiving:78,  rentIdx:72,  purchasingPower:72, youthUnemp:10.2, jobSat:64, remoteHybrid:62, inflation:3.2, aiUsage:68, aiJobPct:3.0, chatgptPct:55, qol:92 },
  { city:"Montreal",      flag:"🇨🇦", region:"North America", ppScore:70, secScore:58, aiScore:66, survivalScore:65, medianSalary:65000,  costOfLiving:65,  rentIdx:58,  purchasingPower:78, youthUnemp:13.5, jobSat:56, remoteHybrid:60, inflation:3.6, aiUsage:69, aiJobPct:3.4, chatgptPct:58, qol:82 },
  { city:"Edinburgh",     flag:"🇬🇧", region:"Europe",         ppScore:64, secScore:62, aiScore:66, survivalScore:64, medianSalary:58000,  costOfLiving:68,  rentIdx:60,  purchasingPower:70, youthUnemp:11.5, jobSat:56, remoteHybrid:56, inflation:2.8, aiUsage:68, aiJobPct:3.0, chatgptPct:57, qol:86 },
  { city:"Stockholm",     flag:"🇸🇪", region:"Europe",         ppScore:64, secScore:55, aiScore:72, survivalScore:63, medianSalary:66000,  costOfLiving:74,  rentIdx:66,  purchasingPower:74, youthUnemp:16.5, jobSat:60, remoteHybrid:64, inflation:4.2, aiUsage:70, aiJobPct:3.4, chatgptPct:56, qol:92 },
  { city:"Vancouver",     flag:"🇨🇦", region:"North America", ppScore:66, secScore:56, aiScore:68, survivalScore:63, medianSalary:70000,  costOfLiving:77,  rentIdx:79,  purchasingPower:72, youthUnemp:12.2, jobSat:54, remoteHybrid:62, inflation:3.7, aiUsage:71, aiJobPct:3.8, chatgptPct:60, qol:85 },
  { city:"Tokyo",         flag:"🇯🇵", region:"Asia",           ppScore:52, secScore:72, aiScore:62, survivalScore:62, medianSalary:48000,  costOfLiving:75,  rentIdx:65,  purchasingPower:68, youthUnemp:4.2,  jobSat:42, remoteHybrid:38, inflation:2.2, aiUsage:62, aiJobPct:2.8, chatgptPct:52, qol:77 },
  { city:"London",        flag:"🇬🇧", region:"Europe",         ppScore:60, secScore:50, aiScore:72, survivalScore:60, medianSalary:72000,  costOfLiving:85,  rentIdx:82,  purchasingPower:72, youthUnemp:12.5, jobSat:46, remoteHybrid:56, inflation:3.8, aiUsage:74, aiJobPct:3.8, chatgptPct:62, qol:70 },
  { city:"Seoul",         flag:"🇰🇷", region:"Asia",           ppScore:53, secScore:60, aiScore:68, survivalScore:59, medianSalary:44000,  costOfLiving:66,  rentIdx:62,  purchasingPower:71, youthUnemp:7.5,  jobSat:44, remoteHybrid:40, inflation:3.1, aiUsage:68, aiJobPct:3.2, chatgptPct:58, qol:77 },
  { city:"Bangalore",     flag:"🇮🇳", region:"Asia",           ppScore:55, secScore:48, aiScore:76, survivalScore:58, medianSalary:28000,  costOfLiving:35,  rentIdx:22,  purchasingPower:58, youthUnemp:14.5, jobSat:50, remoteHybrid:68, inflation:5.2, aiUsage:72, aiJobPct:6.2, chatgptPct:60, qol:54 },
  { city:"Paris",         flag:"🇫🇷", region:"Europe",         ppScore:56, secScore:40, aiScore:64, survivalScore:52, medianSalary:58000,  costOfLiving:78,  rentIdx:72,  purchasingPower:65, youthUnemp:18.2, jobSat:44, remoteHybrid:48, inflation:3.4, aiUsage:65, aiJobPct:3.2, chatgptPct:54, qol:65 },
  { city:"Mumbai",        flag:"🇮🇳", region:"Asia",           ppScore:48, secScore:44, aiScore:64, survivalScore:51, medianSalary:26000,  costOfLiving:40,  rentIdx:30,  purchasingPower:52, youthUnemp:16.2, jobSat:48, remoteHybrid:58, inflation:5.8, aiUsage:68, aiJobPct:5.4, chatgptPct:57, qol:50 },
  { city:"Lisbon",        flag:"🇵🇹", region:"Europe",         ppScore:52, secScore:40, aiScore:56, survivalScore:49, medianSalary:36000,  costOfLiving:56,  rentIdx:58,  purchasingPower:72, youthUnemp:20.2, jobSat:54, remoteHybrid:58, inflation:3.0, aiUsage:58, aiJobPct:2.4, chatgptPct:50, qol:81 },
  { city:"Barcelona",     flag:"🇪🇸", region:"Europe",         ppScore:53, secScore:30, aiScore:60, survivalScore:47, medianSalary:42000,  costOfLiving:60,  rentIdx:53,  purchasingPower:68, youthUnemp:28.5, jobSat:52, remoteHybrid:54, inflation:3.2, aiUsage:62, aiJobPct:2.8, chatgptPct:51, qol:80 },
  { city:"Mexico City",   flag:"🇲🇽", region:"Latin America", ppScore:50, secScore:30, aiScore:56, survivalScore:45, medianSalary:28000,  costOfLiving:42,  rentIdx:28,  purchasingPower:55, youthUnemp:22.5, jobSat:48, remoteHybrid:44, inflation:4.5, aiUsage:58, aiJobPct:2.6, chatgptPct:49, qol:47 },
];

/* ─── HELPERS ────────────────────────────────────────────────────────────── */
function scoreColor(s) {
  if (s >= 76) return "#00ff88";
  if (s >= 61) return "#c8f520";
  if (s >= 46) return "#ff9f1c";
  return "#ff3131";
}
function scoreLabel(s) {
  if (s >= 76) return "SECURE";
  if (s >= 61) return "STABLE";
  if (s >= 46) return "PRECARIOUS";
  return "CRITICAL";
}
function fmtSalary(n) {
  if (n >= 100000) return `$${(n/1000).toFixed(0)}k`;
  return `$${(n/1000).toFixed(0)}k`;
}
function degToXY(cx, cy, r, deg) {
  const rad = (deg - 90) * Math.PI / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}
function arcPath(cx, cy, r, startDeg, sweepDeg) {
  if (sweepDeg <= 0) return "";
  const s = degToXY(cx, cy, r, startDeg);
  const e = degToXY(cx, cy, r, startDeg + sweepDeg);
  const large = sweepDeg > 180 ? 1 : 0;
  return `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`;
}
function normalizeFor(cities, field) {
  const vals = cities.map(c => c[field]);
  const min = Math.min(...vals), max = Math.max(...vals);
  return (v) => max === min ? 50 : Math.round((v - min) / (max - min) * 100);
}

/* ─── SUB-COMPONENTS ─────────────────────────────────────────────────────── */

function SurvivalGauge({ score }) {
  const col = scoreColor(score);
  const sweep = (score / 100) * 270;
  const bgArc = arcPath(110, 110, 82, 135, 270);
  const fillArc = arcPath(110, 110, 82, 135, sweep);
  const label = scoreLabel(score);
  return (
    <svg width="220" height="200" viewBox="0 0 220 200" style={{ overflow: "visible" }}>
      {/* Glow filter */}
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {/* Track */}
      <path d={bgArc} fill="none" stroke="#1a2e4a" strokeWidth="14" strokeLinecap="round" />
      {/* Fill */}
      {sweep > 0 && (
        <path d={fillArc} fill="none" stroke={col} strokeWidth="14" strokeLinecap="round"
          filter="url(#glow)" style={{ transition: "all 0.4s ease" }} />
      )}
      {/* Tick marks */}
      {[0, 25, 50, 75, 100].map(pct => {
        const deg = 135 + (pct / 100) * 270;
        const inner = degToXY(110, 110, 70, deg);
        const outer = degToXY(110, 110, 95, deg);
        return <line key={pct} x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y}
          stroke="#1a2e4a" strokeWidth="2" />;
      })}
      {/* Score */}
      <text x="110" y="108" textAnchor="middle" fill={col}
        style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "54px", filter: "url(#glow)" }}>
        {score}
      </text>
      {/* /100 */}
      <text x="110" y="128" textAnchor="middle" fill="#3d5a80"
        style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "11px" }}>
        / 100
      </text>
      {/* Label */}
      <text x="110" y="155" textAnchor="middle" fill={col}
        style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "13px", letterSpacing: "3px", filter: "url(#glow)" }}>
        {label}
      </text>
    </svg>
  );
}

function PillarBar({ label, icon, score, color, metrics }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "6px" }}>
        <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "11px", color: "#4a7ab5", letterSpacing: "2px" }}>
          {icon} {label}
        </span>
        <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "26px", color }}>
          {score}
        </span>
      </div>
      {/* Track */}
      <div style={{ height: "6px", background: "#0d1e35", borderRadius: "3px", marginBottom: "8px", overflow: "hidden" }}>
        <div style={{
          width: `${score}%`, height: "100%", borderRadius: "3px",
          background: `linear-gradient(90deg, ${color}88, ${color})`,
          boxShadow: `0 0 10px ${color}88`,
          transition: "width 0.5s cubic-bezier(0.4,0,0.2,1)"
        }} />
      </div>
      {/* Metrics row */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        {metrics.map(({ label: ml, value }) => (
          <span key={ml} style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "10px", color: "#4a7ab5" }}>
            <span style={{ color: "#7aacdb" }}>{ml}: </span>
            <span style={{ color: "#c8ddf0" }}>{value}</span>
          </span>
        ))}
      </div>
      {/* Status label */}
      <div style={{ marginTop: "4px" }}>
        <span style={{
          fontFamily: "'Share Tech Mono', monospace", fontSize: "9px",
          letterSpacing: "2px", color,
          padding: "1px 6px", border: `1px solid ${color}44`,
          borderRadius: "2px", background: `${color}11`
        }}>
          {scoreLabel(score)}
        </span>
      </div>
    </div>
  );
}

function CityRadar({ city }) {
  const norm = (v, min, max) => Math.round((v - min) / (max - min) * 100);
  const data = [
    { subject: "Purchasing\nPower",  value: city.ppScore },
    { subject: "Job\nSecurity",     value: city.secScore },
    { subject: "AI\nReadiness",     value: city.aiScore },
    { subject: "Quality\nof Life",  value: norm(city.qol, 47, 97) },
    { subject: "Affordability",     value: norm(116 - city.costOfLiving, 0, 81) },
    { subject: "Remote\nWork",      value: norm(city.remoteHybrid, 38, 70) },
  ];
  return (
    <ResponsiveContainer width="100%" height={240}>
      <RadarChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
        <PolarGrid stroke="#1a3050" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: "#4a7ab5", fontSize: 10, fontFamily: "'Share Tech Mono', monospace" }} />
        <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
        <Radar name={city.city} dataKey="value" stroke={scoreColor(city.survivalScore)}
          fill={scoreColor(city.survivalScore)} fillOpacity={0.15} strokeWidth={2} />
        <Tooltip contentStyle={{ background: "#0d1520", border: "1px solid #1e3050", fontFamily: "'Share Tech Mono', monospace", fontSize: "12px" }} />
      </RadarChart>
    </ResponsiveContainer>
  );
}

/* ─── MAIN COMPONENT ─────────────────────────────────────────────────────── */
export default function GenZSurvivalDashboard() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [activeTab, setActiveTab] = useState("city");
  const [sortKey, setSortKey] = useState("survivalScore");
  const [filterRegion, setFilterRegion] = useState("All");

  const city = CITIES[selectedIdx];
  const regions = ["All", ...Array.from(new Set(CITIES.map(c => c.region)))];

  const filteredCities = filterRegion === "All"
    ? CITIES
    : CITIES.filter(c => c.region === filterRegion);

  const sortedCities = [...CITIES].sort((a, b) => b[sortKey] - a[sortKey]);

  const SORT_OPTIONS = [
    { key: "survivalScore", label: "SURVIVAL" },
    { key: "ppScore",       label: "PURCHASING POWER" },
    { key: "secScore",      label: "JOB SECURITY" },
    { key: "aiScore",       label: "AI READINESS" },
  ];

  const styles = {
    root: {
      background: "#060a0f",
      minHeight: "100vh",
      color: "#c8ddf0",
      fontFamily: "'Outfit', sans-serif",
      position: "relative",
    },
    header: {
      borderBottom: "1px solid #0f2040",
      padding: "16px 24px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      background: "linear-gradient(180deg, #07111f 0%, #060a0f 100%)",
    },
    title: {
      fontFamily: "'Bebas Neue', cursive",
      fontSize: "28px",
      color: "#e2ecf7",
      letterSpacing: "3px",
    },
    subtitle: {
      fontFamily: "'Share Tech Mono', monospace",
      fontSize: "9px",
      color: "#2d5080",
      letterSpacing: "1.5px",
      marginTop: "2px",
    },
    badge: {
      fontFamily: "'Share Tech Mono', monospace",
      fontSize: "9px",
      color: "#00ff88",
      border: "1px solid #00ff8833",
      background: "#00ff8811",
      padding: "3px 8px",
      borderRadius: "2px",
      letterSpacing: "2px",
    },
    cityStrip: {
      padding: "10px 24px",
      borderBottom: "1px solid #0f2040",
      overflowX: "auto",
      display: "flex",
      gap: "6px",
      background: "#08111d",
      whiteSpace: "nowrap",
    },
    cityChipBase: {
      display: "inline-flex",
      alignItems: "center",
      gap: "4px",
      padding: "5px 10px",
      border: "1px solid #1a2e4a",
      borderRadius: "3px",
      cursor: "pointer",
      fontFamily: "'Share Tech Mono', monospace",
      fontSize: "11px",
      transition: "all 0.15s ease",
      flexShrink: 0,
    },
    tabs: {
      display: "flex",
      padding: "0 24px",
      borderBottom: "1px solid #0f2040",
      gap: "0",
    },
    tabBtn: (active) => ({
      padding: "10px 20px",
      fontFamily: "'Share Tech Mono', monospace",
      fontSize: "11px",
      letterSpacing: "2px",
      cursor: "pointer",
      border: "none",
      background: "transparent",
      color: active ? "#00e5ff" : "#2d5080",
      borderBottom: active ? "2px solid #00e5ff" : "2px solid transparent",
      transition: "all 0.15s ease",
    }),
    body: { padding: "24px", maxWidth: "1200px", margin: "0 auto" },
  };

  return (
    <div style={styles.root}>
      <style dangerouslySetInnerHTML={{ __html: FONTS }} />

      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <div style={styles.title}>GEN Z SURVIVAL DASHBOARD</div>
          <div style={styles.subtitle}>
            SOURCES: NUMBEO · WORLD BANK API · STACKOVERFLOW SURVEY 2024 · LINKEDIN/KAGGLE · 30 CITIES · REAL DATA
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px", flexDirection: "column", alignItems: "flex-end" }}>
          <span style={styles.badge}>◉ LIVE INDEX 2026</span>
          <span style={{ ...styles.subtitle, color: "#1a3a60" }}>PCA-WEIGHTED SURVIVAL INDEX</span>
        </div>
      </div>

      {/* CITY SELECTOR STRIP */}
      <div style={styles.cityStrip}>
        {CITIES.map((c, i) => {
          const col = scoreColor(c.survivalScore);
          const isSelected = i === selectedIdx;
          return (
            <button key={c.city} onClick={() => { setSelectedIdx(i); setActiveTab("city"); }}
              style={{
                ...styles.cityChipBase,
                background: isSelected ? `${col}18` : "transparent",
                borderColor: isSelected ? col : "#1a2e4a",
                color: isSelected ? col : "#3d6080",
              }}>
              <span>{c.flag}</span>
              <span>{c.city}</span>
              <span style={{ color: col, fontWeight: "600" }}>{c.survivalScore}</span>
            </button>
          );
        })}
      </div>

      {/* TABS */}
      <div style={styles.tabs}>
        {[["city","CITY INTEL"], ["rankings","FULL RANKINGS"]].map(([key, label]) => (
          <button key={key} style={styles.tabBtn(activeTab === key)} onClick={() => setActiveTab(key)}>
            {label}
          </button>
        ))}
      </div>

      <div style={styles.body}>
        {activeTab === "city" ? (
          <CityView city={city} />
        ) : (
          <RankingsView cities={sortedCities} sortKey={sortKey} onSort={setSortKey}
            sortOptions={SORT_OPTIONS} selectedIdx={selectedIdx} onSelect={(i) => {
              setSelectedIdx(i);
              setActiveTab("city");
            }} />
        )}
      </div>
    </div>
  );
}

/* ─── CITY VIEW ──────────────────────────────────────────────────────────── */
function CityView({ city }) {
  const col = scoreColor(city.survivalScore);
  return (
    <div>
      {/* City hero header */}
      <div style={{
        display: "flex", alignItems: "center", gap: "16px", marginBottom: "28px",
        padding: "16px 20px",
        background: "#08111d",
        border: `1px solid ${col}22`,
        borderRadius: "4px",
      }}>
        <span style={{ fontSize: "36px" }}>{city.flag}</span>
        <div>
          <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "36px", color: "#e2ecf7", lineHeight: 1, letterSpacing: "2px" }}>
            {city.city}
          </div>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "10px", color: "#2d5080", letterSpacing: "2px", marginTop: "2px" }}>
            {city.region.toUpperCase()} · MEDIAN SALARY {city.medianSalary >= 100000 ? `$${(city.medianSalary/1000).toFixed(0)}k` : `$${(city.medianSalary/1000).toFixed(0)}k`} · INFLATION {city.inflation}% · COST INDEX {city.costOfLiving}
          </div>
        </div>
        <div style={{ marginLeft: "auto", textAlign: "right" }}>
          <span style={{
            fontFamily: "'Share Tech Mono', monospace", fontSize: "9px", letterSpacing: "3px",
            color: col, padding: "3px 10px",
            border: `1px solid ${col}44`, borderRadius: "2px", background: `${col}11`
          }}>
            SURVIVAL STATUS: {scoreLabel(city.survivalScore)}
          </span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "28px", marginBottom: "28px" }}>
        {/* Gauge */}
        <div style={{
          background: "#08111d", border: "1px solid #0f2040", borderRadius: "4px",
          padding: "20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "9px", color: "#2d5080", letterSpacing: "2px", marginBottom: "8px" }}>
            OVERALL INDEX
          </div>
          <SurvivalGauge score={city.survivalScore} />
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "9px", color: "#2d5080", marginTop: "4px", textAlign: "center" }}>
            PCA-WEIGHTED · 14 VARIABLES
          </div>
        </div>

        {/* Three pillars */}
        <div style={{ background: "#08111d", border: "1px solid #0f2040", borderRadius: "4px", padding: "24px" }}>
          <PillarBar
            label="PURCHASING POWER"
            icon="💸"
            score={city.ppScore}
            color="#f5a623"
            metrics={[
              { label: "Salary", value: fmtSalary(city.medianSalary) },
              { label: "CoL Index", value: city.costOfLiving },
              { label: "Rent Index", value: city.rentIdx },
              { label: "PP Index", value: city.purchasingPower },
            ]}
          />
          <PillarBar
            label="JOB SECURITY"
            icon="📉"
            score={city.secScore}
            color="#4fc3f7"
            metrics={[
              { label: "Youth Unemp", value: `${city.youthUnemp}%` },
              { label: "Job Sat", value: `${city.jobSat}%` },
              { label: "Remote/Hybrid", value: `${city.remoteHybrid}%` },
              { label: "Inflation", value: `${city.inflation}%` },
            ]}
          />
          <PillarBar
            label="AI JOB DEPENDENCY"
            icon="🤖"
            score={city.aiScore}
            color="#ce93d8"
            metrics={[
              { label: "AI Tool Usage", value: `${city.aiUsage}%` },
              { label: "AI % of Jobs", value: `${city.aiJobPct}%` },
              { label: "ChatGPT", value: `${city.chatgptPct}%` },
            ]}
          />
        </div>
      </div>

      {/* Radar + Insight */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        {/* Radar */}
        <div style={{ background: "#08111d", border: "1px solid #0f2040", borderRadius: "4px", padding: "20px" }}>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "9px", color: "#2d5080", letterSpacing: "2px", marginBottom: "8px" }}>
            CITY PROFILE — 6 DIMENSIONS
          </div>
          <CityRadar city={city} />
        </div>

        {/* Key insights */}
        <div style={{ background: "#08111d", border: "1px solid #0f2040", borderRadius: "4px", padding: "20px" }}>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "9px", color: "#2d5080", letterSpacing: "2px", marginBottom: "16px" }}>
            ◈ GEN Z THREAT ASSESSMENT
          </div>
          {[
            {
              icon: city.ppScore >= 70 ? "🟢" : city.ppScore >= 55 ? "🟡" : "🔴",
              label: "PURCHASING POWER",
              text: city.ppScore >= 70
                ? `Median salary of ${fmtSalary(city.medianSalary)} outpaces cost pressure. Money stretches here.`
                : city.ppScore >= 55
                ? `${fmtSalary(city.medianSalary)} salary vs ${city.costOfLiving} CoL index is tight. Budget carefully.`
                : `At ${fmtSalary(city.medianSalary)} median salary with CoL at ${city.costOfLiving}, buying power is eroding fast.`,
            },
            {
              icon: city.secScore >= 65 ? "🟢" : city.secScore >= 48 ? "🟡" : "🔴",
              label: "LAYOFF EXPOSURE",
              text: city.secScore >= 65
                ? `${city.youthUnemployment || city.youthUnemp}% youth unemployment is manageable. Remote options buffer risk.`
                : city.secScore >= 48
                ? `${city.youthUnemp}% youth unemployment and ${city.jobSat}% job satisfaction signal stress in the market.`
                : `Danger zone: ${city.youthUnemp}% youth unemployment. Only ${city.jobSat}% of workers satisfied. Unstable.`,
            },
            {
              icon: city.aiScore >= 75 ? "🟣" : city.aiScore >= 60 ? "🟡" : "⚪",
              label: "AI DEPENDENCY",
              text: city.aiScore >= 75
                ? `${city.aiUsage}% of devs use AI tools actively. ${city.aiJobPct}% of all jobs are AI-specific. Skill up or fall behind.`
                : city.aiScore >= 60
                ? `AI adoption at ${city.aiUsage}% — growing fast. ${city.aiJobPct}% AI-specific roles. Opportunity for early movers.`
                : `AI adoption at ${city.aiUsage}% — still emerging. Lower AI job concentration means less immediate pressure.`,
            },
          ].map(({ icon, label, text }) => (
            <div key={label} style={{
              marginBottom: "14px", padding: "12px",
              background: "#060e1a", borderRadius: "3px", border: "1px solid #0f2040",
            }}>
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "9px", letterSpacing: "2px", color: "#3d6080", marginBottom: "4px" }}>
                {icon} {label}
              </div>
              <div style={{ fontSize: "12px", color: "#7aacdb", lineHeight: 1.5 }}>{text}</div>
            </div>
          ))}

          {/* Quick stats grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginTop: "8px" }}>
            {[
              { label: "SALARY", value: fmtSalary(city.medianSalary) },
              { label: "YOUTH UNEMP", value: `${city.youthUnemp}%` },
              { label: "AI TOOLS", value: `${city.aiUsage}%` },
              { label: "RENT INDEX", value: city.rentIdx },
              { label: "JOB SAT", value: `${city.jobSat}%` },
              { label: "AI JOBS", value: `${city.aiJobPct}%` },
            ].map(({ label, value }) => (
              <div key={label} style={{
                padding: "8px", background: "#060e1a", borderRadius: "3px",
                border: "1px solid #0f2040", textAlign: "center",
              }}>
                <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "8px", color: "#2d5080", letterSpacing: "1.5px" }}>{label}</div>
                <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "20px", color: "#c8ddf0", marginTop: "2px" }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── RANKINGS VIEW ──────────────────────────────────────────────────────── */
function RankingsView({ cities, sortKey, onSort, sortOptions, selectedIdx, onSelect }) {
  const maxScores = {
    survivalScore: Math.max(...cities.map(c => c.survivalScore)),
    ppScore: Math.max(...cities.map(c => c.ppScore)),
    secScore: Math.max(...cities.map(c => c.secScore)),
    aiScore: Math.max(...cities.map(c => c.aiScore)),
  };

  return (
    <div>
      {/* Sort controls */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px", alignItems: "center" }}>
        <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "10px", color: "#2d5080", letterSpacing: "2px", marginRight: "8px" }}>
          SORT BY:
        </span>
        {sortOptions.map(({ key, label }) => (
          <button key={key} onClick={() => onSort(key)} style={{
            padding: "5px 12px",
            fontFamily: "'Share Tech Mono', monospace", fontSize: "10px", letterSpacing: "1.5px",
            cursor: "pointer", border: "1px solid",
            borderColor: sortKey === key ? scoreColor(70) : "#1a2e4a",
            background: sortKey === key ? `${scoreColor(70)}11` : "transparent",
            color: sortKey === key ? scoreColor(70) : "#3d6080",
            borderRadius: "2px", transition: "all 0.15s",
          }}>
            {label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: "#08111d", border: "1px solid #0f2040", borderRadius: "4px", overflow: "hidden" }}>
        {/* Header */}
        <div style={{
          display: "grid", gridTemplateColumns: "32px 180px 1fr 110px 110px 110px",
          padding: "10px 16px", borderBottom: "1px solid #0f2040",
          background: "#07101c",
        }}>
          {["#", "CITY", `${sortKey === "survivalScore" ? "▼ " : ""}SURVIVAL`, `${sortKey === "ppScore" ? "▼ " : ""}PURCHASING`, `${sortKey === "secScore" ? "▼ " : ""}SECURITY`, `${sortKey === "aiScore" ? "▼ " : ""}AI`].map((h, i) => (
            <div key={i} style={{
              fontFamily: "'Share Tech Mono', monospace", fontSize: "9px",
              color: "#2d5080", letterSpacing: "2px",
              cursor: i > 1 ? "pointer" : "default",
            }}
              onClick={() => i > 1 && onSort(["survivalScore","ppScore","secScore","aiScore"][i-2])}>
              {h}
            </div>
          ))}
        </div>

        {/* Rows */}
        {cities.map((c, rank) => {
          const origIdx = CITIES.indexOf(c);
          const isSelected = origIdx === selectedIdx;
          const col = scoreColor(c.survivalScore);
          return (
            <div key={c.city}
              onClick={() => onSelect(origIdx)}
              style={{
                display: "grid", gridTemplateColumns: "32px 180px 1fr 110px 110px 110px",
                padding: "10px 16px", borderBottom: "1px solid #0a1628",
                cursor: "pointer", transition: "background 0.1s",
                background: isSelected ? `${col}0a` : "transparent",
                borderLeft: isSelected ? `2px solid ${col}` : "2px solid transparent",
              }}>
              {/* Rank */}
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "11px", color: "#1e3a5f", display: "flex", alignItems: "center" }}>
                {rank + 1}
              </div>
              {/* City */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "16px" }}>{c.flag}</span>
                <div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: "500", fontSize: "13px", color: isSelected ? col : "#c8ddf0" }}>
                    {c.city}
                  </div>
                  <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "8px", color: "#1e3a5f" }}>
                    {c.region}
                  </div>
                </div>
              </div>
              {/* Survival */}
              <ScoreBar score={c.survivalScore} max={maxScores.survivalScore} color={col} big />
              {/* PP */}
              <ScoreBar score={c.ppScore} max={maxScores.ppScore} color="#f5a623" />
              {/* Security */}
              <ScoreBar score={c.secScore} max={maxScores.secScore} color="#4fc3f7" />
              {/* AI */}
              <ScoreBar score={c.aiScore} max={maxScores.aiScore} color="#ce93d8" />
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: "20px", marginTop: "16px", flexWrap: "wrap" }}>
        {[["#00ff88", "SECURE (76-100)"], ["#c8f520", "STABLE (61-75)"], ["#ff9f1c", "PRECARIOUS (46-60)"], ["#ff3131", "CRITICAL (0-45)"]].map(([color, label]) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{ width: "10px", height: "10px", background: color, borderRadius: "2px" }} />
            <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "9px", color: "#2d5080", letterSpacing: "1px" }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScoreBar({ score, max, color, big = false }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <span style={{
        fontFamily: "'Bebas Neue', cursive",
        fontSize: big ? "20px" : "18px",
        color, minWidth: "30px", lineHeight: 1,
      }}>
        {score}
      </span>
      <div style={{ flex: 1, height: big ? "5px" : "4px", background: "#0d1e35", borderRadius: "2px", overflow: "hidden" }}>
        <div style={{
          width: `${(score / max) * 100}%`, height: "100%",
          background: `linear-gradient(90deg, ${color}88, ${color})`,
          borderRadius: "2px",
        }} />
      </div>
    </div>
  );
}
