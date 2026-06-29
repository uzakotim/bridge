export type SkillCategory = "Technical" | "Soft" | "Experience";

export type SkillDefinition = {
  name: string;
  aliases: string[];
  category: SkillCategory;
  importance: number;
};

export type ExtractedSkill = SkillDefinition & {
  foundBy: string;
};

export const skillCatalog: SkillDefinition[] = [
  { name: "JavaScript", aliases: ["javascript", "js"], category: "Technical", importance: 8 },
  { name: "TypeScript", aliases: ["typescript", "ts"], category: "Technical", importance: 8 },
  { name: "React", aliases: ["react", "react.js", "reactjs"], category: "Technical", importance: 8 },
  { name: "Next.js", aliases: ["next.js", "nextjs", "next"], category: "Technical", importance: 7 },
  { name: "Node.js", aliases: ["node.js", "nodejs", "node"], category: "Technical", importance: 7 },
  { name: "Python", aliases: ["python"], category: "Technical", importance: 8 },
  { name: "SQL", aliases: ["sql"], category: "Technical", importance: 7 },
  { name: "PostgreSQL", aliases: ["postgresql", "postgres"], category: "Technical", importance: 7 },
  { name: "REST APIs", aliases: ["rest api", "rest apis", "restful"], category: "Experience", importance: 8 },
  { name: "GraphQL", aliases: ["graphql"], category: "Technical", importance: 5 },
  { name: "Docker", aliases: ["docker", "container"], category: "Technical", importance: 8 },
  { name: "Kubernetes", aliases: ["kubernetes", "k8s"], category: "Technical", importance: 5 },
  { name: "AWS", aliases: ["aws", "amazon web services"], category: "Technical", importance: 7 },
  { name: "Cloud deployment", aliases: ["cloud deployment", "deploy", "deployment"], category: "Experience", importance: 7 },
  { name: "Testing", aliases: ["testing", "unit test", "integration test", "jest", "pytest"], category: "Experience", importance: 7 },
  { name: "Git", aliases: ["git", "github", "gitlab"], category: "Technical", importance: 6 },
  { name: "CI/CD", aliases: ["ci/cd", "continuous integration", "continuous delivery"], category: "Experience", importance: 6 },
  { name: "Agile", aliases: ["agile", "scrum", "kanban"], category: "Experience", importance: 5 },
  { name: "Communication", aliases: ["communication", "communicate"], category: "Soft", importance: 7 },
  { name: "Teamwork", aliases: ["teamwork", "collaborate", "collaboration", "cross-functional"], category: "Soft", importance: 7 },
  { name: "Problem solving", aliases: ["problem solving", "debug", "troubleshoot"], category: "Soft", importance: 6 },
  { name: "Ownership", aliases: ["ownership", "independent", "self starter"], category: "Soft", importance: 5 },
];

export function normalize(value: string) {
  return value.toLowerCase().replace(/[^\w+#./\s-]/g, " ");
}

export function splitSkills(value: string) {
  return normalize(value)
    .split(/[\n,;/|]+/)
    .map((skill) => skill.trim())
    .filter(Boolean);
}

export function includesAlias(text: string, alias: string) {
  const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^a-z0-9+#.])${escaped}([^a-z0-9+#.]|$)`, "i").test(text);
}

export function extractSkillsLocally(jobDescription: string) {
  const text = normalize(jobDescription);

  return skillCatalog
    .map((skill) => {
      const foundBy = skill.aliases.find((alias) => includesAlias(text, alias));
      return foundBy ? { ...skill, foundBy } : null;
    })
    .filter((skill): skill is ExtractedSkill => Boolean(skill))
    .sort((a, b) => b.importance - a.importance || a.name.localeCompare(b.name));
}

export function ownsSkill(skill: SkillDefinition, userSkills: string[]) {
  return userSkills.some((userSkill) =>
    [skill.name, ...skill.aliases].some((alias) => {
      const normalizedAlias = normalize(alias);
      return userSkill === normalizedAlias || userSkill.includes(normalizedAlias);
    }),
  );
}

export function priorityLabel(score: number) {
  if (score >= 8) {
    return "High";
  }

  if (score >= 6) {
    return "Medium";
  }

  return "Low";
}

export function groupByCategory(skills: ExtractedSkill[], category: SkillCategory) {
  return skills.filter((skill) => skill.category === category);
}
