"use client";

import { useState } from "react";
import Head from "next/head";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt with:", { email, password, isAdmin });
    // For a real implementation, you would call an API
  };

  const toggleLoginType = () => {
    setIsAdmin(!isAdmin);
    // Clear form when switching between user and admin
    setEmail("");
    setPassword("");
  };

  // Default placeholders based on login type
  const emailPlaceholder = isAdmin ? "admin@paygate.com" : "user@example.com";

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#F6FBFF]">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-[#0067AC]">PayGate</h1>
        <p className="mt-2 text-gray-600">
          안전하고 신뢰할 수 있는 결제 게이트웨이 솔루션
        </p>
      </div>

      <div className="p-8 rounded-lg shadow-lg w-full max-w-md bg-white">
        {/* Improved Toggle Switch */}
        <div className="flex justify-center mb-8">
          <div
            className="relative bg-[#F6FBFF] border border-[#0067AC] rounded-full h-10 w-64 p-1 cursor-pointer"
            onClick={toggleLoginType}
          >
            {/* Sliding background */}
            <div
              className="absolute top-1 h-8 w-[49%] bg-[#0067AC] rounded-full transition-all duration-300 ease-in-out"
              style={{ left: isAdmin ? "50%" : "1%" }}
            ></div>

            {/* Text labels */}
            <div className="grid grid-cols-2 h-full relative z-10">
              <div
                className={`flex items-center justify-center font-medium transition-colors ${
                  !isAdmin ? "text-white" : "text-[#0067AC]"
                }`}
              >
                사용자
              </div>
              <div
                className={`flex items-center justify-center font-medium transition-colors ${
                  isAdmin ? "text-white" : "text-[#0067AC]"
                }`}
              >
                관리자
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-2">
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-1 text-gray-700"
            >
              이메일
            </label>
            <input
              id="email"
              type="email"
              placeholder={emailPlaceholder}
              className="w-full px-3 py-2 rounded-md focus:outline-none border border-gray-300 focus:ring-2 focus:ring-[#0067AC]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-1">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                비밀번호
              </label>

              {/* Improved password reset link */}
              <Link
                href="/password-reset"
                className="text-sm font-medium text-[#0067AC] hover:text-[#397AB4] transition-colors flex items-center"
              >
                <span>비밀번호 찾기</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5 ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
            <input
              id="password"
              type="password"
              placeholder="********"
              className="w-full px-3 py-2 rounded-md focus:outline-none border border-gray-300 focus:ring-2 focus:ring-[#0067AC]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 text-white font-medium"
            style={{
              backgroundColor: "#0067AC",
              boxShadow: "0 4px 6px rgba(0, 103, 172, 0.25)",
            }}
          >
            로그인
          </button>
        </form>
      </div>

      <footer className="mt-8 text-center text-sm text-gray-500">
        © 2025 PayGate. All rights reserved.
      </footer>
    </div>
  );
}
