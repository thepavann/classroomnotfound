export type ClassType = "Theory" | "Lab" | "Online" | "Activity" | "Break";

export interface TimetableEntry {
  id: number;
  day: string;
  period: string;
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  subject: string;
  faculty: string[];
  room: string;
  type: ClassType;
}

export const timetableData: TimetableEntry[] = [
  { id: 1, day: "Monday", period: "I-IV", startTime: "09:00", endTime: "12:20", subject: "Database Management Systems Lab", faculty: ["Mr. P. Sravan Kumar", "Mrs. N. Manasa"], room: "Lab 5201", type: "Lab" },
  { id: 2, day: "Monday", period: "V", startTime: "13:10", endTime: "13:55", subject: "Software Engineering", faculty: ["Mrs. K. Beena"], room: "2212", type: "Theory" },
  { id: 3, day: "Monday", period: "VI", startTime: "13:55", endTime: "14:40", subject: "Object Oriented Programming through Java", faculty: ["Mr. G. Venkata Kishore"], room: "2212", type: "Theory" },
  { id: 4, day: "Monday", period: "VII", startTime: "14:40", endTime: "15:25", subject: "Mathematical & Statistical Foundations", faculty: ["Dr. P. Naresh"], room: "2212", type: "Theory" },
  { id: 5, day: "Monday", period: "VIII", startTime: "15:25", endTime: "16:10", subject: "NPTEL", faculty: [], room: "2212", type: "Online" },
  { id: 6, day: "Tuesday", period: "I", startTime: "09:00", endTime: "09:50", subject: "Computer Architecture and Organization", faculty: ["Mr. P. Mahender"], room: "2212", type: "Theory" },
  { id: 7, day: "Tuesday", period: "II", startTime: "09:50", endTime: "10:40", subject: "Mathematical & Statistical Foundations", faculty: ["Dr. P. Naresh"], room: "2212", type: "Theory" },
  { id: 8, day: "Tuesday", period: "III", startTime: "10:40", endTime: "11:30", subject: "Object Oriented Programming through Java", faculty: ["Mr. G. Venkata Kishore"], room: "2212", type: "Theory" },
  { id: 9, day: "Tuesday", period: "IV", startTime: "11:30", endTime: "12:20", subject: "Software Engineering", faculty: ["Mrs. K. Beena"], room: "2212", type: "Theory" },
  { id: 10, day: "Tuesday", period: "V", startTime: "13:10", endTime: "13:55", subject: "Database Management Systems", faculty: ["Mr. P. Sravan Kumar"], room: "2212", type: "Theory" },
  { id: 11, day: "Tuesday", period: "VI", startTime: "13:55", endTime: "14:40", subject: "Computer Architecture and Organization", faculty: ["Mr. P. Mahender"], room: "2212", type: "Theory" },
  { id: 12, day: "Tuesday", period: "VII-VIII", startTime: "14:40", endTime: "16:10", subject: "Library", faculty: [], room: "Library", type: "Activity" },
  { id: 13, day: "Wednesday", period: "I-II", startTime: "09:00", endTime: "10:40", subject: "Computational Mathematics Lab", faculty: ["Dr. B. Vijay Bhaskar Reddy", "Dr. J. Venkata Madhu"], room: "Lab 5201", type: "Lab" },
  { id: 14, day: "Wednesday", period: "III", startTime: "10:40", endTime: "11:30", subject: "Computer Architecture and Organization", faculty: ["Mr. P. Mahender"], room: "2212", type: "Theory" },
  { id: 15, day: "Wednesday", period: "IV", startTime: "11:30", endTime: "12:20", subject: "NPTEL", faculty: [], room: "2212", type: "Online" },
  { id: 16, day: "Wednesday", period: "V", startTime: "13:10", endTime: "13:55", subject: "Software Engineering", faculty: ["Mrs. K. Beena"], room: "2212", type: "Theory" },
  { id: 17, day: "Wednesday", period: "VI", startTime: "13:55", endTime: "14:40", subject: "Database Management Systems", faculty: ["Mr. P. Sravan Kumar"], room: "2212", type: "Theory" },
  { id: 18, day: "Wednesday", period: "VII-VIII", startTime: "14:40", endTime: "16:10", subject: "Mentoring", faculty: [], room: "2212", type: "Activity" },
  { id: 19, day: "Thursday", period: "I", startTime: "09:00", endTime: "09:50", subject: "Computer Architecture and Organization", faculty: ["Mr. P. Mahender"], room: "2212", type: "Theory" },
  { id: 20, day: "Thursday", period: "II", startTime: "09:50", endTime: "10:40", subject: "Database Management Systems", faculty: ["Mr. P. Sravan Kumar"], room: "2212", type: "Theory" },
  { id: 21, day: "Thursday", period: "III", startTime: "10:40", endTime: "11:30", subject: "Mathematical & Statistical Foundations", faculty: ["Dr. P. Naresh"], room: "2212", type: "Theory" },
  { id: 22, day: "Thursday", period: "IV", startTime: "11:30", endTime: "12:20", subject: "Software Engineering", faculty: ["Mrs. K. Beena"], room: "2212", type: "Theory" },
  { id: 23, day: "Thursday", period: "V", startTime: "13:10", endTime: "13:55", subject: "Object Oriented Programming through Java", faculty: ["Mr. G. Venkata Kishore"], room: "2212", type: "Theory" },
  { id: 24, day: "Thursday", period: "VI", startTime: "13:55", endTime: "14:40", subject: "Mathematical & Statistical Foundations", faculty: ["Dr. P. Naresh"], room: "2212", type: "Theory" },
  { id: 25, day: "Thursday", period: "VII-VIII", startTime: "14:40", endTime: "16:10", subject: "Sports", faculty: [], room: "Sports Ground", type: "Activity" },
  { id: 28, day: "Friday", period: "I-II", startTime: "09:00", endTime: "10:40", subject: "Coding Skills", faculty: ["Dr. K. Damodhar Rao"], room: "8404", type: "Theory" },
  { id: 29, day: "Friday", period: "III", startTime: "10:40", endTime: "11:30", subject: "Object Oriented Programming through Java", faculty: ["Mr. G. Venkata Kishore"], room: "8404", type: "Theory" },
  { id: 30, day: "Friday", period: "IV", startTime: "11:30", endTime: "12:20", subject: "Database Management Systems", faculty: ["Mr. P. Sravan Kumar"], room: "8404", type: "Theory" },
  { id: 31, day: "Friday", period: "Lunch", startTime: "12:20", endTime: "13:10", subject: "Lunch", faculty: [], room: "Canteen", type: "Break" },
  { id: 32, day: "Friday", period: "V-VIII", startTime: "13:10", endTime: "16:10", subject: "Object Oriented Programming through Java Lab", faculty: ["Mr. G. Venkata Kishore", "Mrs. K. Divyasri"], room: "Lab 5201", type: "Lab" },
  { id: 33, day: "Saturday", period: "I", startTime: "09:00", endTime: "09:50", subject: "Database Management Systems", faculty: ["Mr. P. Sravan Kumar"], room: "8404", type: "Theory" },
  { id: 34, day: "Saturday", period: "II", startTime: "09:50", endTime: "10:40", subject: "Object Oriented Programming through Java", faculty: ["Mr. G. Venkata Kishore"], room: "8404", type: "Theory" },
  { id: 35, day: "Saturday", period: "III", startTime: "10:40", endTime: "11:30", subject: "Computer Architecture and Organization", faculty: ["Mr. P. Mahender"], room: "8404", type: "Theory" },
  { id: 36, day: "Saturday", period: "IV", startTime: "11:30", endTime: "12:20", subject: "Software Engineering", faculty: ["Mrs. K. Beena"], room: "8404", type: "Theory" },
  { id: 37, day: "Saturday", period: "Lunch", startTime: "12:20", endTime: "13:10", subject: "Lunch", faculty: [], room: "Canteen", type: "Break" },
  { id: 38, day: "Saturday", period: "V-VIII", startTime: "13:10", endTime: "16:10", subject: "Software Engineering Lab", faculty: ["Mrs. K. Beena", "Mrs. G. Anusha"], room: "Lab 5201", type: "Lab" },
];
