"use client";

import React, { useState } from "react";
import {
  ArrowDownUp,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Search,
} from "lucide-react";

// Mock api-keys data
const mockTokens = [
  {
    id: 1,
    userId: "user123",
    username: "홍길동",
    email: "hong@example.com",
    accessKeyId: "AKIAIOSFODNN7EXAMPLE",
    secretKey: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
    createdAt: "2023-01-15T08:23:45",
    lastUsed: "2023-05-14T14:30:12",
    status: "active",
  },
  {
    id: 2,
    userId: "user456",
    username: "김철수",
    email: "kim@example.com",
    accessKeyId: "AKIAI44QH8DHBEXAMPLE",
    secretKey: "je7MtGbClwBF/2Zp9Utk/h3yCo8nvbEXAMPLEKEY",
    createdAt: "2023-02-22T15:10:30",
    lastUsed: "2023-05-15T09:45:23",
    status: "active",
  },
  {
    id: 3,
    userId: "user789",
    username: "이영희",
    email: "lee@example.com",
    accessKeyId: "AKIAIOSFODNN7EXAMPLE2",
    secretKey: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY2",
    createdAt: "2023-03-10T11:05:17",
    lastUsed: "2023-05-10T12:15:40",
    status: "expired",
  },
  {
    id: 4,
    userId: "user101",
    username: "박민수",
    email: "park@example.com",
    accessKeyId: "AKIAIOSFODNN7EXAMPLE3",
    secretKey: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY3",
    createdAt: "2023-04-05T09:30:22",
    lastUsed: "2023-05-12T18:20:10",
    status: "active",
  },
  {
    id: 5,
    userId: "user202",
    username: "정지훈",
    email: "jung@example.com",
    accessKeyId: "AKIAIOSFODNN7EXAMPLE4",
    secretKey: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY4",
    createdAt: "2023-04-20T14:45:33",
    lastUsed: null,
    status: "pending",
  },
];

export default function AdminTokensPage() {
  const [tokens, setTokens] = useState(mockTokens);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "desc",
  });

  // Filter api-keys
  const filteredTokens = tokens.filter(
    (token) =>
      token.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.accessKeyId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort api-keys
  const sortedTokens = [...filteredTokens].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedTokens.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedTokens.length / itemsPerPage);

  // Sorting handler
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const toggleDropdown = (tokenId) => {
    setActiveDropdown(activeDropdown === tokenId ? null : tokenId);
  };

  const handleDeleteToken = (tokenId) => {
    setTokens(tokens.filter((token) => token.id !== tokenId));
    setActiveDropdown(null);
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusStyles = {
      active: "bg-green-100 text-green-800",
      expired: "bg-gray-100 text-gray-800",
      pending: "bg-yellow-100 text-yellow-800",
      revoked: "bg-red-100 text-red-800",
    };

    const statusText = {
      active: "활성",
      expired: "만료된",
      pending: "대기중",
      revoked: "취소됨",
    };

    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
          statusStyles[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {statusText[status] || status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">관리자 API 토큰 관리</h1>
        <p className="text-[#5E99D6] mt-1">
          모든 사용자에게 발급된 API 키를 관리하고 상태를 변경할 수 있습니다.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5E99D6]" />
          <input
            type="text"
            placeholder="사용자명, 이메일, 토큰 검색"
            className="pl-10 pr-4 py-2 border border-[#CDE5FF] rounded-md w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-[#81B9F8]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="inline-flex items-center justify-center rounded-md bg-[#0067AC] px-4 py-2 text-white hover:bg-[#397AB4]">
          새 토큰 발급
        </button>
      </div>

      <div className="rounded-lg border border-[#CDE5FF] bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F6FBFF] text-left text-sm text-[#0067AC]">
              <tr>
                <th
                  className="px-6 py-3 cursor-pointer"
                  onClick={() => requestSort("username")}
                >
                  <div className="inline-flex items-center gap-1">
                    사용자
                    {sortConfig.key === "username" && (
                      <ArrowDownUp className="h-3 w-3" />
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-3 cursor-pointer"
                  onClick={() => requestSort("email")}
                >
                  <div className="inline-flex items-center gap-1">
                    이메일
                    {sortConfig.key === "email" && (
                      <ArrowDownUp className="h-3 w-3" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3">Access Key</th>
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
                  onClick={() => requestSort("createdAt")}
                >
                  <div className="inline-flex items-center gap-1">
                    생성일
                    {sortConfig.key === "createdAt" && (
                      <ArrowDownUp className="h-3 w-3" />
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-3 cursor-pointer"
                  onClick={() => requestSort("lastUsed")}
                >
                  <div className="inline-flex items-center gap-1">
                    마지막 사용
                    {sortConfig.key === "lastUsed" && (
                      <ArrowDownUp className="h-3 w-3" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3">작업</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#CDE5FF]">
              {currentItems.length > 0 ? (
                currentItems.map((token) => (
                  <tr key={token.id} className="hover:bg-[#F6FBFF]">
                    <td className="px-6 py-4">{token.username}</td>
                    <td className="px-6 py-4">{token.email}</td>
                    <td
                      className="px-6 py-4 font-mono text-xs truncate max-w-[100px]"
                      title={token.accessKeyId}
                    >
                      {token.accessKeyId}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={token.status} />
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {new Date(token.createdAt).toLocaleString("ko-KR")}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {token.lastUsed
                        ? new Date(token.lastUsed).toLocaleString("ko-KR")
                        : "사용 내역 없음"}
                    </td>
                    <td className="px-6 py-4 relative">
                      <button
                        className="text-[#5E99D6] hover:text-[#0067AC]"
                        onClick={() => toggleDropdown(token.id)}
                      >
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                      {activeDropdown === token.id && (
                        <div className="absolute right-6 mt-1 w-48 rounded-md border border-[#CDE5FF] bg-white p-2 shadow-md z-10">
                          <button
                            className="flex w-full items-center rounded-md px-3 py-2 text-sm text-[#FA333F] hover:bg-[#F6FBFF]"
                            onClick={() => handleDeleteToken(token.id)}
                          >
                            토큰 삭제
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-[#5E99D6]"
                  >
                    발급된 토큰이 없거나 검색 조건과 일치하는 결과가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {sortedTokens.length > 0 && (
          <div className="flex items-center justify-between border-t border-[#CDE5FF] bg-[#F6FBFF] px-6 py-3">
            <div className="text-sm text-[#5E99D6]">
              전체 {sortedTokens.length}개 항목 중 {indexOfFirstItem + 1} -{" "}
              {Math.min(indexOfLastItem, sortedTokens.length)}번째 표시
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="inline-flex items-center justify-center rounded-md border border-[#CDE5FF] bg-white p-1 text-[#0067AC] hover:bg-[#F6FBFF] disabled:opacity-40"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="text-sm text-[#0067AC]">
                {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="inline-flex items-center justify-center rounded-md border border-[#CDE5FF] bg-white p-1 text-[#0067AC] hover:bg-[#F6FBFF] disabled:opacity-40"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
