"use client";

import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Bell,
  Filter,
  Search,
  ExternalLink,
  MoreVertical,
  CheckCircle2,
  XCircle,
  RefreshCw,
  AlertCircle,
  Info,
  Calendar,
  Tag,
  Globe,
  ArrowDownUp,
  Zap,
  Copy,
  Check,
  Eye,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { WebhookStatusBadge } from "./WebhookStatusBadge";
import CreateWebhookModal from "./modals/CreateWebhookModal";
import DeleteWebhookModal from "./modals/DeleteWebhookModal";
import TestWebhookModal from "./modals/TestWebhookModal";
import WebhookHistoryModal from "./modals/WebhookHistoryModal";

// 웹훅 타입 정의
interface Webhook {
  id: string;
  name: string;
  url: string;
  secret: string;
  eventTypes: string[];
  status: "active" | "inactive" | "failed";
  createdAt: Date;
  lastTriggered: Date | null;
  failedAttempts: number;
  enabled: boolean;
}

// 웹훅 이벤트 로그 타입 정의
interface WebhookEvent {
  id: string;
  webhookId: string;
  eventType: string;
  payload: any;
  status: "success" | "failed";
  statusCode: number;
  responseTime: number;
  triggeredAt: Date;
  error?: string;
  isTest?: boolean;
}

