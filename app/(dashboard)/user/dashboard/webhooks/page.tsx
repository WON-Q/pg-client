"use client";

import React, { useState } from "react";
import WebhookList from "@/components/user/dashboard/webhooks/WebhookList";
import WebhookGuide from "@/components/user/dashboard/webhooks/WebhookGuide";
import WebhookEventTypes from "@/components/user/dashboard/webhooks/WebhookEventTypes";

export default function WebhooksPage() {
  const [activeTab, setActiveTab] = useState("webhooks"); // webhooks, guide, events

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">웹훅 관리</h1>
        <p className="text-[#5E99D6] mt-1">
          결제 이벤트 알림을 받을 웹훅 엔드포인트를 설정합니다.
        </p>
      </div>

      {/* 탭 메뉴 */}
      <div className="border-b border-[#CDE5FF]">
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 ${
              activeTab === "webhooks"
                ? "border-b-2 border-[#0067AC] text-[#0067AC] font-medium"
                : "text-[#5E99D6]"
            }`}
            onClick={() => setActiveTab("webhooks")}
          >
            웹훅 목록
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === "guide"
                ? "border-b-2 border-[#0067AC] text-[#0067AC] font-medium"
                : "text-[#5E99D6]"
            }`}
            onClick={() => setActiveTab("guide")}
          >
            사용 가이드
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === "events"
                ? "border-b-2 border-[#0067AC] text-[#0067AC] font-medium"
                : "text-[#5E99D6]"
            }`}
            onClick={() => setActiveTab("events")}
          >
            이벤트 유형
          </button>
        </div>
      </div>

      {/* 탭 컨텐츠 */}
      {activeTab === "webhooks" && <WebhookList />}
      {activeTab === "guide" && <WebhookGuide />}
      {activeTab === "events" && <WebhookEventTypes />}
    </div>
  );
}
