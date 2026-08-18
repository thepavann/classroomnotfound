import { GRADE_POINTS, GRADE_ORDER, type Course, type Grade } from "@/data/grading";

export type GradeMap = Record<string, Grade | undefined>;

export type SgpaResult = {
  sgpa: number;
  credits: number;
  gradePoints: number;
  complete: boolean;
  hasF: boolean;
  hasAB: boolean;
  distribution: { grade: Grade; count: number }[];
};

export function computeSgpa(courses: Course[], grades: GradeMap): SgpaResult {
  let credits = 0;
  let gradePoints = 0;
  let graded = 0;
  const counts = new Map<Grade, number>();

  for (const c of courses) {
    const g = grades[c.code];
    if (!g) continue;
    graded += 1;
    credits += c.credits;
    gradePoints += c.credits * GRADE_POINTS[g];
    counts.set(g, (counts.get(g) ?? 0) + 1);
  }

  return {
    sgpa: credits > 0 ? gradePoints / credits : 0,
    credits,
    gradePoints,
    complete: graded === courses.length && courses.length > 0,
    hasF: [...counts.keys()].includes("F"),
    hasAB: [...counts.keys()].includes("AB"),
    distribution: GRADE_ORDER.filter((g) => counts.get(g)).map((g) => ({
      grade: g,
      count: counts.get(g)!,
    })),
  };
}

export type Reaction = {
  mood: string;
  headline: string;
  sub: string;
  tone: "elite" | "great" | "good" | "decent" | "grind" | "survive" | "alert";
};

export function reactionFor(sgpa: number): Reaction {
  if (sgpa >= 9.5)
    return {
      mood: "Academic Weapon 🔥",
      headline: "ACADEMIC WEAPON DETECTED. 🗿🔥",
      sub: "Bro didn't study. Bro became the syllabus.",
      tone: "elite",
    };
  if (sgpa >= 9)
    return {
      mood: "Topper Energy 🧠",
      headline: "BRO IS COOKING. 🔥",
      sub: "The question paper was scared of you.",
      tone: "great",
    };
  if (sgpa >= 8)
    return {
      mood: "Solid W 😎",
      headline: "WE TAKE THOSE. 🫡",
      sub: "Not touching grass was worth it.",
      tone: "good",
    };
  if (sgpa >= 7)
    return {
      mood: "Pretty Decent 👌",
      headline: "W RESULT. NO CAP.",
      sub: "You survived. That's what matters.",
      tone: "decent",
    };
  if (sgpa >= 6)
    return {
      mood: "The Grind Continues 💀",
      headline: "WE'RE SO BACK... NEXT SEM.",
      sub: "Character development arc loading...",
      tone: "grind",
    };
  if (sgpa >= 5)
    return {
      mood: "Survival Mode 🫠",
      headline: "BRO IS ALIVE. THAT'S A WIN.",
      sub: "The semester tried. You survived harder.",
      tone: "survive",
    };
  return {
    mood: "Academic Emergency 🚨",
    headline: "NAH BRO 💀",
    sub: "This is not a result. This is a side quest.",
    tone: "alert",
  };
}

export const LOADER_LINES = [
  "Calculating academic damage... 💀",
  "Asking the CGPA gods... 🙏",
  "Counting grade points twice... 🧮",
];

export function fmt2(n: number) {
  return n.toFixed(2);
}
