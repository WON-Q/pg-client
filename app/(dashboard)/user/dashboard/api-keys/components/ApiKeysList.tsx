"use client";

import React, { useState } from "react";
import {
  Check,
  Copy,
  Key,
  Plus,
  Trash2,
  Info,
  Calendar,
  Clock,
  TagIcon,
} from "lucide-react";

// 모달 컴포넌트 임포트
import CreateApiKeyModal from "./modals/CreateApiKeyModal";
import SuccessApiKeyModal from "./modals/SuccessApiKeyModal";
import DeleteApiKeyModal from "./modals/DeleteApiKeyModal";

// API 키 타입 정의
interface ApiKey {
  id: string;
  name: string;
  accessKeyId: string;
  secretKey: string;
  createdAt: Date;
  lastUsed: Date | null;
}

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
    },
    {
      id: "key2",
      name: "테스트 API 키",
      accessKeyId: "AKIAI3NKFCDEXAMPLE",
      secretKey: "8hS7Nd3J9FjK2LpoP5tRqGsW4xDbVeEXAMPLEKEY",
      createdAt: new Date("2023-06-20"),
      lastUsed: new Date("2023-06-25"),
    },
  ]);

  // 모달 및 상태 관리
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<ApiKey | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteKeyId, setDeleteKeyId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [copiedSecretId, setCopiedSecretId] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
    // 키 정보를 CSV 형식으로 생성
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

  const handleCreateKey = () => {
    if (!newKeyName.trim()) {
      alert("API 키 이름을 입력해주세요.");
      return;
    }

    setIsGenerating(true);

    // API 키 생성 시뮬레이션
    setTimeout(() => {
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
      };

      setApiKeys([newKey, ...apiKeys]); // 새 키를 맨 앞에 추가
      setNewlyCreatedKey(newKey); // 새로 생성된 키 저장
      setIsGenerating(false);
      setShowCreateModal(false);
      setShowSuccessModal(true); // 성공 모달 표시
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

  const formatDate = (date: Date | null) => {
    if (!date) return "-";

    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return "오늘";
    } else if (days === 1) {
      return "어제";
    } else if (days < 7) {
      return `${days}일 전`;
    } else {
      return new Intl.DateTimeFormat("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(date);
    }
  };

  const formatDetailDate = (date: Date | null) => {
    if (!date) return "사용 기록 없음";
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="space-y-6">
      {/* API 키 추가 버튼 */}
      <div className="flex justify-end">
        <button
          className="inline-flex items-center gap-2 rounded-md bg-[#0067AC] px-4 py-2 text-white hover:bg-[#397AB4] transition-colors"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus className="h-4 w-4" />새 API 키 생성
        </button>
      </div>

      {/* API 키 목록 */}
      {apiKeys.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[#CDE5FF] rounded-lg bg-white">
          <Key className="h-16 w-16 mx-auto text-[#5E99D6] mb-4" />
          <h3 className="text-lg font-medium mb-2">API 키가 없습니다</h3>
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
                  마지막 사용
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-[#0067AC] uppercase tracking-wider">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#CDE5FF]">
              {apiKeys.map((key, index) => (
                <tr key={key.id} className={index === 0 ? "bg-[#F0F9FF]" : ""}>
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
                    <div
                      className="flex items-center text-sm text-[#5E99D6]"
                      title={formatDetailDate(key.lastUsed)}
                    >
                      <Clock className="h-4 w-4 mr-1" />
                      {formatDate(key.lastUsed) || "사용 기록 없음"}
                    </div>
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
    </div>
  );
}
