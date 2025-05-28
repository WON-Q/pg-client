"use client";

import type { ReactNode } from "react";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  ChevronDown,
  History,
  KeyIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  Radio,
  Settings,
  User,
  X,
} from "lucide-react";

interface AdminDashboardLayoutProps {
  children: ReactNode;
}

// 조건부로 클래스 이름을 조합하는 헬퍼 함수
const cn = (...classes: (string | false | null | undefined)[]): string => {
  return classes.filter(Boolean).join(" ");
};

export default function AdminDashboardLayout({ children } : AdminDashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();

  // 관리자 페이지의 주요 메뉴 경로
  const adminRoutes = [
    {
      name: "대시보드",
      path: "/admin/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "API 키 관리",
      path: "/admin/dashboard/api-keys",
      icon: <KeyIcon className="h-5 w-5" />,
    },
    {
      name: "웹훅 관리",
      path: "/admin/dashboard/webhooks",
      icon: <Radio className="h-5 w-5" />,
    },
    {
      name: "트랜잭션 로그",
      path: "/admin/dashboard/transactions",
      icon: <History className="h-5 w-5" />,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      {/* 상단 헤더 */}
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-4 md:px-6">
        {/* 사이드바가 열려있을 때 배경 오버레이 */}
        {isSidebarOpen ? (
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
        ) : null}

        {/* 모바일 메뉴 버튼 */}
        <button
          className="inline-flex items-center justify-center rounded-md border border-[#CDE5FF] bg-transparent hover:bg-[#F6FBFF] text-[#101010] h-10 w-10 md:hidden"
          onClick={() => setIsSidebarOpen(true)}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">메뉴 열기</span>
        </button>

        {/* 모바일 사이드바 */}
        {isSidebarOpen && (
          <div className="fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl p-0">
            <div className="flex h-16 items-center border-b px-6">
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-2 font-semibold"
                onClick={() => setIsSidebarOpen(false)}
              >
                <span className="text-[#0067AC] font-bold text-xl">
                  관리자 페이지
                </span>
              </Link>
              <button
                className="inline-flex items-center justify-center rounded-md bg-transparent hover:bg-[#F6FBFF] text-[#101010] h-10 w-10 ml-auto"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="grid gap-2 p-4">
              {adminRoutes.map((route) => (
                <Link
                  key={route.path}
                  href={route.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-[#F6FBFF] transition-colors",
                    pathname === route.path
                      ? "bg-[#F6FBFF] text-[#0067AC]"
                      : "text-[#5E99D6]"
                  )}
                >
                  {route.icon}
                  <span>{route.name}</span>
                </Link>
              ))}
            </nav>
          </div>
        )}

        {/* 브랜드 로고/이름 (데스크탑용) */}
        <Link
          href="/admin/dashboard"
          className="hidden md:flex items-center gap-2"
        >
          <span className="text-[#0067AC] font-bold text-xl">
            PayGate
          </span>
        </Link>

        {/* 헤더 오른쪽 영역 */}
        <div className="ml-auto flex items-center gap-4">
          {/* 사용자 드롭다운 */}
          <div className="relative">
            <button
              className="inline-flex items-center justify-center rounded-md bg-transparent hover:bg-[#F6FBFF] text-[#101010] h-8 px-3 text-sm gap-2"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#5E99D6] text-white">
                <span className="text-sm font-medium">관</span>
              </div>
              <div className="hidden md:flex flex-col items-start text-sm">
                <span>관리자</span>
              </div>
              <ChevronDown className="h-4 w-4 text-[#5E99D6]" />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full mt-1 right-0 z-50 min-w-[200px] rounded-md border border-[#CDE5FF] bg-white p-2 shadow-md">
                <div className="px-2 py-1 text-sm font-medium">관리자 계정</div>
                <div className="my-1 h-px bg-[#CDE5FF]"></div>
                <button
                  className="flex w-full items-center rounded-sm px-2 py-1 text-sm hover:bg-[#F6FBFF]"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>프로필</span>
                </button>
                <button
                  className="flex w-full items-center rounded-sm px-2 py-1 text-sm hover:bg-[#F6FBFF]"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>설정</span>
                </button>
                <div className="my-1 h-px bg-[#CDE5FF]"></div>
                <button
                  className="flex w-full items-center rounded-sm px-2 py-1 text-sm hover:bg-[#F6FBFF]"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>로그아웃</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* 데스크탑 사이드바 */}
        <aside className="hidden w-64 shrink-0 border-r md:block sticky top-16 h-[calc(100vh-4rem)]">
          <div className="flex h-full flex-col p-4 overflow-y-auto">
            <nav className="grid gap-2 text-sm flex-grow-0">
              {adminRoutes.map((route) => (
                <Link
                  key={route.path}
                  href={route.path}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-[#F6FBFF] transition-colors",
                    pathname === route.path
                      ? "bg-[#F6FBFF] text-[#0067AC]"
                      : "text-[#5E99D6]"
                  )}
                >
                  {route.icon}
                  <span>{route.name}</span>
                </Link>
              ))}
            </nav>
            <div className="flex-grow"></div>
            <div className="pt-4">
              {/* 고객센터 섹션 */}
              <div className="rounded-lg border border-[#CDE5FF] bg-white p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0067AC]">
                    <span className="text-xs font-bold text-white">?</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium">
                      도움이 필요하신가요?
                    </div>
                    <div className="text-xs text-[#5E99D6]">
                      고객센터에 문의하세요
                    </div>
                  </div>
                </div>
                <button className="mt-4 w-full inline-flex items-center justify-center rounded-md border border-[#CDE5FF] bg-transparent hover:bg-[#F6FBFF] text-[#101010] h-8 px-3 text-sm">
                  고객센터
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* 메인 콘텐츠 */}
        <main className="flex-1 overflow-y-auto p-4 bg-[#F6FBFF]">
          {children}
        </main>
      </div>
    </div>
  );
}
