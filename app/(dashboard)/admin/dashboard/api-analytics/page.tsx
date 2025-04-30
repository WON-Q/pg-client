"use client";

import React, { useState } from "react";
import { FileDown } from "lucide-react";

// Mock data for API keys
const mockApiKeys = [
  { merchant: "가맹점 A", accessKey: "access_key_123" },
  { merchant: "가맹점 B", accessKey: "access_key_456" },
  { merchant: "가맹점 C", accessKey: "access_key_789" },
];

export default function ApiAnalyticsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredKeys = mockApiKeys.filter(
    (key) =>
      key.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      key.accessKey.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportToCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Merchant,Access Key"]
        .concat(filteredKeys.map((key) => `${key.merchant},${key.accessKey}`))
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "api_keys.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">API 사용 분석</h1>
        <p className="text-[#5E99D6] mt-1">API 사용 통계를 확인합니다.</p>
      </div>

      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="가맹점 또는 Access Key 검색"
          className="px-4 py-2 border border-[#CDE5FF] rounded-md w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-[#81B9F8]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={exportToCSV}
          className="inline-flex items-center gap-2 rounded-md bg-white border border-[#CDE5FF] px-4 py-2 text-[#0067AC] hover:bg-[#F6FBFF] transition-colors"
        >
          <FileDown className="h-4 w-4" />
          CSV로 내보내기
        </button>
      </div>

      <div className="rounded-lg border border-[#CDE5FF] bg-white overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#F6FBFF] text-left text-sm text-[#0067AC]">
            <tr>
              <th className="px-6 py-3">가맹점</th>
              <th className="px-6 py-3">Access Key</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#CDE5FF]">
            {filteredKeys.length > 0 ? (
              filteredKeys.map((key, index) => (
                <tr key={index} className="hover:bg-[#F6FBFF]">
                  <td className="px-6 py-4">{key.merchant}</td>
                  <td className="px-6 py-4 font-mono">{key.accessKey}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={2}
                  className="px-6 py-8 text-center text-[#5E99D6]"
                >
                  검색 조건과 일치하는 결과가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
