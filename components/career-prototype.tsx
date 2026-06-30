"use client";

import { useAuth } from "@/app/components/AuthProvider";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CircleCheck,
  ClipboardList,
  LockKeyhole,
  MapPin,
  Sparkles,
  UserRound,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { FormEvent, useMemo, useState, useEffect } from "react";

import {
  groupByCategory,
  ownsSkill,
  priorityLabel,
  splitSkills,
  type ExtractedSkill,
} from "@/lib/career-analysis";
import { cn } from "@/lib/utils";

type Profile = {
  name: string;
  email: string;
  skills: string;
  yearsExperience: string;
  targetJob: string;
  location: string;
  workType: string;
};

const starterProfile: Profile = {
  name: "Amina Karimova",
  email: "amina@example.com",
  skills: "Python, SQL, Git, communication",
  yearsExperience: "1",
  targetJob: "Junior Backend Developer",
  location: "Tashkent, Uzbekistan",
  workType: "Hybrid",
};

const starterJobDescription =
  "We are hiring a Junior Backend Developer to build REST APIs with Python and PostgreSQL. The role requires Git, Docker basics, testing, cloud deployment experience, teamwork, and clear communication. AWS experience is a plus.";

export function CareerPrototype() {
  const [profile, setProfile] = useState<Profile>(starterProfile);
  const { user } = useAuth();
  const [jobDescription, setJobDescription] = useState(starterJobDescription);
  const [extractedSkills, setExtractedSkills] = useState<ExtractedSkill[]>([]);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractError, setExtractError] = useState("");
  const [extractionSource, setExtractionSource] = useState<"gemini" | "local" | null>(null);
  const [extractNotice, setExtractNotice] = useState("");

  const userSkills = useMemo(() => splitSkills(profile.skills), [profile.skills]);
  const strongSkills = extractedSkills.filter((skill) => ownsSkill(skill, userSkills));
  const missingSkills = extractedSkills.filter((skill) => !ownsSkill(skill, userSkills));
  const readinessScore = extractedSkills.length
    ? Math.round((strongSkills.length / extractedSkills.length) * 100)
    : 0;

  function updateProfile(field: keyof Profile, value: string) {
    setProfile((current) => ({ ...current, [field]: value }));
  }

  // Handle Google Sign‑In response
  const handleGoogleResponse = async (response: any) => {
    try {
      const token = response?.credential;
      if (!token) throw new Error("No credential returned from Google");
      const res = await fetch("/api/verify-google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      let data: any;
      try {
        data = await res.json();
      } catch {
        const text = await res.text();
        throw new Error(text || "Invalid response from server");
      }
      if (!res.ok) throw new Error(data?.error || "Verification failed");
      setProfile((prev) => ({
        ...prev,
        name: data.name ?? prev.name,
        email: data.email ?? prev.email,
      }));
    } catch (err) {
      console.error("Google sign‑in error:", err);
    }
  };

  // Load Google Identity Services script once
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      // @ts-ignore
      if (window.google?.accounts?.id) {
        // @ts-ignore
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
          callback: handleGoogleResponse,
        });
        // @ts-ignore
        window.google.accounts.id.renderButton(
          document.getElementById("google-signin-button") as HTMLElement,
          { type: "standard", theme: "filled_black", size: "large" }
        );
      }
    };
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  async function handleAnalyze(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsExtracting(true);
    setExtractError("");
    setExtractNotice("");

    try {
      const response = await fetch("/api/extract-skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription }),
      });
      const result = (await response.json()) as {
        skills?: ExtractedSkill[];
        source?: "gemini" | "local";
        notice?: string;
        error?: string;
      };
      if (!response.ok) throw new Error(result.error ?? "Skill extraction failed.");
      setExtractedSkills(result.skills ?? []);
      setExtractionSource(result.source ?? null);
      setExtractNotice(result.notice ?? "");
      setHasAnalyzed(true);
    } catch (error) {
      setExtractError(error instanceof Error ? error.message : "Skill extraction failed.");
      setHasAnalyzed(false);
    } finally {
      setIsExtracting(false);
    }
  }

  return (
    <main className="ja-root">
      {/* Shared background grid */}
      <div className="dashboard-grid-bg" aria-hidden="true" />

      <div className="ja-container">
        {/* ── Header ── */}
        <header className="ja-header">
          <div className="ja-header-left">
            <Link href="/" className="ja-back-link">
              <ArrowLeft size={14} />
              Dashboard
            </Link>
            <div className="ja-logo">
              <Zap className="dashboard-logo-icon" />
              <span className="dashboard-logo-text">Bridge</span>
            </div>
          </div>

          <div className={cn("ja-session-badge", user && "ja-session-badge--active")}>
            <CircleCheck size={13} />
            {user ? `${user.name} signed in` : "Session pending"}
          </div>
        </header>

        {/* ── Page title ── */}
        <div className="ja-page-title-row">
          <div className="ja-page-eyebrow">
            <BriefcaseBusiness size={13} />
            Job Analyzer
          </div>
          <h1 className="ja-page-title">Career skill report</h1>
          <p className="ja-page-subtitle">
            Paste a job description to extract required skills and see where you stand.
          </p>
        </div>

        {/* ── Sign-in gate ── */}
        {!user ? (
          <div className="ja-signin-card">
            <div className="ja-card-icon-wrap" style={{ background: "rgba(36, 122, 112, 0.15)", color: "#247a70" }}>
              <LockKeyhole size={18} />
            </div>
            <div>
              <h2 className="ja-card-title">Sign in with Google</h2>
              <p className="ja-card-subtitle">Use your Google account to start the prototype session.</p>
            </div>
            <div id="google-signin-button" className="ja-google-btn" />
          </div>
        ) : (
          <div className="ja-workspace">
            {/* ── Profile sidebar ── */}
            <aside className="ja-card ja-profile">
              <div className="ja-card-header">
                <div className="ja-card-icon-wrap" style={{ background: "rgba(36, 122, 112, 0.15)", color: "#247a70" }}>
                  <UserRound size={18} />
                </div>
                <div>
                  <h2 className="ja-card-title">User profile</h2>
                  <p className="ja-card-subtitle">Candidate inputs for gap analysis.</p>
                </div>
              </div>

              <div className="ja-fields">
                <label className="ja-label">
                  Current skills
                  <textarea
                    className="ja-textarea"
                    value={profile.skills}
                    onChange={(e) => updateProfile("skills", e.target.value)}
                  />
                </label>

                <div className="ja-fields-row">
                  <label className="ja-label">
                    Years experience
                    <input
                      className="ja-input"
                      min="0"
                      type="number"
                      value={profile.yearsExperience}
                      onChange={(e) => updateProfile("yearsExperience", e.target.value)}
                    />
                  </label>
                  <label className="ja-label">
                    Work type
                    <select
                      className="ja-input"
                      value={profile.workType}
                      onChange={(e) => updateProfile("workType", e.target.value)}
                    >
                      <option>Remote</option>
                      <option>Hybrid</option>
                      <option>On-site</option>
                    </select>
                  </label>
                </div>

                <label className="ja-label">
                  Target job
                  <input
                    className="ja-input"
                    value={profile.targetJob}
                    onChange={(e) => updateProfile("targetJob", e.target.value)}
                  />
                </label>

                <label className="ja-label">
                  Location
                  <input
                    className="ja-input"
                    value={profile.location}
                    onChange={(e) => updateProfile("location", e.target.value)}
                  />
                </label>
              </div>
            </aside>

            {/* ── Right column ── */}
            <div className="ja-main-col">
              {/* Job description form */}
              <form onSubmit={handleAnalyze} className="ja-card">
                <div className="ja-card-header ja-card-header--between">
                  <div className="ja-card-header">
                    <div className="ja-card-icon-wrap" style={{ background: "rgba(166, 98, 55, 0.15)", color: "#c8874a" }}>
                      <BriefcaseBusiness size={18} />
                    </div>
                    <div>
                      <h2 className="ja-card-title">Job description analyzer</h2>
                      <p className="ja-card-subtitle">Paste a role description to extract requirements.</p>
                    </div>
                  </div>
                  <div className="ja-location-chip">
                    <MapPin size={12} />
                    {profile.location} · {profile.workType}
                  </div>
                </div>

                <label className="ja-label" style={{ marginTop: "20px" }}>
                  Job description
                  <textarea
                    className="ja-textarea ja-textarea--tall"
                    value={jobDescription}
                    onChange={(e) => {
                      setJobDescription(e.target.value);
                      setHasAnalyzed(false);
                      setExtractionSource(null);
                      setExtractNotice("");
                      setExtractError("");
                    }}
                    required
                  />
                </label>

                {extractError && (
                  <p className="ja-error">{extractError}</p>
                )}

                <button
                  className={cn("ja-extract-btn", isExtracting && "ja-extract-btn--loading")}
                  disabled={isExtracting}
                  type="submit"
                >
                  {isExtracting ? (
                    <>
                      <span className="ja-spinner" />
                      Extracting…
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} />
                      Extract skills
                    </>
                  )}
                </button>
              </form>

              {/* Skill report */}
              <section className="ja-card">
                <div className="ja-card-header ja-card-header--between">
                  <div className="ja-card-header">
                    <div className="ja-card-icon-wrap" style={{ background: "rgba(56, 95, 143, 0.15)", color: "#6b9fd4" }}>
                      <ClipboardList size={18} />
                    </div>
                    <div>
                      <h2 className="ja-card-title">Skill report</h2>
                      <p className="ja-card-subtitle">
                        {hasAnalyzed
                          ? `Target: ${profile.targetJob}`
                          : isExtracting
                            ? "Extracting skills from the job description…"
                            : "Run extraction to generate the report."}
                      </p>
                    </div>
                  </div>

                  <div className="ja-score-badge">
                    <span className="ja-score-value">{hasAnalyzed ? readinessScore : 0}%</span>
                    <span className="ja-score-label">Skill match</span>
                  </div>
                </div>

                {hasAnalyzed ? (
                  <div className="ja-report">
                    {/* Source notice */}
                    <div className="ja-source-row">
                      {extractionSource && (
                        <span className={cn("ja-source-chip", extractionSource === "gemini" ? "ja-source-chip--gemini" : "ja-source-chip--local")}>
                          {extractionSource === "gemini" ? "Gemini extraction" : "Local fallback"}
                        </span>
                      )}
                      {extractNotice && <span className="ja-notice-text">{extractNotice}</span>}
                    </div>

                    {/* Skill category groups */}
                    <div className="ja-skill-groups">
                      <DarkSkillGroup title="Technical" skills={groupByCategory(extractedSkills, "Technical")} />
                      <DarkSkillGroup title="Soft" skills={groupByCategory(extractedSkills, "Soft")} />
                      <DarkSkillGroup title="Experience" skills={groupByCategory(extractedSkills, "Experience")} />
                    </div>

                    {/* Strong / Missing lists */}
                    <div className="ja-report-lists">
                      <DarkReportList title="Strong" emptyText="No overlaps yet." skills={strongSkills} tone="strong" />
                      <DarkReportList title="Missing" emptyText="No gaps found." skills={missingSkills} tone="missing" />
                    </div>

                    {/* Priority scores */}
                    {missingSkills.length > 0 && (
                      <div>
                        <h3 className="ja-section-label">Priority score</h3>
                        <div className="ja-priority-grid">
                          {missingSkills.slice(0, 6).map((skill) => (
                            <div key={skill.name} className="ja-priority-card">
                              <div className="ja-priority-card-top">
                                <span className="ja-priority-skill-name">{skill.name}</span>
                                <span className={cn("ja-priority-chip", skill.importance >= 8 ? "ja-priority-chip--high" : "ja-priority-chip--medium")}>
                                  {priorityLabel(skill.importance)}
                                </span>
                              </div>
                              <p className="ja-priority-importance">Importance {skill.importance}/10</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="ja-empty-report">
                    The first report will appear here after skill extraction.
                  </div>
                )}
              </section>
            </div>
          </div>
        )}

        {/* ── Footer ── */}
        <footer className="dashboard-footer" style={{ marginTop: "48px" }}>
          <span>Bridge Career Agent</span>
          <span className="dashboard-footer-sep">·</span>
          <span>Job Analyzer · Phase 1</span>
        </footer>
      </div>
    </main>
  );
}

function DarkSkillGroup({ title, skills }: { title: string; skills: ExtractedSkill[] }) {
  return (
    <div className="ja-skill-group">
      <h3 className="ja-section-label">{title}</h3>
      <div className="ja-skill-chips">
        {skills.length ? (
          skills.map((skill) => (
            <span key={skill.name} className="ja-skill-chip">{skill.name}</span>
          ))
        ) : (
          <span className="ja-muted">None extracted</span>
        )}
      </div>
    </div>
  );
}

function DarkReportList({
  title,
  emptyText,
  skills,
  tone,
}: {
  title: string;
  emptyText: string;
  skills: ExtractedSkill[];
  tone: "strong" | "missing";
}) {
  return (
    <div className="ja-report-list">
      <h3 className="ja-section-label">{title}</h3>
      <div className="ja-report-list-items">
        {skills.length ? (
          skills.map((skill) => (
            <div key={skill.name} className="ja-report-row">
              <span className="ja-report-skill-name">{skill.name}</span>
              <span className={cn("ja-report-chip", tone === "strong" ? "ja-report-chip--strong" : "ja-report-chip--missing")}>
                {tone === "strong" ? "Matched" : priorityLabel(skill.importance)}
              </span>
            </div>
          ))
        ) : (
          <p className="ja-muted">{emptyText}</p>
        )}
      </div>
    </div>
  );
}
