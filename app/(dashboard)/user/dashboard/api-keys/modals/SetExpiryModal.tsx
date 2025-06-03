import React, { useState, useEffect } from "react";
import { Calendar, Info } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { colors } from "@/styles/theme";

interface SetExpiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (date: Date) => void;
  currentExpiry: Date | null;
}

export const SetExpiryModal: React.FC<SetExpiryModalProps> = ({
                                                                isOpen,
                                                                onClose,
                                                                onSave,
                                                                currentExpiry,
                                                              }) => {
  const [expiryDate, setExpiryDate] = useState<string>("");

  useEffect(() => {
    if (currentExpiry) {
      // 날짜를 YYYY-MM-DD 형식으로 변환
      setExpiryDate(currentExpiry.toISOString().split("T")[0]);
    } else {
      // 기본값은 오늘부터 90일 후
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 90);
      setExpiryDate(defaultDate.toISOString().split("T")[0]);
    }
  }, [currentExpiry]);

  const handleSave = () => {
    const date = new Date(expiryDate);
    onSave(date);
  };

  // 오늘 날짜를 YYYY-MM-DD 형식으로 얻기
  const today = new Date().toISOString().split("T")[0];

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex items-center mb-4">
        <Calendar
          className="h-5 w-5 mr-2"
          style={{ color: colors.primary.DEFAULT }}
        />
        <h3 className="text-lg font-medium">API 키 만료일 설정</h3>
      </div>

      <p className="mb-4 text-sm" style={{ color: colors.ui.normal }}>
        API 키의 만료일을 설정하면, 해당 날짜 이후에는 키가 자동으로
        비활성화됩니다. 만료일이 30일 이내인 키는 &apos;만료 예정&apos; 상태로
        표시됩니다.
      </p>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="expiryDate"
            className="block text-sm font-medium mb-1"
            style={{ color: colors.neutral[700] }}
          >
            만료일
          </label>
          <input
            type="date"
            id="expiryDate"
            min={today} // 오늘 이후 날짜만 선택 가능
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={
              {
                borderColor: colors.ui.assistive,
                "--tw-ring-color": colors.primary.DEFAULT,
              } as React.CSSProperties
            }
          />
        </div>

        <div
          className="flex items-center p-3 border rounded-md text-sm"
          style={{
            backgroundColor: colors.primary[50],
            borderColor: colors.primary[200],
            color: colors.primary[700],
          }}
        >
          <Info className="h-4 w-4 mr-2 flex-shrink-0" />
          <p>
            만료일이 지나면 API 키가 자동으로 만료되어 서비스에서 더 이상 사용할
            수 없게 됩니다.
          </p>
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <Button variant="outline" onClick={onClose}>
          취소
        </Button>
        <Button variant="primary" onClick={handleSave}>
          저장
        </Button>
      </div>
    </Modal>
  );
};
