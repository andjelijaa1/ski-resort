import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../service/apiAuth";
import { useNavigate, Link } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";
import { logInSchema } from "@/lib/types";
import type { TSLogInSchema } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircleIcon } from "lucide-react";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

function Login() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TSLogInSchema>({
    resolver: zodResolver(logInSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: TSLogInSchema) => login(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      navigate("/dashboard");
    },
    onError: (err: any) => {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Login failed. Please try again.";
      toast.error("Login Failed", {
        description: message,
        duration: 4000,
      });
      if (message.toLowerCase().includes("email")) {
        reset({ email: "" });
      } else if (message.toLowerCase().includes("password")) {
        reset({ password: "" });
      }
    },
  });

  const onSubmit = (data: TSLogInSchema) => {
    mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-[50%] flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold mb-6 text-center">Welcome back</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 w-full max-w-md"
        >
          {/* Email */}
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

          {/* Password */}
          <div className="flex flex-col gap-1 relative mb-4">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...register("password")}
              className={`w-full px-3 py-2 border rounded-md pr-24 
      ${errors.password ? "border-red-500" : ""}`}
            />
            {errors.password && (
              <Alert variant="destructive">
                <AlertCircleIcon />
                <AlertTitle>{errors.password.message}</AlertTitle>
              </Alert>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || isPending}
            variant="primary"
          >
            {isPending ? "Logging in..." : "Log in"}
          </Button>

          <p className="mt-3 text-center text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-500 underline">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
