"use client";

import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      // 전체 페이지 수가 5 이하이면 모든 페이지 번호를 표시
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }

    } else {
      // 처음, 마지막 페이지와 현재 페이지 주변만 표시하고 나머지는 생략 부호(...)로 표시
      if (currentPage > 3) pages.push(1, "...");
      for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push("...", totalPages);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center bg-[#F6FBFF] px-6 py-3">
      <div className="flex items-center gap-2">
        {/* 첫 페이지 버튼 */}
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(1)}
          className="inline-flex items-center justify-center rounded-md border border-[#CDE5FF] bg-white px-3 py-1 text-[#0067AC] hover:bg-[#F6FBFF] disabled:opacity-40"
        >
          &laquo; {/* 첫 페이지 */}
        </button>

        {/* 이전 페이지 버튼 */}
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="inline-flex items-center justify-center rounded-md border border-[#CDE5FF] bg-white px-3 py-1 text-[#0067AC] hover:bg-[#F6FBFF] disabled:opacity-40"
        >
          &lt; {/* 이전 페이지 */}
        </button>

        {/* 페이지 번호 버튼 */}
        {getPageNumbers().map((page, index) =>
          typeof page === "number" ? (
            <button
              key={index}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 rounded-md ${
                page === currentPage
                  ? "bg-[#0067AC] text-white"
                  : "bg-white border border-[#CDE5FF] text-[#0067AC] hover:bg-[#F6FBFF]"
              }`}
            >
              {page}
            </button>
          ) : (
            <span key={index} className="px-3 py-1 text-[#5E99D6]">
              {page} {/* 생략 부호 */}
            </span>
          )
        )}

        {/* 다음 페이지 버튼 */}
        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="inline-flex items-center justify-center rounded-md border border-[#CDE5FF] bg-white px-3 py-1 text-[#0067AC] hover:bg-[#F6FBFF] disabled:opacity-40"
        >
          &gt; {/* 다음 페이지 */}
        </button>

        {/* 마지막 페이지 버튼 */}
        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(totalPages)}
          className="inline-flex items-center justify-center rounded-md border border-[#CDE5FF] bg-white px-3 py-1 text-[#0067AC] hover:bg-[#F6FBFF] disabled:opacity-40"
        >
          &raquo; {/* 마지막 페이지 */}
        </button>
      </div>
    </div>
  );
}
