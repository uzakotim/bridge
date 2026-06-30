import { CareerPrototype } from "@/components/career-prototype";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Job Analyzer — Bridge Career Agent",
  description: "Paste a job description to extract required skills, identify skill gaps, and get a readiness score powered by Gemini AI.",
};

export default function CareerPrototypePage() {
  return <CareerPrototype />;
}
