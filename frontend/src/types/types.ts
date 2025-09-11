import { z } from "zod";

export const signUpSchema = z
  .object({
    user_name: z.string(),
    email: z.string().email(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export const logInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters!"),
});

export type TSignUpSchema = z.infer<typeof signUpSchema>;
export type TSLogInSchema = z.infer<typeof logInSchema>;