export default function WebhookList() {
  // 웹훅 목록 관리 상태
  const [webhooks, setWebhooks] = useState<Webhook[]>([
    {
      id: "wh1",
      name: "결제 알림 웹훅",
      url: "https://example.com/payment-webhook",
      secret: "whsec_3eH7gAr92J8tKlayf6S5ZxNhwsJcGP1k",
      eventTypes: ["payment.created", "payment.completed", "payment.failed"],
      status: "active",
      createdAt: new Date("2023-05-15"),
      lastTriggered: new Date("2023-06-20"),
      failedAttempts: 0,
      enabled: true,
    },
    {
      id: "wh2",
      name: "환불 처리 웹훅",
      url: "https://example.com/refund-webhook",
      secret: "whsec_7jK9nP2sT5fR8qLmZ3xV6bC1wD4yG0hE",
      eventTypes: ["payment.refunded"],
      status: "inactive",
      createdAt: new Date("2023-06-05"),
      lastTriggered: null,
      failedAttempts: 0,
      enabled: false,
    },
    {
      id: "wh3",
      name: "오류 알림 웹훅",
      url: "https://error-domain.com/webhook",
      secret: "whsec_6bM5vS8tR2pQ9zX7cF1jN3kL4gH0dA5e",
      eventTypes: ["payment.failed", "subscription.payment_failed"],
      status: "failed",
      createdAt: new Date("2023-04-10"),
      lastTriggered: new Date("2023-06-18"),
      failedAttempts: 3,
      enabled: true,
    },
  ]);

  // 각 웹훅의 최근 이벤트 로그 (실제로는 API에서 가져올 데이터)
  const [webhookEvents, setWebhookEvents] = useState<WebhookEvent[]>([
    {
      id: "evt1",
      webhookId: "wh1",
      eventType: "payment.completed",
      payload: { paymentId: "pay_123", amount: 15000 },
      status: "success",
      statusCode: 200,
      responseTime: 230, // ms
      triggeredAt: new Date("2023-06-20T14:30:00"),
    },
    {
      id: "evt2",
      webhookId: "wh3",
      eventType: "payment.failed",
      payload: { paymentId: "pay_124", error: "card_declined" },
      status: "failed",
      statusCode: 500,
      responseTime: 4500, // ms
      triggeredAt: new Date("2023-06-18T09:15:00"),
      error: "Endpoint timed out after 3000ms",
    },
    {
      id: "evt3",
      webhookId: "wh1",
      eventType: "payment.created",
      payload: { paymentId: "pay_125", amount: 25000 },
      status: "success",
      statusCode: 200,
      responseTime: 180,
      triggeredAt: new Date("2023-06-19T11:20:00"),
      isTest: true,
    },
  ]);

  // 상태 및 모달 관련 상태
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedWebhook, setSelectedWebhook] = useState<Webhook | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [filters, setFilters] = useState({
    status: [] as string[],
    eventTypes: [] as string[],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);

  // 드롭다운 메뉴 상태
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // 필터링된 웹훅 목록
  const filteredWebhooks = webhooks.filter((webhook) => {
    // 검색어 필터링
    const matchesSearch =
      webhook.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      webhook.url.toLowerCase().includes(searchTerm.toLowerCase());

    // 상태 필터링
    const matchesStatus =
      filters.status.length === 0 || filters.status.includes(webhook.status);

    // 이벤트 타입 필터링
    const matchesEventType =
      filters.eventTypes.length === 0 ||
      webhook.eventTypes.some((type) => filters.eventTypes.includes(type));

    return matchesSearch && matchesStatus && matchesEventType;
  });

  // 날짜 포맷팅 유틸리티
  function formatDate(date: Date | null) {
    if (!date) return "-";
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  }

  function formatDetailDate(date: Date | null) {
    if (!date) return "기록 없음";
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }

  // 필터 토글 함수
  const toggleStatusFilter = (status: string) => {
    setFilters((prev) => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter((s) => s !== status)
        : [...prev.status, status],
    }));
  };

  const toggleEventTypeFilter = (eventType: string) => {
    setFilters((prev) => ({
      ...prev,
      eventTypes: prev.eventTypes.includes(eventType)
        ? prev.eventTypes.filter((e) => e !== eventType)
        : [...prev.eventTypes, eventType],
    }));
  };

  // 웹훅 토글 함수
  const toggleWebhook = (id: string) => {
    setWebhooks(
      webhooks.map((webhook) => {
        if (webhook.id === id) {
          return {
            ...webhook,
            enabled: !webhook.enabled,
            status: !webhook.enabled ? "active" : "inactive",
          };
        }
        return webhook;
      })
    );
  };

  // 웹훅 삭제 처리
  const handleDeleteWebhook = () => {
    if (selectedWebhook) {
      setWebhooks(
        webhooks.filter((webhook) => webhook.id !== selectedWebhook.id)
      );
      setShowDeleteModal(false);
      setSelectedWebhook(null);
    }
  };

  // 웹훅 생성 처리
  const handleCreateWebhook = (newWebhook: {
    name: string;
    url: string;
    eventTypes: string[];
    enabled: boolean;
  }) => {
    setIsSubmitting(true);

    // 생성 요청 시뮬레이션 (실제로는 API 요청)
    setTimeout(() => {
      const createdWebhook: Webhook = {
        id: `wh${Date.now()}`,
        name: newWebhook.name,
        url: newWebhook.url,
        secret: `whsec_${Math.random().toString(36).substring(2, 15)}`,
        eventTypes: newWebhook.eventTypes,
        status: newWebhook.enabled ? "active" : "inactive",
        createdAt: new Date(),
        lastTriggered: null,
        failedAttempts: 0,
        enabled: newWebhook.enabled,
      };

      setWebhooks([createdWebhook, ...webhooks]);
      setIsSubmitting(false);
      setShowCreateModal(false);
    }, 1000);
  };

  // 웹훅 테스트 처리
  const handleTestWebhook = (webhookId: string, eventType: string) => {
    setIsTesting(true);

    // 테스트 요청 시뮬레이션 (실제로는 API 요청)
    setTimeout(() => {
      // 테스트 성공 예시
      const testEvent: WebhookEvent = {
        id: `evt_test_${Date.now()}`,
        webhookId,
        eventType,
        payload: {
          test: true,
          timestamp: new Date().toISOString(),
          paymentId: `pay_test_${Math.floor(Math.random() * 10000)}`,
          amount: Math.floor(Math.random() * 100000),
        },
        status: "success",
        statusCode: 200,
        responseTime: Math.floor(Math.random() * 300) + 100,
        triggeredAt: new Date(),
        isTest: true,
      };

      setWebhookEvents([testEvent, ...webhookEvents]);

      // 웹훅의 lastTriggered 업데이트
      setWebhooks(
        webhooks.map((webhook) =>
          webhook.id === webhookId
            ? { ...webhook, lastTriggered: new Date() }
            : webhook
        )
      );

      setIsTesting(false);
      setShowTestModal(false);
    }, 1500);
  };

  // 복사 기능
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSecret(true);
    setTimeout(() => setCopiedSecret(false), 2000);
  };

  // 웹훅 이벤트 재시도
  const retryWebhookEvent = (eventId: string) => {
    // 재시도 로직 (실제로는 API 요청)
    console.log(`Retrying webhook event: ${eventId}`);

    // 성공했다고 가정하고 상태 업데이트
    setWebhookEvents(
      webhookEvents.map((event) =>
        event.id === eventId
          ? { ...event, status: "success", statusCode: 200, responseTime: 150 }
          : event
      )
    );
  };

  // 히스토리 모달에서 보여줄 이벤트 목록
  const getWebhookEvents = (webhookId: string) => {
    return webhookEvents
      .filter((event) => event.webhookId === webhookId)
      .sort((a, b) => b.triggeredAt.getTime() - a.triggeredAt.getTime());
  };

  // 웹훅 통계
  const webhookStats = {
    total: webhooks.length,
    active: webhooks.filter((webhook) => webhook.status === "active").length,
    inactive: webhooks.filter((webhook) => webhook.status === "inactive")
      .length,
    failed: webhooks.filter((webhook) => webhook.status === "failed").length,
  };

  // 이벤트 유형 목록
  const allEventTypes = [
    "payment.created",
    "payment.completed",
    "payment.failed",
    "payment.cancelled",
    "payment.refunded",
    "subscription.created",
    "subscription.updated",
    "subscription.cancelled",
    "subscription.payment_failed",
  ];

  const toggleMenu = (id: string) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  // 선택된 웹훅의 이벤트 타입 목록을 가져오는 함수
  const getWebhookEventTypes = (webhook: Webhook | null) => {
    return webhook ? webhook.eventTypes : [];
  };

  return (
    <div className="space-y-6">
      {/* 웹훅 통계 대시보드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-[#CDE5FF] shadow-sm">
          <div className="flex justify-between items-center">
            <p className="text-sm text-[#5E99D6]">전체 웹훅</p>
            <Bell className="h-5 w-5 text-[#5E99D6]" />
          </div>
          <p className="text-2xl font-bold mt-2">{webhookStats.total}</p>
        </div>

        <div className="bg-white p-4 rounded-lg border-l-4 border border-green-500 shadow-sm">
          <div className="flex justify-between items-center">
            <p className="text-sm text-green-600">활성 웹훅</p>
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold mt-2">{webhookStats.active}</p>
        </div>

        <div className="bg-white p-4 rounded-lg border-l-4 border border-gray-400 shadow-sm">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">비활성 웹훅</p>
            <XCircle className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-2xl font-bold mt-2">{webhookStats.inactive}</p>
        </div>

        <div className="bg-white p-4 rounded-lg border-l-4 border border-red-500 shadow-sm">
          <div className="flex justify-between items-center">
            <p className="text-sm text-red-600">실패한 웹훅</p>
            <AlertCircle className="h-5 w-5 text-red-500" />
          </div>
          <p className="text-2xl font-bold mt-2">{webhookStats.failed}</p>
        </div>
      </div>

      {/* 검색 및 필터 컨트롤 */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5E99D6]" />
            <input
              type="text"
              placeholder="웹훅 이름 또는 URL 검색"
              className="pl-10 pr-4 py-2 border border-[#CDE5FF] rounded-md w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-[#81B9F8]"
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
              {(filters.status.length > 0 || filters.eventTypes.length > 0) && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0067AC] text-[10px] text-white">
                  {filters.status.length + filters.eventTypes.length}
                </span>
              )}
            </button>

            {showFilterMenu && (
              <div className="absolute top-full mt-1 left-0 z-10 w-80 bg-white rounded-md border border-[#CDE5FF] p-4 shadow-md">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium">필터</h4>
                  <button
                    className="text-[#5E99D6] text-sm hover:underline"
                    onClick={() => setFilters({ status: [], eventTypes: [] })}
                  >
                    초기화
                  </button>
                </div>

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

                <div>
                  <h5 className="text-sm font-medium mb-2">이벤트 유형</h5>
                  <div className="flex flex-wrap gap-2">
                    {allEventTypes.map((eventType) => (
                      <button
                        key={eventType}
                        className={`px-3 py-1 rounded-full text-xs ${
                          filters.eventTypes.includes(eventType)
                            ? "bg-[#0067AC] text-white"
                            : "bg-[#F6FBFF] text-[#5E99D6] border border-[#CDE5FF]"
                        }`}
                        onClick={() => toggleEventTypeFilter(eventType)}
                      >
                        {eventType}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          className="inline-flex items-center gap-2 rounded-md bg-[#0067AC] px-4 py-2 text-white hover:bg-[#397AB4] transition-colors"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus className="h-4 w-4" />새 웹훅 생성
        </button>
      </div>

      {/* 웹훅 목록 */}
      {filteredWebhooks.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[#CDE5FF] rounded-lg bg-white">
          <Bell className="h-16 w-16 mx-auto text-[#5E99D6] mb-4" />
          <h3 className="text-lg font-medium mb-2">
            {searchTerm ||
            filters.status.length > 0 ||
            filters.eventTypes.length > 0
              ? "검색 조건과 일치하는 웹훅이 없습니다"
              : "등록된 웹훅이 없습니다"}
          </h3>
          <p className="text-[#5E99D6] mb-6 max-w-md mx-auto">
            결제 이벤트 알림을 받으려면 웹훅을 등록하세요. 웹훅을 통해 결제
            생성, 완료, 실패 등의 이벤트를 실시간으로 전달받을 수 있습니다.
          </p>
          <button
            className="inline-flex items-center gap-2 rounded-md bg-[#0067AC] px-4 py-2 text-white hover:bg-[#397AB4] transition-colors"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="h-4 w-4" />
            웹훅 생성하기
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-[#CDE5FF] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F6FBFF]">
                <th className="px-6 py-3 text-left text-xs font-medium text-[#0067AC] uppercase tracking-wider">
                  이름
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#0067AC] uppercase tracking-wider">
                  엔드포인트 URL
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#0067AC] uppercase tracking-wider">
                  이벤트 유형
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#0067AC] uppercase tracking-wider">
                  생성일
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#0067AC] uppercase tracking-wider">
                  마지막 트리거
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#0067AC] uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-[#0067AC] uppercase tracking-wider">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#CDE5FF]">
              {filteredWebhooks.map((webhook) => (
                <tr key={webhook.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Tag className="h-4 w-4 text-[#5E99D6] mr-2" />
                      <div className="font-medium">{webhook.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm max-w-xs truncate">
                      <Globe className="h-4 w-4 text-[#5E99D6] mr-2 flex-shrink-0" />
                      <a
                        href={webhook.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0067AC] hover:underline truncate"
                      >
                        {webhook.url}
                      </a>
                    </div>
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className="flex items-center text-sm text-[#5E99D6]"
                      title={formatDetailDate(webhook.createdAt)}
                    >
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(webhook.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className="text-sm text-[#5E99D6]"
                      title={
                        webhook.lastTriggered
                          ? formatDetailDate(webhook.lastTriggered)
                          : "기록 없음"
                      }
                    >
                      {webhook.lastTriggered
                        ? formatDate(webhook.lastTriggered)
                        : "기록 없음"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <WebhookStatusBadge status={webhook.status} />
                    {webhook.failedAttempts > 0 && (
                      <span className="ml-2 text-xs text-red-600">
                        (실패: {webhook.failedAttempts}회)
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center text-sm whitespace-nowrap">
                    <div className="flex justify-center relative">
                      <button
                        className="text-[#5E99D6] hover:text-[#0067AC]"
                        onClick={() => toggleMenu(webhook.id)}
                      >
                        <MoreVertical className="h-5 w-5" />
                      </button>
                      {openMenuId === webhook.id && (
                        <div className="absolute right-0 mt-8 w-48 bg-white rounded-md border border-[#CDE5FF] shadow-md z-10">
                          <div className="py-1">
                            <button
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-[#F6FBFF] w-full text-left"
                              onClick={() => {
                                toggleWebhook(webhook.id);
                                setOpenMenuId(null);
                              }}
                            >
                              {webhook.enabled ? (
                                <>
                                  <ToggleRight className="h-4 w-4 mr-2" />
                                  <span>비활성화</span>
                                </>
                              ) : (
                                <>
                                  <ToggleLeft className="h-4 w-4 mr-2" />
                                  <span>활성화</span>
                                </>
                              )}
                            </button>

                            <button
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-[#F6FBFF] w-full text-left"
                              onClick={() => {
                                setSelectedWebhook(webhook);
                                setShowTestModal(true);
                                setOpenMenuId(null);
                              }}
                            >
                              <Zap className="h-4 w-4 mr-2" />
                              <span>테스트 이벤트 전송</span>
                            </button>

                            <button
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-[#F6FBFF] w-full text-left"
                              onClick={() => {
                                copyToClipboard(webhook.secret);
                                setOpenMenuId(null);
                              }}
                            >
                              {copiedSecret ? (
                                <>
                                  <Check className="h-4 w-4 mr-2" />
                                  <span>시크릿 복사됨</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="h-4 w-4 mr-2" />
                                  <span>시크릿 복사</span>
                                </>
                              )}
                            </button>

                            <button
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-[#F6FBFF] w-full text-left"
                              onClick={() => {
                                setSelectedWebhook(webhook);
                                setShowHistoryModal(true);
                                setOpenMenuId(null);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              <span>이벤트 기록 보기</span>
                            </button>

                            <button
                              className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                              onClick={() => {
                                setSelectedWebhook(webhook);
                                setShowDeleteModal(true);
                                setOpenMenuId(null);
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              <span>삭제</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* API 키 사용에 관한 팁 */}
      <div className="bg-white rounded-lg border border-[#CDE5FF] p-4">
        <div className="flex">
          <Info className="h-5 w-5 text-[#0067AC] flex-shrink-0 mt-1" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-gray-700">
              웹훅 보안 권장사항
            </h3>
            <ul className="mt-2 text-sm text-[#5E99D6] space-y-1 list-disc pl-5">
              <li>
                공개적으로 접근 가능한 URLs만 웹훅 엔드포인트로 사용하세요.
              </li>
              <li>웹훅 시크릿을 사용하여 요청의 진위성을 검증하세요.</li>
              <li>이벤트 중복 수신에 대비한 처리 로직을 구현하세요.</li>
              <li>엔드포인트에서 2XX 응답을 빠르게 반환하세요.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 모달 컴포넌트들 */}
      {showCreateModal && (
        <CreateWebhookModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreateWebhook={handleCreateWebhook}
          isSubmitting={isSubmitting}
        />
      )}

      {showDeleteModal && selectedWebhook && (
        <DeleteWebhookModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onDelete={handleDeleteWebhook}
          webhookName={selectedWebhook.name}
        />
      )}

      {showTestModal && selectedWebhook && (
        <TestWebhookModal
          isOpen={showTestModal}
          onClose={() => setShowTestModal(false)}
          onTestWebhook={handleTestWebhook}
          webhookId={selectedWebhook.id}
          webhookName={selectedWebhook.name}
          availableEvents={selectedWebhook.eventTypes}
          isTesting={isTesting}
        />
      )}

      {showHistoryModal && selectedWebhook && (
        <WebhookHistoryModal
          isOpen={showHistoryModal}
          onClose={() => setShowHistoryModal(false)}
          webhookId={selectedWebhook.id}
          webhookName={selectedWebhook.name}
          events={getWebhookEvents(selectedWebhook.id)}
          onRetry={retryWebhookEvent}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
