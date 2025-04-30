"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  Check,
  Copy,
  Key,
  Plus,
  Trash2,
  Info,
  Calendar,
  Clock,
  Download,
  XCircle,
  TagIcon,
  Filter,
  ChevronDown,
  Activity,
} from "lucide-react";
import { TokenStatusBadge } from "./TokenStatusBadge";
import { SetExpiryModal } from "./modals/SetExpiryModal";

// API 키 타입 정의
interface ApiKey {
  id: string;
  name: string;
  accessKeyId: string;
  secretKey: string;
  createdAt: Date;
  lastUsed: Date | null;
  expiresAt: Date | null;
  status: "active" | "expiring" | "inactive";
}

// 모달 컴포넌트 임포트
import CreateApiKeyModal from "./modals/CreateApiKeyModal";
import SuccessApiKeyModal from "./modals/SuccessApiKeyModal";
import DeleteApiKeyModal from "./modals/DeleteApiKeyModal";

export default function ApiKeysList() {
  // 다중 API 키를 관리하기 위한 상태
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: "key1",
      name: "프로덕션 API 키",
      accessKeyId: "AKIAIOSFODNN7EXAMPLE",
      secretKey: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
      createdAt: new Date("2023-05-10"),
      lastUsed: new Date("2023-06-15"),
      expiresAt: new Date("2023-12-31"),
      status: "active",
    },
    {
      id: "key2",
      name: "테스트 API 키",
      accessKeyId: "AKIAI3NKFCDEXAMPLE",
      secretKey: "8hS7Nd3J9FjK2LpoP5tRqGsW4xDbVeEXAMPLEKEY",
      createdAt: new Date("2023-06-20"),
      lastUsed: new Date("2023-06-25"),
      expiresAt: addDays(new Date(), 15), // 15일 후 만료
      status: "expiring",
    },
    {
      id: "key3",
      name: "비활성 API 키",
      accessKeyId: "AKIAINACTIVEXAMPLE",
      secretKey: "XyZaBcDdEeFfGgHhIiJjKkLlMmNnOoPp1234567890",
      createdAt: new Date("2023-01-15"),
      lastUsed: new Date("2023-02-10"),
      expiresAt: new Date("2023-07-01"), // 이미 만료됨
      status: "inactive",
    },
  ]);

  // 상태값 및 필터링
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<ApiKey | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteKeyId, setDeleteKeyId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showExpiryModal, setShowExpiryModal] = useState(false);
  const [selectedKeyForExpiry, setSelectedKeyForExpiry] = useState<
    string | null
  >(null);
  const [newKeyName, setNewKeyName] = useState("");
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [copiedSecretId, setCopiedSecretId] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  // 토큰 상태별 통계
  const tokenStats = {
    total: apiKeys.length,
    active: apiKeys.filter((key) => key.status === "active").length,
    expiring: apiKeys.filter((key) => key.status === "expiring").length,
    inactive: apiKeys.filter((key) => key.status === "inactive").length,
  };

  // 필터링된 API 키 목록
  const filteredApiKeys = filterStatus
    ? apiKeys.filter((key) => key.status === filterStatus)
    : apiKeys;

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

  // 날짜 추가 함수
  function addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  // 만료일까지 남은 일수 계산
  function getDaysRemaining(expiryDate: Date | null): number | null {
    if (!expiryDate) return null;
    const now = new Date();
    const diffTime = expiryDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  }

  const copyToClipboard = (text: string, keyId: string | null = null) => {
    navigator.clipboard.writeText(text);
    if (keyId) {
      setCopiedKeyId(keyId);
      setTimeout(() => setCopiedKeyId(null), 2000);
    } else {
      setCopiedSecretId(true);
      setTimeout(() => setCopiedSecretId(false), 2000);
    }
  };

  const downloadCredentials = (key: ApiKey) => {
    const csvContent = `Access Key ID,Secret Key\n${key.accessKeyId},${key.secretKey}`;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `api-key-${key.name.replace(/\s+/g, "-").toLowerCase()}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateKey = (expiresInDays: number) => {
    if (!newKeyName.trim()) {
      alert("API 키 이름을 입력해주세요.");
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      // 만료일 계산
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiresInDays);

      const newKey: ApiKey = {
        id: `key${Math.random().toString(36).substring(2, 9)}`,
        name: newKeyName,
        accessKeyId: `AKIA${Math.random()
          .toString(36)
          .substring(2, 10)
          .toUpperCase()}`,
        secretKey: `${Math.random()
          .toString(36)
          .substring(2, 15)}/${Math.random().toString(36).substring(2, 15)}`,
        createdAt: new Date(),
        lastUsed: null,
        expiresAt,
        status: expiresInDays <= 30 ? "expiring" : "active",
      };

      setApiKeys([newKey, ...apiKeys]);
      setNewlyCreatedKey(newKey);
      setIsGenerating(false);
      setShowCreateModal(false);
      setShowSuccessModal(true);
      setNewKeyName("");
    }, 1000);
  };

  const confirmDeleteKey = (keyId: string) => {
    setDeleteKeyId(keyId);
    setShowDeleteModal(true);
  };

  const handleDeleteKey = () => {
    if (deleteKeyId) {
      setApiKeys(apiKeys.filter((key) => key.id !== deleteKeyId));
      setShowDeleteModal(false);
      setDeleteKeyId(null);
    }
  };

  // 만료일 설정 처리
  const handleSetExpiry = (keyId: string) => {
    setSelectedKeyForExpiry(keyId);
    setShowExpiryModal(true);
  };

  // 만료일 저장
  const saveExpiry = (expiryDate: Date) => {
    if (selectedKeyForExpiry) {
      setApiKeys(
        apiKeys.map((key) => {
          if (key.id === selectedKeyForExpiry) {
            // 만료일에 따라 상태 업데이트
            const daysRemaining = getDaysRemaining(expiryDate);
            let status: "active" | "expiring" | "inactive" = "active";

            if (daysRemaining !== null) {
              if (daysRemaining === 0) {
                status = "inactive";
              } else if (daysRemaining <= 30) {
                status = "expiring";
              }
            }

            return { ...key, expiresAt: expiryDate, status };
          }
          return key;
        })
      );
      setShowExpiryModal(false);
      setSelectedKeyForExpiry(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* 토큰 상태 대시보드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-[#CDE5FF] shadow-sm">
          <div className="flex justify-between items-center">
            <p className="text-sm text-[#5E99D6]">전체 토큰</p>
            <Key className="h-5 w-5 text-[#5E99D6]" />
          </div>
          <p className="text-2xl font-bold mt-2">{tokenStats.total}</p>
        </div>

        <div className="bg-white p-4 rounded-lg border-l-4 border border-green-500 shadow-sm">
          <div className="flex justify-between items-center">
            <p className="text-sm text-green-600">활성 토큰</p>
            <Activity className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold mt-2">{tokenStats.active}</p>
          <button
            className="text-xs text-green-600 hover:underline mt-2"
            onClick={() => setFilterStatus("active")}
          >
            활성 토큰 보기
          </button>
        </div>

        <div className="bg-white p-4 rounded-lg border-l-4 border border-amber-500 shadow-sm">
          <div className="flex justify-between items-center">
            <p className="text-sm text-amber-600">만료 예정 토큰</p>
            <Clock className="h-5 w-5 text-amber-500" />
          </div>
          <p className="text-2xl font-bold mt-2">{tokenStats.expiring}</p>
          <button
            className="text-xs text-amber-600 hover:underline mt-2"
            onClick={() => setFilterStatus("expiring")}
          >
            만료 예정 토큰 보기
          </button>
        </div>

        <div className="bg-white p-4 rounded-lg border-l-4 border border-gray-400 shadow-sm">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">비활성 토큰</p>
            <XCircle className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-2xl font-bold mt-2">{tokenStats.inactive}</p>
          <button
            className="text-xs text-gray-500 hover:underline mt-2"
            onClick={() => setFilterStatus("inactive")}
          >
            비활성 토큰 보기
          </button>
        </div>
      </div>

      {/* 필터 및 API 키 추가 버튼 */}
      <div className="flex justify-between items-center">
        <div className="relative">
          <button
            className="flex items-center gap-2 px-3 py-2 text-sm border border-[#CDE5FF] rounded-md hover:bg-[#F6FBFF]"
            onClick={() => setFilterStatus(null)}
          >
            <Filter className="h-4 w-4" />
            {filterStatus
              ? `${
                  filterStatus === "active"
                    ? "활성"
                    : filterStatus === "expiring"
                    ? "만료 예정"
                    : "비활성"
                } 토큰`
              : "모든 토큰"}
            {filterStatus && (
              <XCircle
                className="h-4 w-4 ml-2 text-gray-400 hover:text-gray-600"
                onClick={(e) => {
                  e.stopPropagation();
                  setFilterStatus(null);
                }}
              />
            )}
          </button>
        </div>

        <button
          className="inline-flex items-center gap-2 rounded-md bg-[#0067AC] px-4 py-2 text-white hover:bg-[#397AB4] transition-colors"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus className="h-4 w-4" />새 API 키 생성
        </button>
      </div>

      {/* API 키 목록 */}
      {filteredApiKeys.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[#CDE5FF] rounded-lg bg-white">
          <Key className="h-16 w-16 mx-auto text-[#5E99D6] mb-4" />
          <h3 className="text-lg font-medium mb-2">
            {filterStatus
              ? "조건에 맞는 API 키가 없습니다"
              : "API 키가 없습니다"}
          </h3>
          <p className="text-[#5E99D6] mb-6 max-w-md mx-auto">
            결제 시스템 연동을 위한 API 키를 생성하여 서비스에 연결하세요.
          </p>
          <button
            className="inline-flex items-center gap-2 rounded-md bg-[#0067AC] px-4 py-2 text-white hover:bg-[#397AB4] transition-colors"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="h-4 w-4" />
            API 키 생성하기
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
                  Access Key ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#0067AC] uppercase tracking-wider">
                  생성일
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#0067AC] uppercase tracking-wider">
                  만료일
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#0067AC] uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-[#0067AC] uppercase tracking-wider">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#CDE5FF]">
              {filteredApiKeys.map((key, index) => (
                <tr
                  key={key.id}
                  className={
                    index === 0 && key.id === newlyCreatedKey?.id
                      ? "bg-[#F0F9FF]"
                      : ""
                  }
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <TagIcon className="h-4 w-4 text-[#5E99D6] mr-2" />
                      <div className="font-medium">{key.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-sm">
                    <div className="flex items-center">
                      <span className="mr-2">{key.accessKeyId}</span>
                      <button
                        className="text-[#5E99D6] hover:text-[#0067AC]"
                        onClick={() => copyToClipboard(key.accessKeyId, key.id)}
                        title="복사"
                      >
                        {copiedKeyId === key.id ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className="flex items-center text-sm text-[#5E99D6]"
                      title={formatDetailDate(key.createdAt)}
                    >
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(key.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div
                        className="text-sm text-[#5E99D6]"
                        title={
                          key.expiresAt
                            ? formatDetailDate(key.expiresAt)
                            : "만료일 미설정"
                        }
                      >
                        {key.expiresAt ? formatDate(key.expiresAt) : "미설정"}
                        {key.status === "expiring" && key.expiresAt && (
                          <span className="ml-2 text-xs text-amber-600">
                            ({getDaysRemaining(key.expiresAt)}일 남음)
                          </span>
                        )}
                      </div>
                      <button
                        className="ml-2 text-[#5E99D6] hover:text-[#0067AC]"
                        onClick={() => handleSetExpiry(key.id)}
                        title="만료일 설정"
                      >
                        <Calendar className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <TokenStatusBadge status={key.status} />
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                    <button
                      className="text-[#FA333F] hover:text-red-600"
                      onClick={() => confirmDeleteKey(key.id)}
                      title="API 키 삭제"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
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
              API 키 보안 권장사항
            </h3>
            <ul className="mt-2 text-sm text-[#5E99D6] space-y-1 list-disc pl-5">
              <li>API 키는 외부에 노출되지 않도록 안전하게 보관하세요.</li>
              <li>정기적으로 API 키를 교체하여 보안을 강화하세요.</li>
              <li>사용하지 않는 API 키는 즉시 삭제하세요.</li>
              <li>
                필요한 경우 여러 개의 API 키를 생성하여 용도별로 구분하세요.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 모달 컴포넌트들 */}
      <CreateApiKeyModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setNewKeyName("");
        }}
        newKeyName={newKeyName}
        setNewKeyName={setNewKeyName}
        onCreateKey={handleCreateKey}
        isGenerating={isGenerating}
      />

      <SuccessApiKeyModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          setNewlyCreatedKey(null);
        }}
        newlyCreatedKey={newlyCreatedKey}
        onDownload={downloadCredentials}
        copyToClipboard={copyToClipboard}
        copiedSecretId={copiedSecretId}
      />

      <DeleteApiKeyModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDeleteKey}
      />

      <SetExpiryModal
        isOpen={showExpiryModal}
        onClose={() => {
          setShowExpiryModal(false);
          setSelectedKeyForExpiry(null);
        }}
        onSave={saveExpiry}
        currentExpiry={
          selectedKeyForExpiry
            ? apiKeys.find((key) => key.id === selectedKeyForExpiry)
                ?.expiresAt || null
            : null
        }
      />
    </div>
  );
}
