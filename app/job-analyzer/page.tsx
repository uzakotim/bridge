import type { Metadata } from "next";
import { JobAnalyzer } from "@/components/JobAnalyzer";

export const metadata: Metadata = {
  title: "Job Analyzer — Bridge Career Agent",
  description: "Paste a job description to extract required skills, identify skill gaps, and get a readiness score powered by Gemini AI.",
};

export default function JobAnalyzerPage() {
  return <JobAnalyzer />;
}
