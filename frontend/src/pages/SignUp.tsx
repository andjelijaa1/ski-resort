import { useNavigate, Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signup } from "../service/apiAuth";
import { ModeToggle } from "@/components/layout/mode-toggle";
import { useForm } from "react-hook-form";
import type { TSignUpSchema } from "@/types/types";
import { signUpSchema } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SignUp() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TSignUpSchema>({ resolver: zodResolver(signUpSchema) });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: TSignUpSchema) => signup(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      navigate("/dashboard");
    },
    onError: (err: any) => {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Signup failed. Please try again.";
      toast.error("Signup Failed", {
        description: message,
        duration: 4000,
      });
      if (message.toLowerCase().includes("email")) {
        reset({ email: "" });
      } else if (message.toLowerCase().includes("password")) {
        reset({ password: "", confirmPassword: "" });
      }
    },
  });

  const onSubmit = (data: TSignUpSchema) => {
    console.log("Form data being sent:", data);
    mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <div className="w-[50%] flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Create an account
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 w-full max-w-md"
        >
          <div className="flex flex-col gap-1">
            <Label htmlFor="username">Name</Label>
            <Input id="username" type="text" {...register("user_name")} />
            {errors.user_name && (
              <Alert variant="destructive">
                <AlertCircleIcon />
                <AlertTitle>{errors.user_name.message}</AlertTitle>
              </Alert>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && (
              <Alert variant="destructive">
                <AlertCircleIcon />
                <AlertTitle>{errors.email.message}</AlertTitle>
              </Alert>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...register("password")} />
            {errors.password && (
              <Alert variant="destructive">
                <AlertCircleIcon />
                <AlertTitle>{errors.password.message}</AlertTitle>
                <AlertDescription>
                  Please correct your password.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <Alert variant="destructive">
                <AlertCircleIcon />
                <AlertTitle>{errors.confirmPassword.message}</AlertTitle>
              </Alert>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || isPending}
            className="cursor-pointer font-semibold"
            variant="primary"
          >
            {isPending ? "Creating account..." : "Sign Up"}
          </Button>

          <p className="mt-3 text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 underline">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
