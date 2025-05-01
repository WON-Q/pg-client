import React, { useState } from "react";
import { XCircle, Globe, RefreshCw, AlertTriangle, Key } from "lucide-react";

interface CreateWebhookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateWebhook: (webhook: {
    name: string;
    url: string;
    eventTypes: string[];
    enabled: boolean;
  }) => void;
  isSubmitting: boolean;
}

const CreateWebhookModal: React.FC<CreateWebhookModalProps> = ({
  isOpen,
  onClose,
  onCreateWebhook,
  isSubmitting,
}) => {
  const [webhookName, setWebhookName] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [enabled, setEnabled] = useState(true);

  const eventTypes = [
    { id: "payment.created", label: "결제 생성됨" },
    { id: "payment.completed", label: "결제 완료됨" },
    { id: "payment.failed", label: "결제 실패" },
    { id: "payment.cancelled", label: "결제 취소됨" },
    { id: "payment.refunded", label: "결제 환불됨" },
    { id: "subscription.created", label: "구독 생성됨" },
    { id: "subscription.updated", label: "구독 업데이트됨" },
    { id: "subscription.cancelled", label: "구독 취소됨" },
    { id: "subscription.payment_failed", label: "구독 결제 실패" },
  ];

  const toggleEvent = (eventId: string) => {
    setSelectedEvents((prev) =>
      prev.includes(eventId)
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId]
    );
  };

  const handleSubmit = () => {
    if (
      !webhookName.trim() ||
      !webhookUrl.trim() ||
      selectedEvents.length === 0
    ) {
      alert("모든 필수 항목을 입력해주세요.");
      return;
    }

    if (!isValidUrl(webhookUrl)) {
      alert("유효한 URL을 입력해주세요.");
      return;
    }

    onCreateWebhook({
      name: webhookName,
      url: webhookUrl,
      eventTypes: selectedEvents,
      enabled,
    });
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">새 웹훅 생성</h3>
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
              htmlFor="webhookName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              웹훅 이름
            </label>
            <input
              type="text"
              id="webhookName"
              className="w-full px-3 py-2 border border-[#CDE5FF] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0067AC] focus:border-[#0067AC]"
              placeholder="예: 결제 알림 웹훅, 환불 알림 등"
              value={webhookName}
              onChange={(e) => setWebhookName(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="webhookUrl"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              <div className="flex items-center">
                <Globe className="h-4 w-4 mr-1" />
                웹훅 URL
              </div>
            </label>
            <input
              type="url"
              id="webhookUrl"
              className="w-full px-3 py-2 border border-[#CDE5FF] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0067AC] focus:border-[#0067AC]"
              placeholder="https://example.com/webhook"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
            />
            <p className="text-xs text-[#5E99D6] mt-1">
              이벤트 데이터가 전송될 엔드포인트 URL을 입력하세요. HTTPS를
              권장합니다.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이벤트 유형
            </label>
            <div className="grid grid-cols-2 gap-2">
              {eventTypes.map((event) => (
                <div key={event.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`event-${event.id}`}
                    checked={selectedEvents.includes(event.id)}
                    onChange={() => toggleEvent(event.id)}
                    className="h-4 w-4 rounded border-[#CDE5FF] text-[#0067AC] focus:ring-[#0067AC]"
                  />
                  <label
                    htmlFor={`event-${event.id}`}
                    className="ml-2 text-sm text-gray-700"
                  >
                    {event.label}{" "}
                    <span className="text-xs text-[#5E99D6]">({event.id})</span>
                  </label>
                </div>
              ))}
            </div>
            <p className="text-xs text-[#5E99D6] mt-1">
              웹훅에 포함시킬 이벤트 유형을 선택하세요. 최소 하나 이상 선택해야
              합니다.
            </p>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="webhookEnabled"
              checked={enabled}
              onChange={() => setEnabled(!enabled)}
              className="h-4 w-4 rounded border-[#CDE5FF] text-[#0067AC] focus:ring-[#0067AC]"
            />
            <label
              htmlFor="webhookEnabled"
              className="ml-2 text-sm text-gray-700"
            >
              웹훅 활성화
            </label>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-sm text-amber-800">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 text-amber-500" />
              <p>
                <strong>참고:</strong> 웹훅은 생성 즉시 시크릿 키가 발급됩니다.
                이 키는 웹훅 요청의 유효성을 검증하는데 사용되므로 안전하게
                보관하세요.
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
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
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

export default CreateWebhookModal;
