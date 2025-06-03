"use client";

import React, { useState, useEffect } from "react";
import {
  Check,
  Clock,
  FileDown,
  Filter,
  Search,
  X,
  AlertTriangle,
  Undo2,
  CreditCard,
} from "lucide-react";
import Pagination from "@/components/ui/Pagination";
import {
  BaseResponse,
  Page,
  TransactionStatus,
  PaymentMethod,
} from "@/types/api";
import { Badge } from "@/components/ui/Badge";
import { TransactionLogResponseDto } from "@/app/api/admin/transactions/route";

const STATUS_OPTIONS: TransactionStatus[] = [
  "PENDING",
  "CREATED",
  "APPROVED",
  "CANCELLED",
  "FAILED",
  "AUTH_FAILED",
  "REFUND_FAILED",
];

const METHOD_OPTIONS: PaymentMethod[] = ["APP_CARD", "WOORI_APP_CARD"];

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<TransactionLogResponseDto[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [filters, setFilters] = useState<{
    status: TransactionStatus[];
    method: PaymentMethod[];
  }>({
    status: [],
    method: [],
  });

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);

      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          setError("로그인이 필요합니다");
          return;
        }

        const res = await fetch(
          `/api/admin/transactions?page=${
            currentPage - 1
          }&size=${itemsPerPage}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!res.ok) throw new Error(`조회 실패: ${res.status}`);

        const result: BaseResponse<Page<TransactionLogResponseDto>> =
          await res.json();

        if (!result.isSuccess || !result.data) {
          throw new Error(result.message || "트랜잭션 조회 실패");
        }

        setTransactions(result.data.content);
        setTotalPages(result.data.totalPages);
      } catch (err) {
        console.error("트랜잭션 조회 실패:", err);
        setError(
          err instanceof Error
            ? err.message
            : "트랜잭션 조회 중 알 수 없는 오류 발생"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [currentPage, itemsPerPage]);

  const filteredTransactions = transactions.filter((txn) => {
    const matchesSearch =
      txn.transactionId?.includes(searchTerm) ||
      txn.merchantName?.includes(searchTerm) ||
      txn.message?.includes(searchTerm);
    const matchesStatus =
      filters.status.length === 0 || filters.status.includes(txn.status);
    const matchesMethod =
      filters.method.length === 0 || filters.method.includes(txn.method);
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const toggleStatusFilter = (status: TransactionStatus) => {
    setFilters((prev) => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter((s) => s !== status)
        : [...prev.status, status],
    }));
  };

  const toggleMethodFilter = (method: PaymentMethod) => {
    setFilters((prev) => ({
      ...prev,
      method: prev.method.includes(method)
        ? prev.method.filter((m) => m !== method)
        : [...prev.method, method],
    }));
  };

  const getStatusBadgeProps = (status: TransactionStatus) => {
    switch (status) {
      case "APPROVED":
        return {
          variant: "success" as const,
          icon: <Check className="w-3 h-3 text-green-500" />, // 초록색
          label: "승인됨",
        };
      case "FAILED":
        return {
          variant: "error" as const,
          icon: <X className="w-3 h-3 text-red-500" />, // 빨간색
          label: "실패",
        };
      case "AUTH_FAILED":
        return {
          variant: "error" as const,
          icon: <X className="w-3 h-3 text-red-500" />,
          label: "인증실패",
        };
      case "CANCELLED":
        return {
          variant: "secondary" as const,
          icon: <X className="w-3 h-3 text-gray-400" />, // 회색
          label: "취소됨",
        };
      case "REFUND_FAILED":
        return {
          variant: "warning" as const,
          icon: <Undo2 className="w-3 h-3 text-yellow-500" />, // 노란색
          label: "환불실패",
        };
      case "PENDING":
        return {
          variant: "warning" as const,
          icon: <Clock className="w-3 h-3 text-yellow-500" />,
          label: "대기중",
        };
      case "CREATED":
        return {
          variant: "primary" as const,
          icon: <AlertTriangle className="w-3 h-3 text-blue-500" />, // 파란색
          label: "생성됨",
        };
      default:
        return {
          variant: "default" as const,
          icon: null,
          label: status,
        };
    }
  };

  const getMethodBadgeProps = (method: PaymentMethod) => {
    switch (method) {
      case "APP_CARD":
        return {
          variant: "outline" as const,
          icon: <CreditCard className="w-3 h-3 text-sky-500" />, // 연파랑
          label: "앱카드",
        };
      case "WOORI_APP_CARD":
        return {
          variant: "accent" as const,
          icon: <CreditCard className="w-3 h-3 text-purple-500" />, // 보라색
          label: "우리앱카드",
        };
      default:
        return {
          variant: "default" as const,
          icon: <CreditCard className="w-3 h-3 text-gray-500" />,
          label: method,
        };
    }
  };

  const getStatusLabel = (status: TransactionStatus) => {
    const labels = {
      PENDING: "대기중",
      CREATED: "생성됨",
      APPROVED: "승인됨",
      CANCELLED: "취소됨",
      FAILED: "실패",
      AUTH_FAILED: "인증실패",
      REFUND_FAILED: "환불실패",
    };
    return labels[status] || status;
  };

  const getMethodLabel = (method: PaymentMethod) => {
    const labels = {
      APP_CARD: "앱카드",
      WOORI_APP_CARD: "우리앱카드",
    };
    return labels[method] || method;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">관리자 트랜잭션 로그</h1>
        <p className="text-[#5E99D6] mt-1">
          모든 가맹점의 결제 트랜잭션 기록을 확인합니다.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
          {error}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5E99D6]" />
            <input
              type="text"
              placeholder="트랜잭션 ID, 가맹점명, 메시지 검색"
              className="pl-10 pr-4 py-2 border border-[#CDE5FF] rounded-md w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-[#81B9F8]"
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
                <Badge variant="primary" size="xs" shape="pill">
                  {filters.status.length + filters.method.length}
                </Badge>
              )}
            </button>

            {showFilterMenu && (
              <div className="absolute top-full mt-1 left-0 z-10 w-80 bg-white rounded-md border border-[#CDE5FF] p-4 shadow-md">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium">필터</h4>
                  <button
                    className="text-[#5E99D6] text-sm hover:underline"
                    onClick={() => setFilters({ status: [], method: [] })}
                  >
                    초기화
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h5 className="text-sm font-medium mb-2">상태</h5>
                    <div className="flex flex-wrap gap-2">
                      {STATUS_OPTIONS.map((status) => (
                        <button
                          key={status}
                          className={`px-3 py-1 rounded-full text-xs transition-colors ${
                            filters.status.includes(status)
                              ? "bg-[#0067AC] text-white"
                              : "bg-[#F6FBFF] text-[#5E99D6] border border-[#CDE5FF] hover:bg-[#E6F2FF]"
                          }`}
                          onClick={() => toggleStatusFilter(status)}
                        >
                          {getStatusLabel(status)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium mb-2">결제 방법</h5>
                    <div className="flex flex-wrap gap-2">
                      {METHOD_OPTIONS.map((method) => (
                        <button
                          key={method}
                          className={`px-3 py-1 rounded-full text-xs transition-colors ${
                            filters.method.includes(method)
                              ? "bg-[#0067AC] text-white"
                              : "bg-[#F6FBFF] text-[#5E99D6] border border-[#CDE5FF] hover:bg-[#E6F2FF]"
                          }`}
                          onClick={() => toggleMethodFilter(method)}
                        >
                          {getMethodLabel(method)}
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
          className="inline-flex items-center gap-2 rounded-md bg-white border border-[#CDE5FF] px-4 py-2 text-[#0067AC] hover:bg-[#F6FBFF] transition-colors"
          disabled
        >
          <FileDown className="h-4 w-4" />
          CSV로 내보내기 (준비 중)
        </button>
      </div>

      <div className="rounded-lg border border-[#CDE5FF] bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F6FBFF] text-left text-sm text-[#0067AC]">
              <tr>
                <th className="px-6 py-3">트랜잭션 ID</th>
                <th className="px-6 py-3">가맹점</th>
                <th className="px-6 py-3">금액</th>
                <th className="px-6 py-3">상태</th>
                <th className="px-6 py-3">결제 방법</th>
                <th className="px-6 py-3">메시지</th>
                <th className="px-6 py-3">일시</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#CDE5FF]">
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-[#5E99D6]"
                  >
                    로딩 중입니다...
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-[#5E99D6]"
                  >
                    트랜잭션 기록이 없거나 검색 조건과 일치하는 결과가 없습니다.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((txn) => {
                  const statusProps = getStatusBadgeProps(txn.status);
                  const methodProps = getMethodBadgeProps(txn.method);
                  return (
                    <tr key={txn.transactionId} className="hover:bg-[#F6FBFF]">
                      <td className="px-6 py-4 font-mono text-sm">
                        {txn.transactionId}
                      </td>
                      <td className="px-6 py-4">{txn.merchantName}</td>
                      <td className="px-6 py-4 font-medium">
                        {txn.amount.toLocaleString()}원
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={statusProps.variant}
                          size="sm"
                          shape="pill"
                          leftIcon={statusProps.icon}
                        >
                          {statusProps.label}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={methodProps.variant}
                          size="sm"
                          shape="rounded"
                          leftIcon={methodProps.icon}
                        >
                          {methodProps.label}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                        {txn.message || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {new Date(txn.date).toLocaleString("ko-KR")}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {!loading && filteredTransactions.length > 0 && (
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
