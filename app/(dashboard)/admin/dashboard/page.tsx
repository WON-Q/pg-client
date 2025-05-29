"use client";

import React from "react";
import {
  Users,
  BarChart3,
  Check,
  X,
  Clock,
  PieChart,
  ChevronRight,
  ArrowUp,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Mock data for admin metrics
const adminMetrics = {
  totalUsers: 12456,
  activeUsers: 8923,
  newUsers: 342,
  churnRate: 1.2,
};

// Mock data for today's revenue
const todayRevenue = {
  amount: 42567890, // in KRW
  growth: 15, // percentage growth compared to yesterday
};

// Mock data for user activity chart
const userActivityData = [
  { date: "03/20", active: 8000, new: 300 },
  { date: "03/21", active: 8500, new: 320 },
  { date: "03/22", active: 8700, new: 340 },
  { date: "03/23", active: 8900, new: 360 },
  { date: "03/24", active: 9100, new: 380 },
  { date: "03/25", active: 9300, new: 400 },
  { date: "03/26", active: 9500, new: 420 },
];

// Admin dashboard page
export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">관리자 대시보드</h1>
        <p className="text-[#5E99D6] mt-1">
          사용자 및 서비스 현황을 한눈에 확인하세요.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="bg-white rounded-lg border border-[#CDE5FF] p-4 shadow-sm">
          <div className="flex flex-row items-center justify-between pb-2">
            <p className="text-sm font-medium text-[#5E99D6]">총 사용자 수</p>
            <Users className="h-4 w-4 text-[#0067AC]" />
          </div>
          <div>
            <div className="text-2xl font-bold">{adminMetrics.totalUsers}</div>
          </div>
        </div>

        {/* Active Users */}
        <div className="bg-white rounded-lg border border-[#CDE5FF] p-4 shadow-sm">
          <div className="flex flex-row items-center justify-between pb-2">
            <p className="text-sm font-medium text-[#5E99D6]">활성 사용자 수</p>
            <Check className="h-4 w-4 text-green-500" />
          </div>
          <div>
            <div className="text-2xl font-bold">{adminMetrics.activeUsers}</div>
          </div>
        </div>

        {/* New Users */}
        <div className="bg-white rounded-lg border border-[#CDE5FF] p-4 shadow-sm">
          <div className="flex flex-row items-center justify-between pb-2">
            <p className="text-sm font-medium text-[#5E99D6]">신규 사용자 수</p>
            <PieChart className="h-4 w-4 text-[#0067AC]" />
          </div>
          <div>
            <div className="text-2xl font-bold">{adminMetrics.newUsers}</div>
          </div>
        </div>

        {/* Churn Rate */}
        <div className="bg-white rounded-lg border border-[#CDE5FF] p-4 shadow-sm">
          <div className="flex flex-row items-center justify-between pb-2">
            <p className="text-sm font-medium text-[#5E99D6]">이탈률</p>
            <X className="h-4 w-4 text-red-500" />
          </div>
          <div>
            <div className="text-2xl font-bold">{adminMetrics.churnRate}%</div>
          </div>
        </div>

        {/* Today's Revenue */}
        <div className="bg-white rounded-lg border border-[#CDE5FF] p-4 shadow-sm">
          <div className="flex flex-row items-center justify-between pb-2">
            <p className="text-sm font-medium text-[#5E99D6]">오늘의 수익</p>
            <BarChart3 className="h-4 w-4 text-[#0067AC]" />
          </div>
          <div>
            <div className="text-2xl font-bold">
              ₩{todayRevenue.amount.toLocaleString()}
            </div>
            <div className="flex items-center pt-1 text-xs text-[#5E99D6]">
              <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500 mr-1">
                {todayRevenue.growth}%
              </span>
              <span>전일 대비</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        {/* User Activity Chart */}
        <div className="lg:col-span-4 bg-white rounded-lg border border-[#CDE5FF] p-4 shadow-sm">
          <div className="mb-2">
            <h3 className="font-medium">사용자 활동 추이</h3>
            <p className="text-sm text-[#5E99D6]">최근 7일간의 사용자 활동</p>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={userActivityData}
                margin={{
                  top: 5,
                  right: 20,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#CDE5FF" />
                <XAxis dataKey="date" stroke="#5E99D6" />
                <YAxis stroke="#5E99D6" />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="active"
                  stroke="#0067AC"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="new"
                  stroke="#81B9F8"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Management */}
        <div className="lg:col-span-3 bg-white rounded-lg border border-[#CDE5FF] shadow-sm">
          <div className="p-4 border-b border-[#CDE5FF]">
            <h3 className="font-medium">사용자 관리</h3>
            <p className="text-sm text-[#5E99D6]">사용자 목록 및 관리</p>
          </div>
          <div className="p-4">
            <a
              href="/admin/dashboard/users"
              className="flex items-center justify-center text-[#0067AC] hover:underline text-sm"
            >
              사용자 관리 페이지로 이동
              <ChevronRight className="ml-1 h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}