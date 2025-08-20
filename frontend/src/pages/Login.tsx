import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../service/apiAuth";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";
import { logInSchema } from "@/lib/types";
import type { TSLogInSchema } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { AlertCircleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

function Login() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TSLogInSchema>({
    resolver: zodResolver(logInSchema),
  });

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (data: TSLogInSchema) => login(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      navigate("/dashboard");
    },
    onError: (err: any) => {
      console.error("Login failed:", err.message);
    },
  });

  const onSubmit = (data: TSLogInSchema) => {
    mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bacgorund">
      <div className={"absolute top-4 right-4"}>
        <ThemeToggle />
      </div>
      <div className="w-[50%] flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold mb-6 text-center">Welcome back</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <Input type="email" placeholder="Email" {...register("email")} />
          {errors.email && (
            <Alert variant="destructive">
              <AlertCircleIcon />
              <AlertTitle>{errors.email.message}.</AlertTitle>
            </Alert>
          )}

          <Input
            {...register("password")}
            type="password"
            placeholder="Password"
          />
          {errors.password && (
            <Alert variant="destructive">
              <AlertCircleIcon />
              <AlertTitle>{errors.password.message}</AlertTitle>
              <AlertDescription>
                <p>Please correct your password.</p>
              </AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="cursor-pointer text-text  tracking-wide  font-semibold"
          >
            {isPending ? "Logging in..." : "Log in"}
          </Button>
          <div className="min-h-[60px]">
            {isError && (
              <Alert variant="destructive" className="relative">
                <AlertCircleIcon className="h-4 w-4" />
                <AlertTitle>Login Failed</AlertTitle>
                <AlertDescription></AlertDescription>
              </Alert>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
