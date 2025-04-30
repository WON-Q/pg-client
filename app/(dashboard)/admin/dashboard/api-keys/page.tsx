"use client";

import React, { useState } from "react";
import { FileDown, Filter, Search, Trash2 } from "lucide-react";
import Pagination from "@/components/ui/Pagination"; // Import the new Pagination component

// Mock API keys data
const mockApiKeys = Array.from({ length: 500 }, (_, i) => ({
  id: i + 1,
  merchant: `가맹점 ${String.fromCharCode(65 + (i % 26))}`,
  apiKeyName: `API Key ${i + 1}`,
  accessKey: `AKIA${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
  status: i % 3 === 0 ? "expired" : "active",
  createdAt: new Date(2023, i % 12, (i % 28) + 1),
  lastUsed: i % 5 === 0 ? null : new Date(2023, i % 12, (i % 28) + 5),
  expiresAt: i % 3 === 0 ? new Date(2023, i % 12, (i % 28) + 10) : null,
}));

export default function AdminApiKeysPage() {
  const [apiKeys, setApiKeys] = useState(mockApiKeys);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    status: [],
  });
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const filteredApiKeys = apiKeys.filter((key) => {
    const matchesSearch =
      key.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      key.apiKeyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      key.accessKey.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filters.status.length === 0 || filters.status.includes(key.status);

    return matchesSearch && matchesStatus;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredApiKeys.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredApiKeys.length / itemsPerPage);

  const handleDelete = (id) => {
    setApiKeys(apiKeys.filter((key) => key.id !== id));
  };

  const exportToCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        "ID,Merchant,API Key Name,Access Key,Status,Created At,Last Used,Expires At",
      ]
        .concat(
          filteredApiKeys.map(
            (key) =>
              `${key.id},${key.merchant},${key.apiKeyName},${key.accessKey},${
                key.status
              },${key.createdAt?.toISOString()},${
                key.lastUsed?.toISOString() || "-"
              },${key.expiresAt?.toISOString() || "-"}`
          )
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "api_keys.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (date) =>
    date ? new Intl.DateTimeFormat("ko-KR").format(date) : "-";

  const toggleStatusFilter = (status) => {
    setFilters((prev) => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter((s) => s !== status)
        : [...prev.status, status],
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">관리자 API 키 관리</h1>
        <p className="text-[#5E99D6] mt-1">
          모든 가맹점의 API 키를 한눈에 확인하고 관리합니다.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5E99D6]" />
            <input
              type="text"
              placeholder="가맹점, API Key 이름 또는 Access Key 검색"
              className="pl-10 pr-4 py-2 border border-[#CDE5FF] rounded-md w-full sm:w-92 focus:outline-none focus:ring-2 focus:ring-[#81B9F8]"
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
              {filters.status.length > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0067AC] text-[10px] text-white">
                  {filters.status.length}
                </span>
              )}
            </button>
            {showFilterMenu && (
              <div className="absolute top-full mt-1 left-0 z-10 w-72 bg-white rounded-md border border-[#CDE5FF] p-4 shadow-md">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium">필터</h4>
                  <button
                    className="text-[#5E99D6] text-sm hover:underline"
                    onClick={() => setFilters({ status: [] })}
                  >
                    초기화
                  </button>
                </div>
                <div>
                  <h5 className="text-sm font-medium mb-2">상태</h5>
                  <div className="flex flex-wrap gap-2">
                    {["active", "expired"].map((status) => (
                      <button
                        key={status}
                        className={`px-3 py-1 rounded-full text-xs ${
                          filters.status.includes(status)
                            ? "bg-[#0067AC] text-white"
                            : "bg-[#F6FBFF] text-[#5E99D6] border border-[#CDE5FF]"
                        }`}
                        onClick={() => toggleStatusFilter(status)}
                      >
                        {status === "active" ? "활성" : "만료됨"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <button
          onClick={exportToCSV}
          className="inline-flex items-center gap-2 rounded-md bg-white border border-[#CDE5FF] px-4 py-2 text-[#0067AC] hover:bg-[#F6FBFF] transition-colors"
        >
          <FileDown className="h-4 w-4" />
          CSV로 내보내기
        </button>
      </div>

      <div className="bg-white rounded-lg border border-[#CDE5FF] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#F6FBFF]">
              <th className="px-6 py-3 text-left text-xs font-medium text-[#0067AC] uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#0067AC] uppercase tracking-wider">
                가맹점
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#0067AC] uppercase tracking-wider">
                Access Key
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#0067AC] uppercase tracking-wider">
                상태
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#0067AC] uppercase tracking-wider">
                생성일
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#0067AC] uppercase tracking-wider">
                마지막 사용 시간
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#0067AC] uppercase tracking-wider">
                만료일
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-[#0067AC] uppercase tracking-wider">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#CDE5FF]">
            {currentItems.map((key) => (
              <tr key={key.id}>
                <td className="px-6 py-4">{key.id}</td>
                <td className="px-6 py-4">{key.merchant}</td>
                <td className="px-6 py-4 font-mono text-sm truncate max-w-[150px]">
                  {key.accessKey}
                </td>
                <td className="px-6 py-4">
                  {key.status === "active" ? "활성" : "만료됨"}
                </td>
                <td className="px-6 py-4">{formatDate(key.createdAt)}</td>
                <td className="px-6 py-4">{formatDate(key.lastUsed)}</td>
                <td className="px-6 py-4">{formatDate(key.expiresAt)}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    className="text-[#FA333F] hover:text-red-600"
                    onClick={() => handleDelete(key.id)}
                    title="API 키 삭제"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredApiKeys.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
