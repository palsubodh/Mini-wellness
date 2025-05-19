import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["Member", "Trainer"], {message: "Role is required"}),
  wallet: z.number().optional(),
});
export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const topUpSchema = z.object({
  amount: z.number().min(1, "Amount must be greater than 0"),
});

