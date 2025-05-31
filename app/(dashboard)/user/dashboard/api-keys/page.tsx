"use client";

import React, { useState } from "react";
import ApiKeysList from "@/components/user/dashboard/api-keys/ApiKeysList";
import ErrorGuide from "@/components/user/dashboard/api-keys/ErrorGuide";
import CreateApiKeyModal from "@/components/user/dashboard/api-keys/modals/CreateApiKeyModal";


export default function ApiKeysPage() {
  const [activeTab, setActiveTab] = useState("keys"); // keys, guide, errors
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);


  const handleCreateKey = async (expiresInDays: number) => {
  if (!newKeyName.trim()) {
    alert("API 키 이름을 입력해주세요.");
    return;
  }
  setIsGenerating(true);
  try {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    const response = await fetch("/api/user/api-keys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({
        name: newKeyName,
        expiresAt: expiresAt.toISOString(),
      }),
    });

    if (!response.ok) throw new Error("API 키 생성 실패");

    const data = await response.json();
    console.log("API 키 생성 응답 데이터:", data);
    console.log("API 키 생성 성공:", data);

    setIsModalOpen(false);
    setNewKeyName("");
    // API 키 목록 갱신 로직 호출
  } catch (error) {
    console.error("API 키 생성 중 오류:", error);
    alert("API 키 생성에 실패했습니다. 다시 시도해주세요.");
  } finally {
    setIsGenerating(false);
  }
};

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
      {activeTab === "keys" && (
        <div>
          <ApiKeysList/>
          <button
            className="mt-4 px-4 py-2 bg-[#0067AC] text-white rounded-md"
            onClick={() => setIsModalOpen(true)}
          >
            새 API 키 생성
          </button>
        </div>
      )}
      {activeTab === "errors" && <ErrorGuide/>}

      {/* Create API Key Modal */}
      <CreateApiKeyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        newKeyName={newKeyName}
        setNewKeyName={setNewKeyName}
        onCreateKey={handleCreateKey}
        isGenerating={isGenerating}
      />
    </div>
  );
}