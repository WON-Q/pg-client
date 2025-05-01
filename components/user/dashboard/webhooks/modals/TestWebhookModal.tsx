import React, { useState } from "react";
import { XCircle, Send, RefreshCw } from "lucide-react";

interface TestWebhookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTestWebhook: (webhookId: string, eventType: string) => void;
  webhookId: string;
  webhookName?: string;
  availableEvents: string[];
  isTesting: boolean;
}

const TestWebhookModal: React.FC<TestWebhookModalProps> = ({
  isOpen,
  onClose,
  onTestWebhook,
  webhookId,
  webhookName,
  availableEvents,
  isTesting,
}) => {
  const [selectedEvent, setSelectedEvent] = useState(availableEvents[0] || "");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">웹훅 테스트</h3>
          <button
            className="text-gray-400 hover:text-gray-500"
            onClick={onClose}
          >
            <XCircle className="h-5 w-5" />
          </button>
        </div>

        <p className="mb-4 text-[#5E99D6]">
          <span className="font-medium text-gray-800">
            {webhookName || "선택한 웹훅"}
          </span>
          에 테스트 이벤트를 전송합니다. 이벤트 유형을 선택하세요.
        </p>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="eventType"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              이벤트 유형
            </label>
            <select
              id="eventType"
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="w-full px-3 py-2 border border-[#CDE5FF] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0067AC] focus:border-[#0067AC]"
            >
              {availableEvents.map((event) => (
                <option key={event} value={event}>
                  {event}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm">
            <p className="text-blue-800">
              테스트 이벤트에는 실제 데이터와 유사한 샘플 페이로드가 포함됩니다.
              이 이벤트는 웹훅 로그에 '<strong>test_event</strong>' 플래그와
              함께 기록됩니다.
            </p>
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
            className="px-4 py-2 rounded-md bg-[#0067AC] text-white hover:bg-[#397AB4] flex items-center"
            onClick={() => onTestWebhook(webhookId, selectedEvent)}
            disabled={isTesting}
          >
            {isTesting ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                전송 중...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                테스트 이벤트 전송
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestWebhookModal;
