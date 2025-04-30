import React from "react";
import { AlertTriangle } from "lucide-react";

interface DeleteApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}

const DeleteApiKeyModal: React.FC<DeleteApiKeyModalProps> = ({
  isOpen,
  onClose,
  onDelete,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex items-center gap-3 text-[#FA333F]">
          <AlertTriangle className="h-6 w-6" />
          <h3 className="text-lg font-medium">API 키 삭제 확인</h3>
        </div>
        <p className="mt-3 text-[#5E99D6]">
          API 키를 삭제하면 이 키를 사용하는 모든 연동 서비스가 작동하지 않게
          됩니다. 정말 삭제하시겠습니까?
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded-md border border-[#CDE5FF] hover:bg-[#F6FBFF]"
            onClick={onClose}
          >
            취소
          </button>
          <button
            className="px-4 py-2 rounded-md bg-[#FA333F] text-white hover:bg-red-600"
            onClick={onDelete}
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteApiKeyModal;
