"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BaseResponse, LoginResponseDto } from "@/types/api";

/**
 * 로그인 페이지
 */
export default function Login() {
  const [email, setEmail] = useState(""); // 이메일 (ID)
  const [password, setPassword] = useState(""); // 비밀번호
  const [isAdmin, setIsAdmin] = useState(false); // 관리자 여부
  const [errorMessage, setErrorMessage] = useState(""); // 에러 메시지
  const router = useRouter(); // Next.js 라우터

  /**
   * 로그인 폼 제출 처리 함수
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(""); // 에러 메시지 초기화

    try {
      // 관리자와 사용자 로그인 엔드포인트 분기
      const endpoint = isAdmin
        ? "/api/auth/login/admin"
        : "/api/auth/login/user";

      // 로그인 요청
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      // 응답 데이터 추출
      const data = await response.json() as BaseResponse<LoginResponseDto>;
      console.log("로그인 응답 데이터:", data);

      // 로그인 실패 시
      if (!response.ok) {
        throw new Error(data.message || "로그인 실패");
      }

      // 로그인 성공 시 토큰 저장
      localStorage.clear(); // 기존 로컬 스토리지 데이터 초기화
      localStorage.setItem("tokenType", data.data?.token.tokenType || "");
      localStorage.setItem("accessToken", data.data?.token.accessToken || "");
      localStorage.setItem("refreshToken", data.data?.token.refreshToken || "");

      // 로그인 성공 시 대시보드로 라우팅
      if (isAdmin) {
        router.push("/admin/dashboard");
      } else {
        router.push("/user/dashboard");
      }

    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  /**
   * 사용자/관리자 로그인 모드 전환 함수
   * <br />
   * 모드 전환 시 입력 필드를 초기화합니다.
   */
  const toggleLoginType = () => {
    setIsAdmin(!isAdmin);
    // 사용자/관리자 전환에 따라 이메일과 비밀번호 초기화
    setEmail("");
    setPassword("");
    setErrorMessage(""); // 에러 메시지 초기화
  };

  /**
   * 사용자/관리자에 따른 이메일 placeholder
   * <br />
   * 관리자일 경우 admin@paygate.com, 사용자일 경우 user@example.com
   */
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
        <div className="flex justify-center mb-8">
          <div
            className="relative bg-[#F6FBFF] border border-[#0067AC] rounded-full h-10 w-64 p-1 cursor-pointer"
            onClick={toggleLoginType}
          >
            <div
              className="absolute top-1 h-8 w-[49%] bg-[#0067AC] rounded-full transition-all duration-300 ease-in-out"
              style={{ left: isAdmin ? "50%" : "1%" }}
            ></div>

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

          {errorMessage && (
            <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
          )}

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
