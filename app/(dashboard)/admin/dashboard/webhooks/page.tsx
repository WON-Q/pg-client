"use client";

import React, { useState } from "react";
import {
  FileDown,
  Filter,
  Search,
  Trash2,
  CheckCircle,
  AlertCircle,
  XCircle,
  Radio,
} from "lucide-react";
import Pagination from "@/components/ui/Pagination";

// Webhook status badge component
const WebhookStatusBadge = ({ status }) => {
  let bgColor = "";
  let textColor = "";
  let label = "";

  switch (status) {
    case "active":
      bgColor = "bg-green-100";
      textColor = "text-green-800";
      label = "활성";
      break;
    case "inactive":
      bgColor = "bg-gray-100";
      textColor = "text-gray-800";
      label = "비활성";
      break;
    case "failed":
      bgColor = "bg-red-100";
      textColor = "text-red-800";
      label = "실패";
      break;
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}
    >
      {label}
    </span>
  );
};

// Mock webhook data
const generateMockWebhooks = (count) => {
  return Array.from({ length: count }, (_, i) => {
    const randomStatus = () => {
      const statuses = ["active", "inactive", "failed"];
      return statuses[Math.floor(Math.random() * statuses.length)];
    };

    const status = randomStatus();
    const failedAttempts =
      status === "failed" ? Math.floor(Math.random() * 5) + 1 : 0;
    const lastTriggeredDate =
      Math.random() > 0.2 ? new Date(2023, i % 12, (i % 28) + 1) : null;

    return {
      id: `${i + 1}`,
      merchantId: `mer_${Math.floor(i / 3) + 1}`,
      merchantName: `가맹점 ${String.fromCharCode(
        65 + (Math.floor(i / 3) % 26)
      )}`,
      name: `웹훅 ${i + 1}`,
      url: `https://example-${i}.com/webhooks`,
      eventTypes: [
        "payment.created",
        "payment.completed",
        "payment.failed",
        "payment.refunded",
        "subscription.created",
        "subscription.cancelled",
      ].slice(0, Math.floor(Math.random() * 4) + 1),
      status,
      createdAt: new Date(2023, i % 12, (i % 28) + 1),
      lastTriggered: lastTriggeredDate,
      failedAttempts,
      enabled: status !== "inactive",
    };
  });
};

const mockWebhooks = generateMockWebhooks(200);

