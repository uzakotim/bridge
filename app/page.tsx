"use client"
import Link from "next/link";
import SignInButton from "@/app/components/SignInButton";
import LogOutButton from "@/app/components/LogOutButton";
import { useAuth } from "@/app/components/AuthProvider";
import {
  BriefcaseBusiness,
  Sparkles,
  Target,
  BookOpen,
  LayoutDashboard,
  ArrowRight,
  TrendingUp,
  Zap,
  LoaderCircle,
  Loader,
} from "lucide-react";


const tools = [
  {
    id: "job-analyzer",
    href: "/job-analyzer",
    icon: BriefcaseBusiness,
    label: "Job Analyzer",
    badge: "Live",
    badgeVariant: "live" as const,
    description:
      "Paste any job description and get an instant AI skill extraction, gap analysis, and readiness score.",
    accent: "#247a70",
    accentBg: "rgba(36,122,112,0.12)",
    iconBg: "rgba(36,122,112,0.15)",
  },
  {
    id: "skill-gap",
    href: "#",
    icon: Target,
    label: "Skill Gap Report",
    badge: "Phase 2",
    badgeVariant: "coming" as const,
    description:
      "Compare your current skills against market demand and get a prioritised learning roadmap.",
    accent: "#385f8f",
    accentBg: "rgba(56,95,143,0.10)",
    iconBg: "rgba(56,95,143,0.15)",
  },
  {
    id: "project-gen",
    href: "#",
    icon: BookOpen,
    label: "Project Generator",
    badge: "Phase 2",
    badgeVariant: "coming" as const,
    description:
      "Generate hands-on project ideas tailored to your skill gaps with curated learning resources.",
    accent: "#7c5c9e",
    accentBg: "rgba(124,92,158,0.10)",
    iconBg: "rgba(124,92,158,0.15)",
  },
  {
    id: "job-match",
    href: "#",
    icon: TrendingUp,
    label: "Job Matching",
    badge: "Phase 3",
    badgeVariant: "future" as const,
    description:
      "Find roles where your skills match ≥70% with AI-recommended next steps for the gaps.",
    accent: "#a66237",
    accentBg: "rgba(166,98,55,0.10)",
    iconBg: "rgba(166,98,55,0.15)",
  },
];

const stats = [
  { value: "1", label: "Active tool" },
  { value: "Phase 1", label: "Current stage" },
  { value: "AI", label: "Powered by Gemini" },
];

export default function DashboardPage() {
  // check if user is signed in
  const { user, loading } = useAuth();
  return (
    <main className="dashboard-root">
      {/* Background grid */}
      <div className="dashboard-grid-bg" aria-hidden="true" />

      <div className="dashboard-container">
        {/* ── Header ── */}
        <header className="dashboard-header">
          <div className="dashboard-logo">
            <Zap className="dashboard-logo-icon" />
            <span className="dashboard-logo-text">Bridge</span>
          </div>



          <nav className="dashboard-nav" aria-label="Main navigation">
            {/* Login button */}
            {loading ? <div className="dashboard-nav-link flex items-center gap-2"><Loader className="animate-spin" size={20} strokeWidth={1} />Loading...</div> : <>{user ? <LogOutButton /> : <SignInButton />}</>}
            <a href="#tools" className="dashboard-nav-link">Tools</a>
            <a href="#" className="dashboard-nav-link">Profile</a>
            <div className="dashboard-nav-badge">
              <Sparkles size={12} />
              Phase 1
            </div>
          </nav>
        </header>

        {/* ── Hero ── */}
        <section className="dashboard-hero" aria-labelledby="hero-heading">
          <div className="dashboard-hero-eyebrow">
            <LayoutDashboard size={14} />
            Career Dashboard
          </div>
          <h1 id="hero-heading" className="dashboard-hero-title">
            Your AI career<br />
            <span className="dashboard-hero-accent">co-pilot</span>
          </h1>
          <p className="dashboard-hero-subtitle">
            Analyse job descriptions, close skill gaps, and land roles that match your strengths — all in one place.
          </p>

          {/* Stats */}
          <div className="dashboard-stats" role="list">
            {stats.map((s) => (
              <div key={s.label} className="dashboard-stat" role="listitem">
                <span className="dashboard-stat-value">{s.value}</span>
                <span className="dashboard-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Tools grid ── */}
        <section id="tools" className="dashboard-tools-section" aria-labelledby="tools-heading">
          <h2 id="tools-heading" className="dashboard-section-title">Tools</h2>

          <div className="dashboard-tools-grid">
            {tools.map((tool) => {
              const Icon = tool.icon;
              const isLive = tool.badgeVariant === "live";
              const CardWrapper = isLive ? Link : "div";
              const wrapperProps = isLive
                ? { href: tool.href }
                : { "aria-disabled": true };

              return (
                // @ts-ignore – polymorphic wrapper
                <CardWrapper
                  key={tool.id}
                  id={`tool-${tool.id}`}
                  className={`dashboard-tool-card ${isLive ? "dashboard-tool-card--live" : "dashboard-tool-card--coming"}`}
                  style={{ "--tool-accent": tool.accent, "--tool-accent-bg": tool.accentBg, "--tool-icon-bg": tool.iconBg } as React.CSSProperties}
                  {...wrapperProps}
                >
                  <div className="dashboard-tool-top">
                    <div className="dashboard-tool-icon">
                      <Icon size={20} />
                    </div>
                    <span className={`dashboard-tool-badge dashboard-tool-badge--${tool.badgeVariant}`}>
                      {tool.badge}
                    </span>
                  </div>

                  <h3 className="dashboard-tool-title">{tool.label}</h3>
                  <p className="dashboard-tool-desc">{tool.description}</p>

                  {isLive && (
                    <div className="dashboard-tool-cta">
                      Open <ArrowRight size={14} />
                    </div>
                  )}
                </CardWrapper>
              );
            })}
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="dashboard-footer">
          <span>Bridge Career Agent</span>
          <span className="dashboard-footer-sep">·</span>
          <span>Phase 1 Prototype</span>
        </footer>
      </div>
    </main>
  );
}
