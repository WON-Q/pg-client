"use client";

import React, { useState, useEffect } from "react";
import { FileDown, Filter, Search, Trash2 } from "lucide-react";
import Pagination from "@/components/ui/Pagination";
import { exportToCsv } from "@/utils/csvExport";
import { BaseResponse, Page } from "@/types/api";
import { ApiKeyResponseDto } from "@/app/api/admin/api-keys/route"

export default function AdminApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<ApiKeyResponseDto[]>([]); // API 키 목록
  const [searchTerm, setSearchTerm] = useState(""); // 검색어
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 (UI 표시용, 1부터 시작)
  const [itemsPerPage] = useState(10); // 페이지당 항목 수
  const [filters, setFilters] = useState<{ isActive: boolean | null }>({
    isActive: null,
  }); // 상태 필터
  const [showFilterMenu, setShowFilterMenu] = useState(false); // 필터 메뉴 표시 여부
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [totalPages, setTotalPages] = useState(0); // 총 페이지 수
  const [error, setError] = useState<string | null>(null); // 에러 메시지

  // API에서 API 키 목록 조회
  useEffect(() => {
    const fetchApiKeys = async () => {
      setLoading(true);
      setError(null);

      try {
        // localStorage에서 액세스 토큰 가져오기
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          setError("로그인이 필요합니다");
          setLoading(false);
          return;
        }

        // API 요청 (페이지 번호는 백엔드에서 0부터 시작)
        const response = await fetch(
          `/api/admin/api-keys?page=${currentPage - 1}&size=${itemsPerPage}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`API 키 목록 조회 실패: ${response.status}`);
        }

        const result = await response.json() as BaseResponse<Page<ApiKeyResponseDto>>;
        console.log("API 키 목록 조회 결과:", result);

        if (!result.isSuccess) {
          throw new Error(result.message || "API 키 목록 조회에 실패했습니다");
        }

        // 페이지 정보 설정
        if (result.data) {
          setApiKeys(result.data.content);
          setTotalPages(result.data.totalPages);
        }

      } catch (err) {
        console.error("API 키 목록 조회 중 오류 발생:", err);
        setError(
          err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApiKeys();
  }, [currentPage, itemsPerPage]);

  // API 키 삭제 핸들러
  const handleDelete = async (id: number) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setError("로그인이 필요합니다");
        return;
      }

      const response = await fetch(`/api/admin/api-keys/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`API 키 삭제 실패: ${response.status}`);
      }

      // 삭제 성공 시 목록에서 제거
      setApiKeys(apiKeys.filter((key) => key.id !== id));

    } catch (err) {
      console.error("API 키 삭제 중 오류 발생:", err);
      setError(
        err instanceof Error
          ? err.message
          : "API 키 삭제 중 오류가 발생했습니다"
      );
    }
  };

  // 검색어 및 필터에 따라 필터링된 API 키 목록
  const filteredApiKeys = apiKeys.filter((key) => {
    const matchesSearch =
      key.merchantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      key.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      key.accessKey.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filters.isActive === null || filters.isActive === key.active;

    return matchesSearch && matchesStatus;
  });

  // CSV로 내보내기
  const handleExportToCsv = () => {
    exportToCsv(
      filteredApiKeys,
      [
        { header: "ID", accessor: "id" },
        { header: "가맹점", accessor: "merchantName" },
        { header: "API Key 이름", accessor: "name" },
        { header: "Access Key", accessor: "accessKey" },
        {
          header: "상태",
          accessor: (item) => (item.isActive ? "활성" : "비활성"),
        },
        {
          header: "발급일",
          accessor: (item) => formatDate(new Date(item.issuedAt)),
        },
        {
          header: "최근 사용일",
          accessor: (item) =>
            item.lastUsed ? formatDate(new Date(item.lastUsed)) : "-",
        },
        {
          header: "만료일",
          accessor: (item) =>
            item.expiresAt ? formatDate(new Date(item.expiresAt)) : "-",
        },
      ],
      "api_keys"
    );
  };

  // 날짜 포맷 함수
  const formatDate = (date: Date | null) =>
    date ? new Intl.DateTimeFormat("ko-KR").format(date) : "-";

  // 필터 상태 설정 함수
  const setStatusFilter = (isActive: boolean | null) => {
    setFilters({ isActive });
    setShowFilterMenu(false);
  };

  return (
    <div className="space-y-6">
      {/* 제목 */}
      <div>
        <h1 className="text-2xl font-bold">관리자 API 키 관리</h1>
        <p className="text-[#5E99D6] mt-1">
          모든 가맹점의 API 키를 한눈에 확인하고 관리합니다.
        </p>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
          {error}
        </div>
      )}

      {/* 상단 필터 및 검색바 */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-2">
          {/* 검색창 */}
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

          {/* 필터 버튼 */}
          <div className="relative">
            <button
              className="inline-flex items-center gap-2 px-4 py-2 border border-[#CDE5FF] rounded-md hover:bg-[#F6FBFF]"
              onClick={() => setShowFilterMenu(!showFilterMenu)}
            >
              <Filter className="h-4 w-4 text-[#5E99D6]" />
              필터
              {filters.isActive !== null && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0067AC] text-[10px] text-white">
                  1
                </span>
              )}
            </button>

            {/* 필터 드롭다운 */}
            {showFilterMenu && (
              <div className="absolute top-full mt-1 left-0 z-10 w-72 bg-white rounded-md border border-[#CDE5FF] p-4 shadow-md">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium">필터</h4>
                  <button
                    className="text-[#5E99D6] text-sm hover:underline"
                    onClick={() => setStatusFilter(null)}
                  >
                    초기화
                  </button>
                </div>
                <div>
                  <h5 className="text-sm font-medium mb-2">상태</h5>
                  <div className="flex flex-wrap gap-2">
                    <button
                      className={`px-3 py-1 rounded-full text-xs ${
                        filters.isActive === true
                          ? "bg-[#0067AC] text-white"
                          : "bg-[#F6FBFF] text-[#5E99D6] border border-[#CDE5FF]"
                      }`}
                      onClick={() => setStatusFilter(true)}
                    >
                      활성
                    </button>
                    <button
                      className={`px-3 py-1 rounded-full text-xs ${
                        filters.isActive === false
                          ? "bg-[#0067AC] text-white"
                          : "bg-[#F6FBFF] text-[#5E99D6] border border-[#CDE5FF]"
                      }`}
                      onClick={() => setStatusFilter(false)}
                    >
                      비활성
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CSV 내보내기 버튼 */}
        <button
          onClick={handleExportToCsv}
          className="inline-flex items-center gap-2 rounded-md bg-white border border-[#CDE5FF] px-4 py-2 text-[#0067AC] hover:bg-[#F6FBFF] transition-colors"
          disabled={loading || filteredApiKeys.length === 0}
        >
          <FileDown className="h-4 w-4" />
          CSV로 내보내기
        </button>
      </div>

      {/* 테이블 */}
      <div className="bg-white rounded-lg border border-[#CDE5FF] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#F6FBFF]">
              <th className="px-4 py-2 text-center">ID</th>
              <th className="px-4 py-2">가맹점</th>
              <th className="px-4 py-2">API Key 이름</th>
              <th className="px-4 py-2">Access Key</th>
              <th className="px-4 py-2 text-center">상태</th>
              <th className="px-4 py-2 text-center">발급일</th>
              <th className="px-4 py-2 text-center">최근 사용일</th>
              <th className="px-4 py-2 text-center">만료일</th>
              <th className="px-4 py-2 text-center">삭제</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#CDE5FF]">
            {loading ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                  데이터를 불러오는 중입니다...
                </td>
              </tr>
            ) : filteredApiKeys.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                  {searchTerm || filters.isActive !== null
                    ? "검색 조건에 맞는 API 키가 없습니다."
                    : "등록된 API 키가 없습니다."}
                </td>
              </tr>
            ) : (
              filteredApiKeys.map((key) => (
                <tr key={key.id}>
                  <td className="px-4 py-2 text-center">{key.id}</td>
                  <td className="px-4 py-2">{key.merchantName}</td>
                  <td className="px-4 py-2">{key.name}</td>
                  <td className="px-4 py-2">{key.accessKey}</td>
                  <td
                    className={`px-4 py-2 text-center ${
                      key.active ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {key.active ? "활성" : "비활성"}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {formatDate(new Date(key.issuedAt))}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {key.lastUsed ? formatDate(new Date(key.lastUsed)) : "-"}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {key.expiresAt ? formatDate(new Date(key.expiresAt)) : "-"}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => handleDelete(key.id)}
                      className="text-red-500 hover:text-red-700 disabled:opacity-50"
                      disabled={loading}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      {!loading && totalPages > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
