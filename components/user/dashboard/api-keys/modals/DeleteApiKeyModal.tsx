import React from "react";
import { AlertTriangle } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { colors } from "@/styles/theme";

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
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div
        className="flex items-center gap-3 mb-4"
        style={{ color: colors.semantic.error }}
      >
        <AlertTriangle className="h-6 w-6" />
        <h3 className="text-lg font-medium">API 키 삭제 확인</h3>
      </div>

      <p className="mb-6" style={{ color: colors.ui.normal }}>
        API 키를 삭제하면 이 키를 사용하는 모든 연동 서비스가 작동하지 않게
        됩니다. 정말 삭제하시겠습니까?
      </p>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onClose}>
          취소
        </Button>
        <Button variant="error" onClick={onDelete}>
          삭제
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteApiKeyModal;
