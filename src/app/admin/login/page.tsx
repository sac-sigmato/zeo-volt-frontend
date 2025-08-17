"use client"
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { api_url } from "../../../../utils/apiCall";
import { useUserStore } from "../../../../store/useUserStore";
import { FormEvent, useState } from "react";

export default function Login() {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${api_url}super/sub/admin/login`, {
        email,
        password,
      });

      const { token, userDetails, message } = res.data;

      sessionStorage.setItem("token", token);
      setUser(userDetails);

      toast.success(message || "Login successful!");
      router.push("/admin/dashboard");
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      const errorMsg =
        error.response?.data?.message || "Login failed. Please try again.";
      toast.error(errorMsg);
      console.error("Login Error:", errorMsg);
    }
  };
  return (
    <>
      <div className="flex items-center justify-center h-screen bg-white">
        <form
          onSubmit={handleLogin}
          className="bg-gray-100 p-6 rounded-lg shadow-md w-full max-w-sm"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

          {/* Email */}
          <div className="flex items-center border rounded mb-4 bg-white">
            <Mail className="w-5 h-5 mx-3 text-gray-500" />
            <input
              type="email"
              placeholder="Email"
              className="flex-1 p-2 outline-none text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="flex items-center border rounded mb-4 bg-white relative">
            <Lock className="w-5 h-5 mx-3 text-gray-500" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="flex-1 p-2 outline-none text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 text-gray-500"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded text-sm font-medium hover:bg-gray-800 transition"
          >
            Login
          </button>
          <div className="text-center mt-4">
            <button
              type="button"
              className="text-sm text-blue-600 hover:underline"
              onClick={() => {
                setEmail("super.admin@gmail.com");
                setPassword("12345");
              }}
            >
              Autofill Super Admin Credentials
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
