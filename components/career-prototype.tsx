"use client";

import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CircleCheck,
  ClipboardList,
  LockKeyhole,
  MapPin,
  Sparkles,
  UserRound,
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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

  function handleSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsAuthenticated(true);
  }

  async function handleAnalyze(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsExtracting(true);
    setExtractError("");
    setExtractNotice("");

    try {
      const response = await fetch("/api/extract-skills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobDescription }),
      });
      const result = (await response.json()) as {
        skills?: ExtractedSkill[];
        source?: "gemini" | "local";
        notice?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(result.error ?? "Skill extraction failed.");
      }

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
    <main className="min-h-screen bg-[#f7f6f1] text-[#1e2528]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 border-b border-[#d8d4ca] pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-[#52615d]">
              <Sparkles className="size-4 text-[#247a70]" />
              Phase 1 prototype
            </div>
            <h1 className="mt-2 text-2xl font-semibold tracking-normal text-[#172022] sm:text-3xl">
              Bridge career skill report
            </h1>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-[#d8d4ca] bg-white px-3 py-2 text-sm text-[#52615d]">
            <CircleCheck className={cn("size-4", isAuthenticated ? "text-[#247a70]" : "text-[#a66237]")} />
            {isAuthenticated ? `${profile.name} signed in` : "Prototype session pending"}
          </div>
        </header>

        {!isAuthenticated ? (
          <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
            <form
              onSubmit={handleSignIn}
              className="rounded-lg border border-[#d8d4ca] bg-white p-5 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-[#e1f0ed] text-[#247a70]">
                  <LockKeyhole className="size-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Authentication</h2>
                  <p className="text-sm text-[#62706c]">Start one prototype user session.</p>
                </div>
              </div>

              <div className="mt-5 grid gap-4">
                <label className="grid gap-1.5 text-sm font-medium">
                  Name
                  <input
                    className="h-10 rounded-md border border-[#c9c4b8] bg-[#fbfaf6] px-3 text-sm outline-none focus:border-[#247a70] focus:ring-3 focus:ring-[#247a70]/15"
                    value={profile.name}
                    onChange={(event) => updateProfile("name", event.target.value)}
                    required
                  />
                </label>
                <label className="grid gap-1.5 text-sm font-medium">
                  Email
                  <input
                    className="h-10 rounded-md border border-[#c9c4b8] bg-[#fbfaf6] px-3 text-sm outline-none focus:border-[#247a70] focus:ring-3 focus:ring-[#247a70]/15"
                    type="email"
                    value={profile.email}
                    onChange={(event) => updateProfile("email", event.target.value)}
                    required
                  />
                </label>
              </div>

              <Button className="mt-5 h-10 w-full bg-[#247a70] hover:bg-[#1d635b]" type="submit">
                Continue to profile
                <ArrowRight className="size-4" />
              </Button>
            </form>

            <div className="rounded-lg border border-[#d8d4ca] bg-[#172022] p-5 text-white shadow-sm">
              <div className="flex items-center gap-3">
                <BadgeCheck className="size-5 text-[#f0b35b]" />
                <h2 className="text-lg font-semibold">Phase 1 scope</h2>
              </div>
              <div className="mt-5 grid gap-3 text-sm text-[#d7ddd9] sm:grid-cols-2">
                {["Authentication", "Profile", "Job input", "AI skill extraction"].map((item) => (
                  <div key={item} className="rounded-md border border-white/10 bg-white/5 p-3">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : (
          <section className="grid gap-5 xl:grid-cols-[380px_minmax(0,1fr)]">
            <aside className="rounded-lg border border-[#d8d4ca] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-[#e1f0ed] text-[#247a70]">
                  <UserRound className="size-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">User profile</h2>
                  <p className="text-sm text-[#62706c]">Candidate inputs for gap analysis.</p>
                </div>
              </div>

              <div className="mt-5 grid gap-4">
                <label className="grid gap-1.5 text-sm font-medium">
                  Current skills
                  <textarea
                    className="min-h-24 resize-y rounded-md border border-[#c9c4b8] bg-[#fbfaf6] px-3 py-2 text-sm outline-none focus:border-[#247a70] focus:ring-3 focus:ring-[#247a70]/15"
                    value={profile.skills}
                    onChange={(event) => updateProfile("skills", event.target.value)}
                  />
                </label>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                  <label className="grid gap-1.5 text-sm font-medium">
                    Years experience
                    <input
                      className="h-10 rounded-md border border-[#c9c4b8] bg-[#fbfaf6] px-3 text-sm outline-none focus:border-[#247a70] focus:ring-3 focus:ring-[#247a70]/15"
                      min="0"
                      type="number"
                      value={profile.yearsExperience}
                      onChange={(event) => updateProfile("yearsExperience", event.target.value)}
                    />
                  </label>
                  <label className="grid gap-1.5 text-sm font-medium">
                    Preferred work type
                    <select
                      className="h-10 rounded-md border border-[#c9c4b8] bg-[#fbfaf6] px-3 text-sm outline-none focus:border-[#247a70] focus:ring-3 focus:ring-[#247a70]/15"
                      value={profile.workType}
                      onChange={(event) => updateProfile("workType", event.target.value)}
                    >
                      <option>Remote</option>
                      <option>Hybrid</option>
                      <option>On-site</option>
                    </select>
                  </label>
                </div>

                <label className="grid gap-1.5 text-sm font-medium">
                  Target job
                  <input
                    className="h-10 rounded-md border border-[#c9c4b8] bg-[#fbfaf6] px-3 text-sm outline-none focus:border-[#247a70] focus:ring-3 focus:ring-[#247a70]/15"
                    value={profile.targetJob}
                    onChange={(event) => updateProfile("targetJob", event.target.value)}
                  />
                </label>

                <label className="grid gap-1.5 text-sm font-medium">
                  Location
                  <input
                    className="h-10 rounded-md border border-[#c9c4b8] bg-[#fbfaf6] px-3 text-sm outline-none focus:border-[#247a70] focus:ring-3 focus:ring-[#247a70]/15"
                    value={profile.location}
                    onChange={(event) => updateProfile("location", event.target.value)}
                  />
                </label>
              </div>
            </aside>

            <div className="grid gap-5">
              <form onSubmit={handleAnalyze} className="rounded-lg border border-[#d8d4ca] bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-[#fff0d8] text-[#a66237]">
                      <BriefcaseBusiness className="size-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold">Job description analyzer</h2>
                      <p className="text-sm text-[#62706c]">Paste a role description to extract requirements.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#62706c]">
                    <MapPin className="size-4" />
                    {profile.location} / {profile.workType}
                  </div>
                </div>

                <label className="mt-5 grid gap-1.5 text-sm font-medium">
                  Job description
                  <textarea
                    className="min-h-48 resize-y rounded-md border border-[#c9c4b8] bg-[#fbfaf6] px-3 py-2 text-sm leading-6 outline-none focus:border-[#247a70] focus:ring-3 focus:ring-[#247a70]/15"
                    value={jobDescription}
                    onChange={(event) => {
                      setJobDescription(event.target.value);
                      setHasAnalyzed(false);
                      setExtractionSource(null);
                      setExtractNotice("");
                      setExtractError("");
                    }}
                    required
                  />
                </label>

                {extractError ? (
                  <p className="mt-3 rounded-md border border-[#f0b9a1] bg-[#fff5ef] px-3 py-2 text-sm text-[#8a3d20]">
                    {extractError}
                  </p>
                ) : null}

                <Button className="mt-4 h-10 bg-[#247a70] hover:bg-[#1d635b]" disabled={isExtracting} type="submit">
                  {isExtracting ? "Extracting..." : "Extract skills"}
                  <Sparkles className="size-4" />
                </Button>
              </form>

              <section className="rounded-lg border border-[#d8d4ca] bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-[#e8edf3] text-[#385f8f]">
                      <ClipboardList className="size-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold">Skill report</h2>
                      <p className="text-sm text-[#62706c]">
                        {hasAnalyzed
                          ? `Target: ${profile.targetJob}`
                          : isExtracting
                            ? "Extracting skills from the job description."
                            : "Run extraction to generate the report."}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-lg border border-[#d8d4ca] px-4 py-3 text-center">
                    <div className="text-2xl font-semibold text-[#247a70]">{hasAnalyzed ? readinessScore : 0}%</div>
                    <div className="text-xs font-medium uppercase tracking-normal text-[#62706c]">Skill match</div>
                  </div>
                </div>

                {hasAnalyzed ? (
                  <div className="mt-5 grid gap-5">
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      {extractionSource ? (
                        <span
                          className={cn(
                            "rounded-md px-2.5 py-1 font-medium",
                            extractionSource === "gemini"
                              ? "bg-[#e1f0ed] text-[#247a70]"
                              : "bg-[#fff0d8] text-[#8a5a18]",
                          )}
                        >
                          {extractionSource === "gemini" ? "Gemini extraction" : "Local fallback"}
                        </span>
                      ) : null}
                      {extractNotice ? <span className="text-[#62706c]">{extractNotice}</span> : null}
                    </div>

                    <div className="grid gap-4 lg:grid-cols-3">
                      <SkillGroup title="Technical" skills={groupByCategory(extractedSkills, "Technical")} />
                      <SkillGroup title="Soft" skills={groupByCategory(extractedSkills, "Soft")} />
                      <SkillGroup title="Experience" skills={groupByCategory(extractedSkills, "Experience")} />
                    </div>

                    <div className="grid gap-4 lg:grid-cols-2">
                      <ReportList title="Strong" emptyText="No overlaps yet." skills={strongSkills} tone="strong" />
                      <ReportList title="Missing" emptyText="No gaps found." skills={missingSkills} tone="missing" />
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-normal text-[#52615d]">Priority score</h3>
                      <div className="mt-3 grid gap-3 md:grid-cols-3">
                        {missingSkills.slice(0, 6).map((skill) => (
                          <div key={skill.name} className="rounded-lg border border-[#d8d4ca] bg-[#fbfaf6] p-3">
                            <div className="flex items-center justify-between gap-3">
                              <span className="font-medium">{skill.name}</span>
                              <span
                                className={cn(
                                  "rounded-md px-2 py-1 text-xs font-semibold",
                                  skill.importance >= 8
                                    ? "bg-[#f8dccd] text-[#8a3d20]"
                                    : "bg-[#e8edf3] text-[#385f8f]",
                                )}
                              >
                                {priorityLabel(skill.importance)}
                              </span>
                            </div>
                            <p className="mt-2 text-sm text-[#62706c]">Importance {skill.importance}/10</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-5 rounded-lg border border-dashed border-[#c9c4b8] bg-[#fbfaf6] p-6 text-sm text-[#62706c]">
                    The first report will appear here after skill extraction.
                  </div>
                )}
              </section>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function SkillGroup({ title, skills }: { title: string; skills: ExtractedSkill[] }) {
  return (
    <div className="rounded-lg border border-[#d8d4ca] bg-[#fbfaf6] p-4">
      <h3 className="text-sm font-semibold uppercase tracking-normal text-[#52615d]">{title}</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {skills.length ? (
          skills.map((skill) => (
            <span key={skill.name} className="rounded-md bg-white px-2.5 py-1 text-sm ring-1 ring-[#d8d4ca]">
              {skill.name}
            </span>
          ))
        ) : (
          <span className="text-sm text-[#62706c]">None extracted</span>
        )}
      </div>
    </div>
  );
}

function ReportList({
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
    <div className="rounded-lg border border-[#d8d4ca] bg-[#fbfaf6] p-4">
      <h3 className="text-sm font-semibold uppercase tracking-normal text-[#52615d]">{title}</h3>
      <div className="mt-3 grid gap-2">
        {skills.length ? (
          skills.map((skill) => (
            <div key={skill.name} className="flex items-center justify-between gap-3 rounded-md bg-white p-3">
              <span className="font-medium">{skill.name}</span>
              <span
                className={cn(
                  "rounded-md px-2 py-1 text-xs font-semibold",
                  tone === "strong" ? "bg-[#e1f0ed] text-[#247a70]" : "bg-[#fff0d8] text-[#8a5a18]",
                )}
              >
                {tone === "strong" ? "Matched" : priorityLabel(skill.importance)}
              </span>
            </div>
          ))
        ) : (
          <p className="text-sm text-[#62706c]">{emptyText}</p>
        )}
      </div>
    </div>
  );
}
