import React, { useState } from "react";
import { AlertTriangle, RefreshCw, Calendar, Info } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { colors } from "@/styles/theme";

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

  const handleCreateKey = () => {
    const days =
      expiryOption === "custom" ? customDays : parseInt(expiryOption);
    onCreateKey(days);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="새 API 키 생성">
      <div className="space-y-4">
        <div>
          <label
            htmlFor="keyName"
            className="block text-sm font-medium mb-1"
            style={{ color: colors.neutral[700] }}
          >
            API 키 이름
          </label>
          <input
            type="text"
            id="keyName"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{
              borderColor: colors.ui.assistive,
              "--tw-ring-color": colors.primary.DEFAULT,
            }}
            placeholder="예: 프로덕션 API, 테스트 API 등"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
          />
        </div>

        {/* 토큰 활성 기간 설정 */}
        <div>
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: colors.neutral[700] }}
          >
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              토큰 활성 기간
            </div>
          </label>
          <div className="grid grid-cols-6 gap-2">
            {["30", "90", "180", "365"].map((days) => (
              <button
                key={days}
                type="button"
                className="px-3 py-2 text-sm border rounded-md transition-colors"
                style={{
                  borderColor:
                    expiryOption === days
                      ? colors.primary.DEFAULT
                      : colors.ui.assistive,
                  backgroundColor:
                    expiryOption === days
                      ? colors.primary[50]
                      : colors.semantic.white,
                  color:
                    expiryOption === days
                      ? colors.primary.DEFAULT
                      : colors.ui.normal,
                }}
                onClick={() =>
                  setExpiryOption(days as "30" | "90" | "180" | "365")
                }
              >
                {days === "365" ? "1년" : `${days}일`}
              </button>
            ))}
            <button
              type="button"
              className="px-3 py-2 text-sm border rounded-md col-span-2 transition-colors"
              style={{
                borderColor:
                  expiryOption === "custom"
                    ? colors.primary.DEFAULT
                    : colors.ui.assistive,
                backgroundColor:
                  expiryOption === "custom"
                    ? colors.primary[50]
                    : colors.semantic.white,
                color:
                  expiryOption === "custom"
                    ? colors.primary.DEFAULT
                    : colors.ui.normal,
              }}
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
                className="w-24 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{
                  borderColor: colors.ui.assistive,
                  "--tw-ring-color": colors.primary.DEFAULT,
                }}
              />
              <span className="text-sm" style={{ color: colors.neutral[600] }}>
                일
              </span>
            </div>
          )}

          <div
            className="mt-2 text-xs flex items-start gap-1"
            style={{ color: colors.ui.normal }}
          >
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

        <div
          className="border rounded-md p-3 text-sm"
          style={{
            backgroundColor: "#FEF3C7",
            borderColor: "#F59E0B",
            color: "#92400E",
          }}
        >
          <div className="flex">
            <AlertTriangle
              className="h-5 w-5 mr-2 flex-shrink-0"
              style={{ color: "#F59E0B" }}
            />
            <p>
              <strong>중요:</strong> API 키가 생성된 후에는 Secret Key를 다시
              확인할 수 없습니다. 생성 즉시 안전한 곳에 저장해 주세요.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button variant="outline" onClick={onClose}>
          취소
        </Button>
        <Button
          variant="primary"
          onClick={handleCreateKey}
          disabled={isGenerating}
          isLoading={isGenerating}
          loadingText="생성 중..."
          leftIcon={
            !isGenerating ? undefined : <RefreshCw className="h-4 w-4" />
          }
        >
          생성하기
        </Button>
      </div>
    </Modal>
  );
};

export default CreateApiKeyModal;
