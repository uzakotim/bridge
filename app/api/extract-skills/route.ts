import { extractSkillsLocally, type ExtractedSkill, type SkillCategory } from "@/lib/career-analysis";

export const runtime = "nodejs";

type GeminiSkill = {
  name?: unknown;
  aliases?: unknown;
  category?: unknown;
  importance?: unknown;
};

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
};

const categories: SkillCategory[] = ["Technical", "Soft", "Experience"];

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const jobDescription = typeof body?.jobDescription === "string" ? body.jobDescription.trim() : "";

  if (jobDescription.length < 40) {
    return Response.json(
      { error: "Paste at least 40 characters of a job description before extracting skills." },
      { status: 400 },
    );
  }

  const apiKey = process.env.GOOGLE_AI_API_KEY ?? process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return Response.json({
      skills: extractSkillsLocally(jobDescription),
      source: "local",
      notice: "Set GOOGLE_AI_API_KEY to enable Gemini extraction.",
    });
  }

  try {
    const skills = await extractWithGemini(jobDescription, apiKey);

    return Response.json({
      skills,
      source: "gemini",
    });
  } catch (error) {
    console.error("Gemini skill extraction failed", error);

    return Response.json({
      skills: extractSkillsLocally(jobDescription),
      source: "local",
      notice: "Gemini extraction failed, so the local prototype extractor was used.",
    });
  }
}

const GEMINI_BODY = (jobDescription: string) =>
  JSON.stringify({
    contents: [
      {
        role: "user",
        parts: [
          {
            text: [
              "Extract career requirements from this job description.",
              "Return only concrete skills, technologies, responsibilities, or soft skills that are explicitly required or strongly implied.",
              "Use category Technical for tools, languages, frameworks, platforms, and databases.",
              "Use category Experience for responsibilities or work patterns such as API development, testing, deployment, or CI/CD.",
              "Use category Soft for interpersonal skills.",
              "Importance must be an integer from 1 to 10.",
              "",
              jobDescription,
            ].join("\n"),
          },
        ],
      },
    ],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          skills: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                name: { type: "STRING" },
                aliases: { type: "ARRAY", items: { type: "STRING" } },
                category: { type: "STRING", enum: categories },
                importance: { type: "INTEGER" },
              },
              required: ["name", "aliases", "category", "importance"],
            },
          },
        },
        required: ["skills"],
      },
      temperature: 0.1,
    },
  });

async function extractWithGemini(jobDescription: string, apiKey: string) {
  const model = process.env.GOOGLE_AI_MODEL ?? "gemini-2.0-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const body = GEMINI_BODY(jobDescription);

  const MAX_ATTEMPTS = 3;
  const DEADLINE_MS = 25_000;

  const deadline = Date.now() + DEADLINE_MS;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const remaining = deadline - Date.now();

    if (remaining <= 0) {
      throw new Error("Gemini deadline exceeded before attempt could start.");
    }

    const controller = new AbortController();
    const abortTimer = setTimeout(() => controller.abort(), Math.min(remaining, 12_000));

    let response: Response;

    try {
      response = await fetch(url, {
        method: "POST",
        signal: controller.signal,
        headers: { "Content-Type": "application/json" },
        body,
      });
    } finally {
      clearTimeout(abortTimer);
    }

    // Success path
    if (response.ok) {
      const data = (await response.json()) as GeminiResponse;
      const text = data.candidates?.[0]?.content?.parts?.find((p) => p.text)?.text;

      if (!text) throw new Error("Gemini did not return JSON text.");

      const parsed = JSON.parse(text) as { skills?: GeminiSkill[] };
      const normalized = normalizeGeminiSkills(parsed.skills ?? []);

      if (normalized.length === 0) throw new Error("Gemini returned no usable skills.");

      return normalized;
    }

    // Rate-limited: back off, then retry
    if (response.status === 429 && attempt < MAX_ATTEMPTS) {
      const retryAfter = response.headers.get("Retry-After");
      const waitMs = retryAfter ? Math.min(parseFloat(retryAfter) * 1000, 10_000) : attempt * 2_000;

      console.warn(`Gemini rate-limited (429). Waiting ${waitMs}ms before attempt ${attempt + 1}.`);

      await new Promise((resolve) => setTimeout(resolve, waitMs));
      continue;
    }

    throw new Error(`Gemini request failed with ${response.status}`);
  }

  throw new Error("Gemini extraction failed after all retry attempts.");
}

function normalizeGeminiSkills(skills: GeminiSkill[]) {
  const seen = new Set<string>();

  return skills.reduce<ExtractedSkill[]>((result, skill) => {
    const name = typeof skill.name === "string" ? skill.name.trim() : "";
    const category = categories.find((candidate) => candidate === skill.category);
    const importance = Number(skill.importance);

    if (!name || !category || !Number.isFinite(importance)) {
      return result;
    }

    const key = name.toLowerCase();

    if (seen.has(key)) {
      return result;
    }

    seen.add(key);

    const aliases = Array.isArray(skill.aliases)
      ? skill.aliases.filter((alias): alias is string => typeof alias === "string" && alias.trim().length > 0)
      : [];

    result.push({
      name,
      aliases: aliases.length ? aliases.map((alias) => alias.trim()) : [name],
      category,
      importance: Math.min(10, Math.max(1, Math.round(importance))),
      foundBy: "Gemini",
    });

    return result;
  }, []);
}
