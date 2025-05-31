"use client";

import React, { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  CreditCard,
  DollarSign,
  Check,
  X,
  Clock,
  BarChart3,
  ChevronRight,
  CircleDollarSign,
  Hash,
  Percent,
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

// Mock data for transaction chart
const transactionData = [
  { date: "03/20", amount: 1250000, count: 42 },
  { date: "03/21", amount: 980000, count: 35 },
  { date: "03/22", amount: 1450000, count: 51 },
  { date: "03/23", amount: 1650000, count: 58 },
  { date: "03/24", amount: 2100000, count: 77 },
  { date: "03/25", amount: 1800000, count: 65 },
  { date: "03/26", amount: 2200000, count: 82 },
];

// Mock data for recent transactions
const recentTransactions = [
  {
    id: "txn_1234567890",
    amount: 15000,
    status: "success",
    method: "card",
    date: "2025-03-26T14:23:45",
    customer: "홍길동",
  },
  {
    id: "txn_2345678901",
    amount: 25000,
    status: "success",
    method: "vbank",
    date: "2025-03-26T09:12:30",
    customer: "김철수",
  },
  {
    id: "txn_3456789012",
    amount: 8000,
    status: "failed",
    method: "card",
    date: "2025-03-25T18:45:22",
    customer: "이영희",
  },
  {
    id: "txn_4567890123",
    amount: 32000,
    status: "success",
    method: "card",
    date: "2025-03-25T11:05:17",
    customer: "박민수",
  },
  {
    id: "txn_5678901234",
    amount: 45000,
    status: "success",
    method: "vbank",
    date: "2025-03-25T16:30:10",
    customer: "정지훈",
  },
];

// Status badge component
const StatusBadge = ({ status }) => {
  const statusStyles = {
    success: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
    pending: "bg-yellow-100 text-yellow-800",
  };

  const statusText = {
    success: "성공",
    failed: "실패",
    pending: "대기중",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        statusStyles[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {status === "success" && <Check className="mr-1 h-3 w-3" />}
      {status === "failed" && <X className="mr-1 h-3 w-3" />}
      {status === "pending" && <Clock className="mr-1 h-3 w-3" />}
      {statusText[status] || status}
    </span>
  );
};

// Chart component
const TransactionChart = () => {
  const [view, setView] = useState("amount");

  const formatAmount = (value) => {
    return `${(value / 10000).toFixed(0)}만원`;
  };

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <div>
          <button
            className={`px-3 py-1 text-sm rounded-md ${
              view === "amount" ? "bg-[#0067AC] text-white" : "text-[#5E99D6]"
            }`}
            onClick={() => setView("amount")}
          >
            거래액
          </button>
          <button
            className={`px-3 py-1 text-sm rounded-md ${
              view === "count" ? "bg-[#0067AC] text-white" : "text-[#5E99D6]"
            }`}
            onClick={() => setView("count")}
          >
            거래 건수
          </button>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={transactionData}
            margin={{
              top: 5,
              right: 20,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#CDE5FF" />
            <XAxis dataKey="date" stroke="#5E99D6" />
            <YAxis
              stroke="#5E99D6"
              tickFormatter={view === "amount" ? formatAmount : undefined}
            />
            <Tooltip
              formatter={(value) => {
                return view === "amount"
                  ? [`${value.toLocaleString()}원`, "거래액"]
                  : [`${value}건`, "거래 건수"];
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey={view}
              stroke="#0067AC"
              activeDot={{ r: 8 }}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default function UserDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">대시보드</h1>
        <p className="text-[#5E99D6] mt-1">
          결제 서비스 현황을 한눈에 확인하세요.
        </p>
      </div>

      {/* 메트릭 카드 목록 - 2x4 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 누적 거래액 */}
        <div className="bg-white rounded-lg border border-[#CDE5FF] p-4 shadow-sm">
          <div className="flex flex-row items-center justify-between pb-2">
            <p className="text-sm font-medium text-[#5E99D6]">누적 거래액</p>
            <CircleDollarSign className="h-4 w-4 text-[#0067AC]" />
          </div>
          <div>
            <div className="text-2xl font-bold">₩1,234,567,890</div>
            <div className="flex items-center pt-1 text-xs text-[#5E99D6]">
              <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500 mr-1">12%</span>
              <span>전월 대비</span>
            </div>
          </div>
        </div>

        {/* 누적 거래 건수 */}
        <div className="bg-white rounded-lg border border-[#CDE5FF] p-4 shadow-sm">
          <div className="flex flex-row items-center justify-between pb-2">
            <p className="text-sm font-medium text-[#5E99D6]">누적 거래 건수</p>
            <Hash className="h-4 w-4 text-[#0067AC]" />
          </div>
          <div>
            <div className="text-2xl font-bold">24,892</div>
            <div className="flex items-center pt-1 text-xs text-[#5E99D6]">
              <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500 mr-1">8%</span>
              <span>전월 대비</span>
            </div>
          </div>
        </div>

        {/* 오늘 하루 거래액 */}
        <div className="bg-white rounded-lg border border-[#CDE5FF] p-4 shadow-sm">
          <div className="flex flex-row items-center justify-between pb-2">
            <p className="text-sm font-medium text-[#5E99D6]">
              오늘 하루 거래액
            </p>
            <DollarSign className="h-4 w-4 text-[#0067AC]" />
          </div>
          <div>
            <div className="text-2xl font-bold">₩42,567,890</div>
            <div className="flex items-center pt-1 text-xs text-[#5E99D6]">
              <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500 mr-1">15%</span>
              <span>전일 대비</span>
            </div>
          </div>
        </div>

        {/* 오늘 하루 거래 건수 */}
        <div className="bg-white rounded-lg border border-[#CDE5FF] p-4 shadow-sm">
          <div className="flex flex-row items-center justify-between pb-2">
            <p className="text-sm font-medium text-[#5E99D6]">
              오늘 하루 거래 건수
            </p>
            <CreditCard className="h-4 w-4 text-[#0067AC]" />
          </div>
          <div>
            <div className="text-2xl font-bold">412</div>
            <div className="flex items-center pt-1 text-xs text-[#5E99D6]">
              <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500 mr-1">10%</span>
              <span>전일 대비</span>
            </div>
          </div>
        </div>

        {/* 평균 하루 거래액 */}
        <div className="bg-white rounded-lg border border-[#CDE5FF] p-4 shadow-sm">
          <div className="flex flex-row items-center justify-between pb-2">
            <p className="text-sm font-medium text-[#5E99D6]">
              평균 하루 거래액
            </p>
            <BarChart3 className="h-4 w-4 text-[#0067AC]" />
          </div>
          <div>
            <div className="text-2xl font-bold">₩35,842,510</div>
            <div className="flex items-center pt-1 text-xs text-[#5E99D6]">
              <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500 mr-1">5%</span>
              <span>전월 대비</span>
            </div>
          </div>
        </div>

        {/* 평균 하루 거래 건수 */}
        <div className="bg-white rounded-lg border border-[#CDE5FF] p-4 shadow-sm">
          <div className="flex flex-row items-center justify-between pb-2">
            <p className="text-sm font-medium text-[#5E99D6]">
              평균 하루 거래 건수
            </p>
            <Hash className="h-4 w-4 text-[#0067AC]" />
          </div>
          <div>
            <div className="text-2xl font-bold">347</div>
            <div className="flex items-center pt-1 text-xs text-[#5E99D6]">
              <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500 mr-1">3%</span>
              <span>전월 대비</span>
            </div>
          </div>
        </div>

        {/* 성공률 */}
        <div className="bg-white rounded-lg border border-[#CDE5FF] p-4 shadow-sm">
          <div className="flex flex-row items-center justify-between pb-2">
            <p className="text-sm font-medium text-[#5E99D6]">성공률</p>
            <Check className="h-4 w-4 text-green-500" />
          </div>
          <div>
            <div className="text-2xl font-bold">99.2%</div>
            <div className="flex items-center pt-1 text-xs text-[#5E99D6]">
              <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500 mr-1">0.3%</span>
              <span>전월 대비</span>
            </div>
          </div>
        </div>

        {/* 실패율 */}
        <div className="bg-white rounded-lg border border-[#CDE5FF] p-4 shadow-sm">
          <div className="flex flex-row items-center justify-between pb-2">
            <p className="text-sm font-medium text-[#5E99D6]">실패율</p>
            <X className="h-4 w-4 text-red-500" />
          </div>
          <div>
            <div className="text-2xl font-bold">0.8%</div>
            <div className="flex items-center pt-1 text-xs text-[#5E99D6]">
              <ArrowDown className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500 mr-1">0.3%</span>
              <span>전월 대비</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and recent transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        {/* Transaction chart */}
        <div className="lg:col-span-4 bg-white rounded-lg border border-[#CDE5FF] p-4 shadow-sm">
          <div className="mb-2">
            <h3 className="font-medium">거래 추이</h3>
            <p className="text-sm text-[#5E99D6]">최근 7일간의 거래 추이</p>
          </div>
          <TransactionChart />
        </div>

        {/* Recent transactions */}
        <div className="lg:col-span-3 bg-white rounded-lg border border-[#CDE5FF] shadow-sm">
          <div className="p-4 border-b border-[#CDE5FF]">
            <h3 className="font-medium">최근 거래</h3>
            <p className="text-sm text-[#5E99D6]">최근 발생한 거래 내역</p>
          </div>

          <div className="divide-y divide-[#CDE5FF]">
            {recentTransactions.slice(0, 5).map((txn) => (
              <div
                key={txn.id}
                className="p-4 flex justify-between items-center hover:bg-[#F6FBFF]"
              >
                <div>
                  <div className="font-medium">{txn.customer}</div>
                  <div className="text-xs text-[#5E99D6]">
                    {new Date(txn.date).toLocaleString("ko-KR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    {txn.amount.toLocaleString()}원
                  </div>
                  <div className="mt-1">
                    <StatusBadge status={txn.status} />
                  </div>
                </div>
              </div>
            ))}

            <div className="p-4">
              <a
                href="/user/dashboard/transactions"
                className="flex items-center justify-center text-[#0067AC] hover:underline text-sm"
              >
                모든 거래 내역 보기
                <ChevronRight className="ml-1 h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
