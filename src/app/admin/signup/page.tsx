"use client"
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { api_url } from "../../../../utils/apiCall";
import { toast } from "sonner";
import { useUserStore } from "../../../../store/useUserStore";

export default function Signup() {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameRegex = /^[a-zA-Z\s]+$/;

    if (!nameRegex.test(name)) {
      toast.error("Name should contain only letters and spaces.");
      return;
    }

    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    // if (password.length < 8) {
    //   toast.error("Password must be at least 8 characters long.");
    //   return;
    // }

    try {
      const res = await axios.post(`${api_url}superAdmin/signup`, {
        name,
        email,
        password,
      });

      const { token, userDetails, message } = res.data;

      sessionStorage.setItem("token", token);
      setUser(userDetails);

      toast.success(message || "Signup successful!");
      router.push("/admin/dashboard");
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      const backendMessage =
        error.response?.data?.message || "Signup failed. Please try again.";
      toast.error(backendMessage);
      console.error("Signup Error:", backendMessage);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <form
        onSubmit={handleSignup}
        className="bg-gray-100 p-6 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

        {/* Name */}
        <div className="flex items-center border rounded mb-4 bg-white">
          <User className="w-5 h-5 mx-3 text-gray-500" />
          <input
            type="text"
            placeholder="Full Name"
            className="flex-1 p-2 outline-none text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

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
          Sign Up
        </button>
      </form>
    </div>
  );
}
