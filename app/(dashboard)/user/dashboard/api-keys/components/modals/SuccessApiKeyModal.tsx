import React from "react";
import { Check, Copy, Download } from "lucide-react";

interface ApiKey {
  id: string;
  name: string;
  accessKeyId: string;
  secretKey: string;
  createdAt: Date;
  lastUsed: Date | null;
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
  if (!isOpen || !newlyCreatedKey) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
        <div className="flex items-center gap-3 text-green-600 mb-4">
          <Check className="h-6 w-6" />
          <h3 className="text-lg font-medium">
            API 키가 성공적으로 생성되었습니다
          </h3>
        </div>

        <div className="mb-6">
          <p className="text-[#5E99D6] mb-4">
            이 화면에서 Secret Key를 확인하고 저장할 수 있는{" "}
            <strong className="text-amber-600">유일한 기회</strong>입니다. 이
            정보는 다시 표시되지 않습니다.
          </p>

          <div className="space-y-4 bg-[#F6FBFF] p-4 rounded-lg border border-[#CDE5FF]">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API 키 이름
              </label>
              <div className="bg-white border border-[#CDE5FF] rounded-md p-3 flex justify-between items-center">
                <span>{newlyCreatedKey.name}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Access Key ID
              </label>
              <div className="bg-white border border-[#CDE5FF] rounded-md p-3 flex justify-between items-center font-mono">
                <span>{newlyCreatedKey.accessKeyId}</span>
                <button
                  className="text-[#5E99D6] hover:text-[#0067AC] ml-2"
                  onClick={() => copyToClipboard(newlyCreatedKey.accessKeyId)}
                  title="복사"
                >
                  <Copy className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Secret Key
              </label>
              <div className="bg-white border border-[#CDE5FF] rounded-md p-3 flex justify-between items-center font-mono">
                <span>{newlyCreatedKey.secretKey}</span>
                <button
                  className="text-[#5E99D6] hover:text-[#0067AC] ml-2"
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
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <button
            className="px-4 py-2 rounded-md border border-[#CDE5FF] hover:bg-[#F6FBFF] flex items-center justify-center"
            onClick={() => onDownload(newlyCreatedKey)}
          >
            <Download className="h-4 w-4 mr-2" />
            CSV 파일로 다운로드
          </button>

          <button
            className="px-4 py-2 rounded-md bg-[#0067AC] text-white hover:bg-[#397AB4]"
            onClick={onClose}
          >
            확인 완료
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessApiKeyModal;
