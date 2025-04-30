"use client";

import React, { useState } from "react";
import {
  ArrowDownUp,
  Check,
  Clock,
  FileDown,
  Filter,
  Search,
  X,
} from "lucide-react";
import Pagination from "@/components/ui/Pagination"; // Import the Pagination component

// Mock transaction data
const mockTransactions = [
  {
    id: "txn_1234567890",
    amount: 15000,
    status: "success",
    method: "card",
    date: "2023-05-15T14:23:45",
    customer: "홍길동",
  },
  {
    id: "txn_2345678901",
    amount: 25000,
    status: "success",
    method: "vbank",
    date: "2023-05-14T09:12:30",
    customer: "김철수",
  },
  {
    id: "txn_3456789012",
    amount: 8000,
    status: "failed",
    method: "card",
    date: "2023-05-14T18:45:22",
    customer: "이영희",
  },
  {
    id: "txn_4567890123",
    amount: 32000,
    status: "success",
    method: "card",
    date: "2023-05-13T11:05:17",
    customer: "박민수",
  },
  {
    id: "txn_5678901234",
    amount: 45000,
    status: "pending",
    method: "vbank",
    date: "2023-05-12T16:30:10",
    customer: "정지훈",
  },
];

export default function UserTransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [filters, setFilters] = useState({
    status: [],
    method: [],
  });

  // Sort and filter transactions
  const sortedTransactions = [...mockTransactions].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const filteredTransactions = sortedTransactions.filter((txn) => {
    // Search filter
    const matchesSearch =
      txn.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.customer.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const matchesStatus =
      filters.status.length === 0 || filters.status.includes(txn.status);

    // Method filter
    const matchesMethod =
      filters.method.length === 0 || filters.method.includes(txn.method);

    return matchesSearch && matchesStatus && matchesMethod;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTransactions.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  // Sorting handler
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Filter handlers
  const toggleStatusFilter = (status) => {
    setFilters((prev) => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter((s) => s !== status)
        : [...prev.status, status],
    }));
  };

  const toggleMethodFilter = (method) => {
    setFilters((prev) => ({
      ...prev,
      method: prev.method.includes(method)
        ? prev.method.filter((m) => m !== method)
        : [...prev.method, method],
    }));
  };

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">내 트랜잭션 로그</h1>
        <p className="text-[#5E99D6] mt-1">
          요청한 결제 트랜잭션 기록을 확인합니다.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5E99D6]" />
            <input
              type="text"
              placeholder="트랜잭션 ID 또는 고객명 검색"
              className="pl-10 pr-4 py-2 border border-[#CDE5FF] rounded-md w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-[#81B9F8]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative">
            <button
              className="inline-flex items-center gap-2 px-4 py-2 border border-[#CDE5FF] rounded-md hover:bg-[#F6FBFF]"
              onClick={() => setShowFilterMenu(!showFilterMenu)}
            >
              <Filter className="h-4 w-4 text-[#5E99D6]" />
              필터
              {(filters.status.length > 0 || filters.method.length > 0) && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0067AC] text-[10px] text-white">
                  {filters.status.length + filters.method.length}
                </span>
              )}
            </button>

            {showFilterMenu && (
              <div className="absolute top-full mt-1 left-0 z-10 w-72 bg-white rounded-md border border-[#CDE5FF] p-4 shadow-md">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium">필터</h4>
                  <button
                    className="text-[#5E99D6] text-sm hover:underline"
                    onClick={() => setFilters({ status: [], method: [] })}
                  >
                    초기화
                  </button>
                </div>

                <div className="mb-4">
                  <h5 className="text-sm font-medium mb-2">상태</h5>
                  <div className="flex flex-wrap gap-2">
                    {["success", "failed", "pending"].map((status) => (
                      <button
                        key={status}
                        className={`px-3 py-1 rounded-full text-xs ${
                          filters.status.includes(status)
                            ? "bg-[#0067AC] text-white"
                            : "bg-[#F6FBFF] text-[#5E99D6] border border-[#CDE5FF]"
                        }`}
                        onClick={() => toggleStatusFilter(status)}
                      >
                        {status === "success"
                          ? "성공"
                          : status === "failed"
                          ? "실패"
                          : "대기중"}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-medium mb-2">결제 방법</h5>
                  <div className="flex flex-wrap gap-2">
                    {["card", "vbank"].map((method) => (
                      <button
                        key={method}
                        className={`px-3 py-1 rounded-full text-xs ${
                          filters.method.includes(method)
                            ? "bg-[#0067AC] text-white"
                            : "bg-[#F6FBFF] text-[#5E99D6] border border-[#CDE5FF]"
                        }`}
                        onClick={() => toggleMethodFilter(method)}
                      >
                        {method === "card" ? "카드" : "가상계좌"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <button className="inline-flex items-center gap-2 rounded-md bg-white border border-[#CDE5FF] px-4 py-2 text-[#0067AC] hover:bg-[#F6FBFF] transition-colors">
          <FileDown className="h-4 w-4" />
          CSV로 내보내기
        </button>
      </div>

      <div className="rounded-lg border border-[#CDE5FF] bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F6FBFF] text-left text-sm text-[#0067AC]">
              <tr>
                <th
                  className="px-6 py-3 cursor-pointer"
                  onClick={() => requestSort("id")}
                >
                  <div className="inline-flex items-center gap-1">
                    트랜잭션 ID
                    {sortConfig.key === "id" && (
                      <ArrowDownUp className="h-3 w-3" />
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-3 cursor-pointer"
                  onClick={() => requestSort("amount")}
                >
                  <div className="inline-flex items-center gap-1">
                    금액
                    {sortConfig.key === "amount" && (
                      <ArrowDownUp className="h-3 w-3" />
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-3 cursor-pointer"
                  onClick={() => requestSort("status")}
                >
                  <div className="inline-flex items-center gap-1">
                    상태
                    {sortConfig.key === "status" && (
                      <ArrowDownUp className="h-3 w-3" />
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-3 cursor-pointer"
                  onClick={() => requestSort("method")}
                >
                  <div className="inline-flex items-center gap-1">
                    결제 방법
                    {sortConfig.key === "method" && (
                      <ArrowDownUp className="h-3 w-3" />
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-3 cursor-pointer"
                  onClick={() => requestSort("date")}
                >
                  <div className="inline-flex items-center gap-1">
                    일시
                    {sortConfig.key === "date" && (
                      <ArrowDownUp className="h-3 w-3" />
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-3 cursor-pointer"
                  onClick={() => requestSort("customer")}
                >
                  <div className="inline-flex items-center gap-1">
                    고객명
                    {sortConfig.key === "customer" && (
                      <ArrowDownUp className="h-3 w-3" />
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#CDE5FF]">
              {currentItems.length > 0 ? (
                currentItems.map((txn) => (
                  <tr key={txn.id} className="hover:bg-[#F6FBFF]">
                    <td className="px-6 py-4 font-mono text-sm">{txn.id}</td>
                    <td className="px-6 py-4">
                      {txn.amount.toLocaleString()}원
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={txn.status} />
                    </td>
                    <td className="px-6 py-4">
                      {txn.method === "card"
                        ? "카드"
                        : txn.method === "vbank"
                        ? "가상계좌"
                        : txn.method}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {new Date(txn.date).toLocaleString("ko-KR")}
                    </td>
                    <td className="px-6 py-4">{txn.customer}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-[#5E99D6]"
                  >
                    트랜잭션 기록이 없거나 검색 조건과 일치하는 결과가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredTransactions.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}
