"use client";

import React, { useState } from "react";
import ApiKeysList from "@/components/user/dashboard/api-keys/ApiKeysList";

export default function ApiKeysPage() {
  const [activeTab, setActiveTab] = useState("keys"); // keys, guide, errors

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">API 키 관리</h1>
        <p className="text-[#5E99D6] mt-1">
          결제 시스템에 연동하기 위한 API 키를 관리합니다.
        </p>
      </div>

      {/* 탭 메뉴 */}
      <div className="border-b border-[#CDE5FF]">
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 ${
              activeTab === "keys"
                ? "border-b-2 border-[#0067AC] text-[#0067AC] font-medium"
                : "text-[#5E99D6]"
            }`}
            onClick={() => setActiveTab("keys")}
          >
            API 키 목록
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === "errors"
                ? "border-b-2 border-[#0067AC] text-[#0067AC] font-medium"
                : "text-[#5E99D6]"
            }`}
            onClick={() => setActiveTab("errors")}
          >
            에러 가이드
          </button>
        </div>
      </div>

      {/* 탭 컨텐츠 */}
      {activeTab === "keys" && <ApiKeysList />}
    </div>
  );
}
