import React, { useState } from "react";
import {
  AlertTriangle,
  RefreshCw,
  XCircle,
  Calendar,
  Info,
} from "lucide-react";

interface CreateApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  newKeyName: string;
  setNewKeyName: (name: string) => void;
  onCreateKey: (expiresInDays: number) => void;
  isGenerating: boolean;
}

const CreateApiKeyModal: React.FC<CreateApiKeyModalProps> = ({
  isOpen,
  onClose,
  newKeyName,
  setNewKeyName,
  onCreateKey,
  isGenerating,
}) => {
  const [expiryOption, setExpiryOption] = useState<
    "30" | "90" | "180" | "365" | "custom"
  >("90");
  const [customDays, setCustomDays] = useState<number>(90);

  if (!isOpen) return null;

  const handleCreateKey = () => {
    const days =
      expiryOption === "custom" ? customDays : parseInt(expiryOption);
    onCreateKey(days);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">새 API 키 생성</h3>
          <button
            className="text-gray-400 hover:text-gray-500"
            onClick={onClose}
          >
            <XCircle className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="keyName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              API 키 이름
            </label>
            <input
              type="text"
              id="keyName"
              className="w-full px-3 py-2 border border-[#CDE5FF] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0067AC] focus:border-[#0067AC]"
              placeholder="예: 프로덕션 API, 테스트 API 등"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
            />
          </div>

          {/* 토큰 활성 기간 설정 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                토큰 활성 기간
              </div>
            </label>
            <div className="grid grid-cols-6 gap-2">
              <button
                type="button"
                className={`px-3 py-2 text-sm border rounded-md ${
                  expiryOption === "30"
                    ? "border-[#0067AC] bg-[#F0F9FF] text-[#0067AC]"
                    : "border-[#CDE5FF] text-[#5E99D6] hover:bg-[#F6FBFF]"
                }`}
                onClick={() => setExpiryOption("30")}
              >
                30일
              </button>
              <button
                type="button"
                className={`px-3 py-2 text-sm border rounded-md ${
                  expiryOption === "90"
                    ? "border-[#0067AC] bg-[#F0F9FF] text-[#0067AC]"
                    : "border-[#CDE5FF] text-[#5E99D6] hover:bg-[#F6FBFF]"
                }`}
                onClick={() => setExpiryOption("90")}
              >
                90일
              </button>
              <button
                type="button"
                className={`px-3 py-2 text-sm border rounded-md ${
                  expiryOption === "180"
                    ? "border-[#0067AC] bg-[#F0F9FF] text-[#0067AC]"
                    : "border-[#CDE5FF] text-[#5E99D6] hover:bg-[#F6FBFF]"
                }`}
                onClick={() => setExpiryOption("180")}
              >
                180일
              </button>
              <button
                type="button"
                className={`px-3 py-2 text-sm border rounded-md ${
                  expiryOption === "365"
                    ? "border-[#0067AC] bg-[#F0F9FF] text-[#0067AC]"
                    : "border-[#CDE5FF] text-[#5E99D6] hover:bg-[#F6FBFF]"
                }`}
                onClick={() => setExpiryOption("365")}
              >
                1년
              </button>
              <button
                type="button"
                className={`px-3 py-2 text-sm border rounded-md col-span-2 ${
                  expiryOption === "custom"
                    ? "border-[#0067AC] bg-[#F0F9FF] text-[#0067AC]"
                    : "border-[#CDE5FF] text-[#5E99D6] hover:bg-[#F6FBFF]"
                }`}
                onClick={() => setExpiryOption("custom")}
              >
                직접입력
              </button>
            </div>

            {expiryOption === "custom" && (
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="3650"
                  value={customDays}
                  onChange={(e) =>
                    setCustomDays(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="w-24 px-3 py-2 border border-[#CDE5FF] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0067AC] focus:border-[#0067AC]"
                />
                <span className="text-sm text-gray-600">일</span>
              </div>
            )}

            <div className="mt-2 text-xs text-[#5E99D6] flex items-start gap-1">
              <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
              <span>
                {expiryOption === "custom"
                  ? `설정한 만료일: ${new Date(
                      Date.now() + customDays * 24 * 60 * 60 * 1000
                    ).toLocaleDateString()}`
                  : `설정한 만료일: ${new Date(
                      Date.now() + parseInt(expiryOption) * 24 * 60 * 60 * 1000
                    ).toLocaleDateString()}`}
              </span>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-sm text-amber-800">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 text-amber-500" />
              <p>
                <strong>중요:</strong> API 키가 생성된 후에는 Secret Key를 다시
                확인할 수 없습니다. 생성 즉시 안전한 곳에 저장해 주세요.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded-md border border-[#CDE5FF] hover:bg-[#F6FBFF]"
            onClick={onClose}
          >
            취소
          </button>
          <button
            className="px-4 py-2 rounded-md bg-[#0067AC] text-white hover:bg-[#397AB4]"
            onClick={handleCreateKey}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <div className="flex items-center">
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                생성 중...
              </div>
            ) : (
              "생성하기"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateApiKeyModal;
