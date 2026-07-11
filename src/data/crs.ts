export interface CR {
  id: number;
  name: string;
  role: string;
  phone: string;
  email: string;
  whatsapp?: string;
  photo: string;
  responsibilities: string[];
}

// Paste CR data here later.
export const crData: CR[] = [];
