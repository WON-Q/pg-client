import React from "react";
import { AlertTriangle, RefreshCw, XCircle } from "lucide-react";

interface CreateApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  newKeyName: string;
  setNewKeyName: (name: string) => void;
  onCreateKey: () => void;
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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
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
            onClick={onCreateKey}
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
