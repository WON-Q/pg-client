import React from "react";
import { Check, Copy, Download } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { colors } from "@/styles/theme";

interface ApiKey {
  id: string;
  name: string;
  accessKeyId: string;
  secretKey: string;
  createdAt: Date;
  lastUsed: Date | null;
  expiresAt: Date | null;
  status: "active" | "expiring" | "expired";
}

interface SuccessApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  newlyCreatedKey: ApiKey | null;
  onDownload: (key: ApiKey) => void;
  copyToClipboard: (text: string) => void;
  copiedSecretId: boolean;
}

const SuccessApiKeyModal: React.FC<SuccessApiKeyModalProps> = ({
                                                                 isOpen,
                                                                 onClose,
                                                                 newlyCreatedKey,
                                                                 onDownload,
                                                                 copyToClipboard,
                                                                 copiedSecretId,
                                                               }) => {
  if (!newlyCreatedKey) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="flex items-center gap-3 mb-4" style={{ color: "#22C55E" }}>
        <Check className="h-6 w-6" />
        <h3 className="text-lg font-medium">
          API 키가 성공적으로 생성되었습니다
        </h3>
      </div>

      <div className="mb-6">
        <p className="mb-4" style={{ color: colors.ui.normal }}>
          이 화면에서 Secret Key를 확인하고 저장할 수 있는{" "}
          <strong style={{ color: "#F59E0B" }}>유일한 기회</strong>입니다. 이
          정보는 다시 표시되지 않습니다.
        </p>

        <div className="space-y-4 p-4 rounded-lg border" style={{
          backgroundColor: colors.semantic.blueWhite,
          borderColor: colors.ui.assistive
        }}>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: colors.neutral[700] }}>
              API 키 이름
            </label>
            <div className="border rounded-md p-3 flex justify-between items-center" style={{
              backgroundColor: colors.semantic.white,
              borderColor: colors.ui.assistive
            }}>
              <span>{newlyCreatedKey.name}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: colors.neutral[700] }}>
              Access Key ID
            </label>
            <div className="border rounded-md p-3 flex justify-between items-center font-mono" style={{
              backgroundColor: colors.semantic.white,
              borderColor: colors.ui.assistive
            }}>
              <span>{newlyCreatedKey.accessKeyId}</span>
              <button
                className="ml-2 transition-colors"
                style={{ color: colors.ui.normal }}
                onClick={() => copyToClipboard(newlyCreatedKey.accessKeyId)}
                title="복사"
              >
                <Copy className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: colors.neutral[700] }}>
              Secret Key
            </label>
            <div className="border rounded-md p-3 flex justify-between items-center font-mono" style={{
              backgroundColor: colors.semantic.white,
              borderColor: colors.ui.assistive
            }}>
              <span>{newlyCreatedKey.secretKey}</span>
              <button
                className="ml-2 transition-colors"
                style={{ color: colors.ui.normal }}
                onClick={() => copyToClipboard(newlyCreatedKey.secretKey)}
                title="복사"
              >
                {copiedSecretId ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <Copy className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: colors.neutral[700] }}>
              키 활성 기간
            </label>
            <div className="border rounded-md p-3 flex justify-between items-center" style={{
              backgroundColor: colors.semantic.white,
              borderColor: colors.ui.assistive
            }}>
              <div>
                <span>
                  {newlyCreatedKey.expiresAt &&
                    `${new Date().toLocaleDateString()} ~ ${newlyCreatedKey.expiresAt.toLocaleDateString()}`}
                </span>
                <div className="text-xs mt-1" style={{ color: colors.ui.normal }}>
                  {newlyCreatedKey.expiresAt &&
                    `만료까지 ${Math.ceil(
                      (newlyCreatedKey.expiresAt.getTime() -
                        new Date().getTime()) /
                      (1000 * 60 * 60 * 24)
                    )}일 남음`}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <Button
          variant="outline"
          leftIcon={<Download className="h-4 w-4" />}
          onClick={() => onDownload(newlyCreatedKey)}
        >
          CSV 파일로 다운로드
        </Button>

        <Button variant="primary" onClick={onClose}>
          확인 완료
        </Button>
      </div>
    </Modal>
  );
};

export default SuccessApiKeyModal;
