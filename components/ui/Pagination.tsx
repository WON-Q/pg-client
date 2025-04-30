"use client";

import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      // Show all pages if total pages are 5 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first, last, and surrounding pages with ellipsis
      if (currentPage > 3) pages.push(1, "...");
      for (
        let i = Math.max(1, currentPage - 2);
        i <= Math.min(totalPages, currentPage + 2);
        i++
      ) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("...", totalPages);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center bg-[#F6FBFF] px-6 py-3">
      <div className="flex items-center gap-2">
        {/* First page button */}
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(1)}
          className="inline-flex items-center justify-center rounded-md border border-[#CDE5FF] bg-white px-3 py-1 text-[#0067AC] hover:bg-[#F6FBFF] disabled:opacity-40"
        >
          &laquo; {/* First page */}
        </button>

        {/* Previous page button */}
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="inline-flex items-center justify-center rounded-md border border-[#CDE5FF] bg-white px-3 py-1 text-[#0067AC] hover:bg-[#F6FBFF] disabled:opacity-40"
        >
          &lt; {/* Previous page */}
        </button>

        {/* Page numbers */}
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
              {page}
            </span>
          )
        )}

        {/* Next page button */}
        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="inline-flex items-center justify-center rounded-md border border-[#CDE5FF] bg-white px-3 py-1 text-[#0067AC] hover:bg-[#F6FBFF] disabled:opacity-40"
        >
          &gt; {/* Next page */}
        </button>

        {/* Last page button */}
        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(totalPages)}
          className="inline-flex items-center justify-center rounded-md border border-[#CDE5FF] bg-white px-3 py-1 text-[#0067AC] hover:bg-[#F6FBFF] disabled:opacity-40"
        >
          &raquo; {/* Last page */}
        </button>
      </div>
    </div>
  );
}
