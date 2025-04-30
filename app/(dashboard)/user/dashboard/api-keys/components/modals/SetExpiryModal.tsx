import React, { useState, useEffect } from "react";
import { Calendar, XCircle } from "lucide-react";

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

  if (!isOpen) return null;

  const handleSave = () => {
    const date = new Date(expiryDate);
    onSave(date);
  };

  // 오늘 날짜를 YYYY-MM-DD 형식으로 얻기
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-[#0067AC]" />
            <h3 className="text-lg font-medium">API 키 만료일 설정</h3>
          </div>
          <button
            className="text-gray-400 hover:text-gray-500"
            onClick={onClose}
          >
            <XCircle className="h-5 w-5" />
          </button>
        </div>

        <p className="mb-4 text-sm text-[#5E99D6]">
          API 키의 만료일을 설정하면, 해당 날짜 이후에는 키가 자동으로
          비활성화됩니다. 만료일이 30일 이내인 키는 '만료 예정' 상태로
          표시됩니다.
        </p>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="expiryDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              만료일
            </label>
            <input
              type="date"
              id="expiryDate"
              min={today} // 오늘 이후 날짜만 선택 가능
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full px-3 py-2 border border-[#CDE5FF] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0067AC] focus:border-[#0067AC]"
            />
          </div>

          <div className="flex items-center p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-700">
            <Info className="h-4 w-4 mr-2 flex-shrink-0" />
            <p>
              만료일이 지나면 API 키가 자동으로 만료되어 서비스에서 더 이상
              사용할 수 없게 됩니다.
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            className="px-4 py-2 border border-[#CDE5FF] rounded-md hover:bg-[#F6FBFF] transition-colors"
            onClick={onClose}
          >
            취소
          </button>
          <button
            className="px-4 py-2 bg-[#0067AC] text-white rounded-md hover:bg-[#00508D] transition-colors"
            onClick={handleSave}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
};
