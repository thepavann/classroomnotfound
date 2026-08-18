export type Grade = "O" | "A+" | "A" | "B+" | "B" | "C" | "F" | "AB";

/** Centralized official grading configuration. */
export const GRADE_POINTS: Record<Grade, number> = {
  O: 10,
  "A+": 9,
  A: 8,
  "B+": 7,
  B: 6,
  C: 5,
  F: 0,
  AB: 0,
};

export const GRADE_ORDER: Grade[] = ["O", "A+", "A", "B+", "B", "C", "F", "AB"];

export const GRADE_MEANING: Record<Grade, string> = {
  O: "Outstanding",
  "A+": "Excellent",
  A: "Very Good",
  "B+": "Good",
  B: "Average",
  C: "Pass",
  F: "Fail",
  AB: "Absent",
};

export type Course = {
  code: string;
  name: string;
  credits: number;
};

export type Semester = {
  id: string;
  label: string;
  year: string;
  semester: string;
  courses: Course[];
  totalCredits: number;
};

export const SEM_1_2: Semester = {
  id: "1-2",
  label: "1-2 Semester",
  year: "1st Year",
  semester: "2nd Semester",
  courses: [
    { code: "25HC08", name: "ODE & VC", credits: 3 },
    { code: "25HC03", name: "AEP", credits: 3 },
    { code: "25BC01", name: "ED & CAD", credits: 3 },
    { code: "25CC01", name: "EDC", credits: 3 },
    { code: "25EC01", name: "DS", credits: 3 },
    { code: "25HC05", name: "ES", credits: 1 },
    { code: "25HC64", name: "AEP Lab", credits: 1 },
    { code: "25EC61", name: "DS Lab", credits: 1 },
    { code: "25HC61", name: "ELCS Lab", credits: 1 },
    { code: "25BC61", name: "Engineering Workshop", credits: 1 },
  ],
  totalCredits: 20,
};
