import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../service/apiAuth";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Mutacija za login
  const mutation = useMutation({
    mutationFn: () => login(email, password),
    onSuccess: () => {
      // Refreshujemo user-a
      queryClient.invalidateQueries({ queryKey: ["user"] });
      navigate("/dashboard"); // redirect na dashboard
    },
    onError: (err: any) => {
      console.error("Login failed:", err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-lg p-6 rounded-xl w-80">
        <h1 className="text-xl font-bold mb-4">Login</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            className="border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={mutation.isPending}
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {mutation.isPending ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {mutation.isError && (
          <p className="text-red-600 mt-2">Login failed. Try again.</p>
        )}
      </div>
    </div>
  );
}

export default Login;
