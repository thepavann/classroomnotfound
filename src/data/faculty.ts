export interface Faculty {
  id: number;
  name: string;
  subject: string;
  department: string;
  phone: string;
  email: string;
  room: string;
  photo: string;
  designation: string;
}

export const facultyData: Faculty[] = [
  { id: 1, name: "Dr. P. Naresh", subject: "Mathematical & Statistical Foundations", department: "S&H", phone: "9959525584", email: "naresh.p@sreenidhi.edu.in", room: "8404", photo: "", designation: "Assistant Professor" },
  { id: 2, name: "Mr. P. Mahender", subject: "Computer Architecture and Organization", department: "ECE", phone: "9490068032", email: "mahenderp@sreenidhi.edu.in", room: "8404", photo: "", designation: "Assistant Professor" },
  { id: 3, name: "Mr. G. Venkata Kishore", subject: "Object Oriented Programming through Java", department: "AI&ML", phone: "9989612292", email: "kishore.g@sreenidhi.edu.in", room: "8404", photo: "", designation: "Assistant Professor" },
  { id: 4, name: "Mrs. K. Beena", subject: "Software Engineering", department: "AI&ML", phone: "9849964204", email: "beena.k@sreenidhi.edu.in", room: "8404", photo: "", designation: "Assistant Professor" },
  { id: 5, name: "Mr. P. Sravan Kumar", subject: "Database Management Systems", department: "AI&ML", phone: "7729047007", email: "sravan.p@sreenidhi.edu.in", room: "8404", photo: "", designation: "Assistant Professor" },
  { id: 6, name: "Dr. B. Vijay Bhaskar Reddy", subject: "Computational Mathematics Lab", department: "S&H", phone: "9505742650", email: "vijayabhaskar.b@sreenidhi.edu.in", room: "Lab 5201", photo: "", designation: "Professor" },
  { id: 7, name: "Dr. J. Venkata Madhu", subject: "Computational Mathematics Lab", department: "S&H", phone: "9949441993", email: "madhu.j@sreenidhi.edu", room: "Lab 5201", photo: "", designation: "Professor" },
  { id: 8, name: "Mrs. K. Divyasri", subject: "Object Oriented Programming through Java Lab", department: "AI&ML", phone: "9948029328", email: "", room: "Lab 5201", photo: "", designation: "Assistant Professor" },
  { id: 9, name: "Mrs. G. Anusha", subject: "Software Engineering Lab", department: "AI&ML", phone: "8096233269", email: "anusha.g@sreenidhi.edu.in", room: "Lab 5201", photo: "", designation: "Assistant Professor" },
  { id: 10, name: "Mrs. N. Manasa", subject: "Database Management Systems Lab", department: "AI&ML", phone: "6309128173", email: "manasa.n@sreenidhi.edu.in", room: "Lab 5201", photo: "", designation: "Assistant Professor" },
  { id: 11, name: "Dr. K. Damodhar Rao", subject: "Coding Skills", department: "CSE", phone: "9989925924", email: "damodhar.k@sreenidhi.edu.in", room: "", photo: "", designation: "Professor" },
  { id: 12, name: "Mr. P. Sravan Kumar", subject: "Section Incharge", department: "AI&ML", phone: "7729047007", email: "sravan.p@sreenidhi.edu.in", room: "8404", photo: "", designation: "Section Incharge" },
];
