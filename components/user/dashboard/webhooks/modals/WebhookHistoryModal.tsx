import React, { useState } from "react";
import {
  XCircle,
  CheckCircle2,
  XCircle as XCircleIcon,
  Clock,
  ArrowDownUp,
  RefreshCw,
} from "lucide-react";

interface WebhookEvent {
  id: string;
  webhookId: string;
  eventType: string;
  payload: any;
  status: "success" | "failed";
  statusCode: number;
  responseTime: number;
  triggeredAt: Date;
  error?: string;
  isTest?: boolean;
}

interface WebhookHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  webhookId: string;
  webhookName?: string;
  events: WebhookEvent[];
  onRetry?: (eventId: string) => void;
  isLoading: boolean;
}

const WebhookHistoryModal: React.FC<WebhookHistoryModalProps> = ({
  isOpen,
  onClose,
  webhookId,
  webhookName,
  events,
  onRetry,
  isLoading,
}) => {
  const [selectedEvent, setSelectedEvent] = useState<WebhookEvent | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "details">("list");

  if (!isOpen) return null;

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date);
  };

  const viewEventDetails = (event: WebhookEvent) => {
    setSelectedEvent(event);
    setViewMode("details");
  };

  const backToList = () => {
    setSelectedEvent(null);
    setViewMode("list");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">
            {viewMode === "list"
              ? `웹훅 이벤트 기록: ${webhookName || ""}`
              : "이벤트 상세 정보"}
          </h3>
          <button
            className="text-gray-400 hover:text-gray-500"
            onClick={onClose}
          >
            <XCircle className="h-5 w-5" />
          </button>
        </div>

        {viewMode === "list" ? (
          <>
            <div className="overflow-auto flex-1">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <RefreshCw className="h-6 w-6 animate-spin text-[#0067AC]" />
                  <span className="ml-2 text-[#0067AC]">로딩 중...</span>
                </div>
              ) : events.length === 0 ? (
                <div className="text-center py-12 text-[#5E99D6]">
                  <Clock className="h-12 w-12 mx-auto mb-2" />
                  <p>아직 기록된 이벤트가 없습니다.</p>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-[#CDE5FF]">
                  <thead className="bg-[#F6FBFF]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#0067AC] uppercase tracking-wider">
                        시간
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#0067AC] uppercase tracking-wider">
                        이벤트 유형
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#0067AC] uppercase tracking-wider">
                        상태
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#0067AC] uppercase tracking-wider">
                        응답시간
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-[#0067AC] uppercase tracking-wider">
                        작업
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-[#CDE5FF]">
                    {events.map((event) => (
                      <tr
                        key={event.id}
                        className="hover:bg-[#F6FBFF] cursor-pointer"
                        onClick={() => viewEventDetails(event)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {formatTime(event.triggeredAt)}
                          {event.isTest && (
                            <span className="ml-2 px-1 bg-blue-100 text-blue-800 text-xs rounded">
                              테스트
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {event.eventType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {event.status === "success" ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              성공
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <XCircleIcon className="h-3 w-3 mr-1" />
                              실패
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {event.responseTime}ms
                        </td>
                        <td className="px-6 py-4 text-right text-sm whitespace-nowrap">
                          {event.status === "failed" && onRetry && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onRetry(event.id);
                              }}
                              className="text-[#0067AC] hover:text-[#00508D]"
                            >
                              <RefreshCw className="h-4 w-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        ) : (
          <>
            {selectedEvent && (
              <div className="overflow-auto flex-1">
                <button
                  className="mb-4 text-[#0067AC] hover:underline flex items-center"
                  onClick={backToList}
                >
                  <ArrowDownUp className="h-4 w-4 mr-1 rotate-90" />
                  목록으로 돌아가기
                </button>

                <div className="space-y-4">
                  <div className="flex space-x-4">
                    <div className="w-1/2">
                      <div className="bg-[#F6FBFF] rounded-md p-4">
                        <h4 className="font-medium mb-2">이벤트 정보</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="text-[#5E99D6]">이벤트 ID:</div>
                          <div>{selectedEvent.id}</div>
                          <div className="text-[#5E99D6]">이벤트 유형:</div>
                          <div>{selectedEvent.eventType}</div>
                          <div className="text-[#5E99D6]">발생 시간:</div>
                          <div>{formatTime(selectedEvent.triggeredAt)}</div>
                          <div className="text-[#5E99D6]">상태:</div>
                          <div>
                            {selectedEvent.status === "success" ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                성공 ({selectedEvent.statusCode})
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                실패 ({selectedEvent.statusCode})
                              </span>
                            )}
                          </div>
                          <div className="text-[#5E99D6]">응답 시간:</div>
                          <div>{selectedEvent.responseTime}ms</div>
                          {selectedEvent.isTest && (
                            <>
                              <div className="text-[#5E99D6]">
                                테스트 이벤트:
                              </div>
                              <div>예</div>
                            </>
                          )}
                        </div>
                      </div>
                      {selectedEvent.status === "failed" &&
                        selectedEvent.error && (
                          <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
                            <h4 className="font-medium text-red-800 mb-2">
                              오류 메시지
                            </h4>
                            <pre className="text-sm text-red-700 whitespace-pre-wrap overflow-auto max-h-40">
                              {selectedEvent.error}
                            </pre>
                          </div>
                        )}
                    </div>

                    <div className="w-1/2">
                      <div className="bg-[#F6FBFF] rounded-md p-4">
                        <h4 className="font-medium mb-2">페이로드</h4>
                        <pre className="text-sm overflow-auto max-h-80 bg-white p-2 border border-[#CDE5FF] rounded">
                          {JSON.stringify(selectedEvent.payload, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        <div className="mt-6 flex justify-end">
          <button
            className="px-4 py-2 rounded-md bg-[#0067AC] text-white hover:bg-[#397AB4]"
            onClick={onClose}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default WebhookHistoryModal;