export default function AdminWebhooksPage() {
  const [webhooks, setWebhooks] = useState(mockWebhooks);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    status: [],
    merchantId: [],
  });
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // 가맹점 고유 목록 계산
  const uniqueMerchants = [
    ...new Set(webhooks.map((webhook) => webhook.merchantId)),
  ].map((merchantId) => {
    const webhook = webhooks.find((w) => w.merchantId === merchantId);
    return {
      id: merchantId,
      name: webhook ? webhook.merchantName : "Unknown",
    };
  });

  const filteredWebhooks = webhooks.filter((webhook) => {
    const matchesSearch =
      webhook.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      webhook.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      webhook.merchantName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filters.status.length === 0 || filters.status.includes(webhook.status);

    const matchesMerchant =
      filters.merchantId.length === 0 ||
      filters.merchantId.includes(webhook.merchantId);

    return matchesSearch && matchesStatus && matchesMerchant;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredWebhooks.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredWebhooks.length / itemsPerPage);

  const handleDelete = (id) => {
    setWebhooks(webhooks.filter((webhook) => webhook.id !== id));
  };

  const exportToCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        "ID,Merchant ID,Merchant Name,Name,URL,Event Types,Status,Created At,Last Triggered,Failed Attempts,Enabled",
      ]
        .concat(
          filteredWebhooks.map(
            (webhook) =>
              `${webhook.id},${webhook.merchantId},${webhook.merchantName},${
                webhook.name
              },${webhook.url},${webhook.eventTypes.join("|")},${
                webhook.status
              },${webhook.createdAt?.toISOString()},${
                webhook.lastTriggered?.toISOString() || "-"
              },${webhook.failedAttempts},${webhook.enabled}`
          )
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "webhooks.csv");
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

  const toggleMerchantFilter = (merchantId) => {
    setFilters((prev) => ({
      ...prev,
      merchantId: prev.merchantId.includes(merchantId)
        ? prev.merchantId.filter((s) => s !== merchantId)
        : [...prev.merchantId, merchantId],
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">관리자 웹훅 관리</h1>
        <p className="text-[#5E99D6] mt-1">
          모든 가맹점의 웹훅을 한눈에 확인하고 관리합니다.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5E99D6]" />
            <input
              type="text"
              placeholder="가맹점, 웹훅 이름 또는 URL 검색"
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
              {(filters.status.length > 0 || filters.merchantId.length > 0) && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0067AC] text-[10px] text-white">
                  {filters.status.length + filters.merchantId.length}
                </span>
              )}
            </button>
            {showFilterMenu && (
              <div className="absolute top-full mt-1 left-0 z-10 w-80 bg-white rounded-md border border-[#CDE5FF] p-4 shadow-md">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium">필터</h4>
                  <button
                    className="text-[#5E99D6] text-sm hover:underline"
                    onClick={() => setFilters({ status: [], merchantId: [] })}
                  >
                    초기화
                  </button>
                </div>

                {/* Status filter */}
                <div className="mb-4">
                  <h5 className="text-sm font-medium mb-2">상태</h5>
                  <div className="flex flex-wrap gap-2">
                    {["active", "inactive", "failed"].map((status) => (
                      <button
                        key={status}
                        className={`px-3 py-1 rounded-full text-xs ${
                          filters.status.includes(status)
                            ? "bg-[#0067AC] text-white"
                            : "bg-[#F6FBFF] text-[#5E99D6] border border-[#CDE5FF]"
                        }`}
                        onClick={() => toggleStatusFilter(status)}
                      >
                        {status === "active"
                          ? "활성"
                          : status === "inactive"
                          ? "비활성"
                          : "실패"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Merchant filter */}
                <div>
                  <h5 className="text-sm font-medium mb-2">가맹점</h5>
                  <div className="max-h-40 overflow-y-auto">
                    <div className="flex flex-col gap-1">
                      {uniqueMerchants.map((merchant) => (
                        <button
                          key={merchant.id}
                          className={`px-3 py-1 text-left rounded-md text-xs ${
                            filters.merchantId.includes(merchant.id)
                              ? "bg-[#0067AC] text-white"
                              : "hover:bg-[#F6FBFF] text-[#5E99D6]"
                          }`}
                          onClick={() => toggleMerchantFilter(merchant.id)}
                        >
                          {merchant.name}
                        </button>
                      ))}
                    </div>
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
                URL
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#0067AC] uppercase tracking-wider">
                이벤트
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#0067AC] uppercase tracking-wider">
                상태
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#0067AC] uppercase tracking-wider">
                생성일
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#0067AC] uppercase tracking-wider">
                마지막 호출
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-[#0067AC] uppercase tracking-wider">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#CDE5FF]">
            {currentItems.map((webhook) => (
              <tr key={webhook.id}>
                <td className="px-6 py-4 text-sm">
                  <span className="font-mono">{webhook.id}</span>
                </td>
                <td className="px-6 py-4">
                  {webhook.merchantName}
                  <div className="text-xs text-[#5E99D6]">
                    {webhook.merchantId}
                  </div>
                </td>
                <td className="px-6 py-4 font-mono text-sm truncate max-w-[200px]">
                  <a
                    href={webhook.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0067AC] hover:underline"
                    title={webhook.url}
                  >
                    {webhook.url}
                  </a>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {webhook.eventTypes.length > 2 ? (
                      <>
                        <span className="px-2 py-0.5 text-xs bg-blue-50 text-blue-600 rounded-full">
                          {webhook.eventTypes[0]}
                        </span>
                        <span className="px-2 py-0.5 text-xs bg-blue-50 text-blue-600 rounded-full">
                          + {webhook.eventTypes.length - 1}개 더
                        </span>
                      </>
                    ) : (
                      webhook.eventTypes.map((type) => (
                        <span
                          key={type}
                          className="px-2 py-0.5 text-xs bg-blue-50 text-blue-600 rounded-full"
                        >
                          {type}
                        </span>
                      ))
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <WebhookStatusBadge status={webhook.status} />
                  {webhook.failedAttempts > 0 && (
                    <div className="text-xs text-red-600 mt-1">
                      실패: {webhook.failedAttempts}회
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">{formatDate(webhook.createdAt)}</td>
                <td className="px-6 py-4">
                  {formatDate(webhook.lastTriggered)}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    className="text-[#FA333F] hover:text-red-600"
                    onClick={() => handleDelete(webhook.id)}
                    title="웹훅 삭제"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 웹훅 통계 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-[#CDE5FF] shadow-sm">
          <div className="flex justify-between items-center">
            <p className="text-sm text-[#5E99D6]">전체 웹훅</p>
            <Radio className="h-5 w-5 text-[#5E99D6]" />
          </div>
          <p className="text-2xl font-bold mt-2">{webhooks.length}</p>
        </div>

        <div className="bg-white p-4 rounded-lg border-l-4 border border-green-500 shadow-sm">
          <div className="flex justify-between items-center">
            <p className="text-sm text-green-600">활성 웹훅</p>
            <CheckCircle className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold mt-2">
            {webhooks.filter((w) => w.status === "active").length}
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg border-l-4 border border-gray-400 shadow-sm">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">비활성 웹훅</p>
            <XCircle className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-2xl font-bold mt-2">
            {webhooks.filter((w) => w.status === "inactive").length}
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg border-l-4 border border-red-500 shadow-sm">
          <div className="flex justify-between items-center">
            <p className="text-sm text-red-600">실패한 웹훅</p>
            <AlertCircle className="h-5 w-5 text-red-500" />
          </div>
          <p className="text-2xl font-bold mt-2">
            {webhooks.filter((w) => w.status === "failed").length}
          </p>
        </div>
      </div>

      {/* Pagination */}
      {filteredWebhooks.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
