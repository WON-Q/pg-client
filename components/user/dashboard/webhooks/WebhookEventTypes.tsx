import React from "react";
import { Zap, AlertCircle, Info } from "lucide-react";

interface EventType {
  id: string;
  name: string;
  description: string;
  category: "payment" | "subscription" | "customer";
  payload: Record<string, any>;
}

export default function WebhookEventTypes() {
  const eventTypes: EventType[] = [
    {
      id: "payment.created",
      name: "결제 생성",
      description: "결제 요청이 생성되었을 때 발생합니다.",
      category: "payment",
      payload: {
        paymentId: "pay_AbCdEfGhIjKlMnOp",
        merchantId: "mer_1234567890",
        customerId: "cus_AbCdEfGhIjKl",
        amount: 15000,
        currency: "KRW",
        orderId: "order_12345",
        status: "created",
        createdAt: "2023-07-01T12:30:45Z",
      },
    },
    {
      id: "payment.completed",
      name: "결제 완료",
      description: "결제가 성공적으로 완료되었을 때 발생합니다.",
      category: "payment",
      payload: {
        paymentId: "pay_AbCdEfGhIjKlMnOp",
        merchantId: "mer_1234567890",
        customerId: "cus_AbCdEfGhIjKl",
        amount: 15000,
        currency: "KRW",
        orderId: "order_12345",
        paymentMethodType: "card",
        paymentMethodDetail: {
          cardType: "credit",
          cardIssuer: "비씨카드",
          cardNumber: "************1234",
          cardOwnerType: "personal",
        },
        status: "completed",
        createdAt: "2023-07-01T12:30:45Z",
        completedAt: "2023-07-01T12:31:15Z",
      },
    },
    {
      id: "payment.failed",
      name: "결제 실패",
      description: "결제 처리 중 오류가 발생했을 때 발생합니다.",
      category: "payment",
      payload: {
        paymentId: "pay_AbCdEfGhIjKlMnOp",
        merchantId: "mer_1234567890",
        customerId: "cus_AbCdEfGhIjKl",
        amount: 15000,
        currency: "KRW",
        orderId: "order_12345",
        paymentMethodType: "card",
        status: "failed",
        error: {
          code: "card_declined",
          message: "카드 한도 초과",
          detail: "잔액 부족",
        },
        createdAt: "2023-07-01T12:30:45Z",
        failedAt: "2023-07-01T12:31:00Z",
      },
    },
    {
      id: "payment.cancelled",
      name: "결제 취소",
      description: "결제가 취소되었을 때 발생합니다.",
      category: "payment",
      payload: {
        paymentId: "pay_AbCdEfGhIjKlMnOp",
        merchantId: "mer_1234567890",
        customerId: "cus_AbCdEfGhIjKl",
        amount: 15000,
        currency: "KRW",
        orderId: "order_12345",
        status: "cancelled",
        cancelReason: "user_request",
        createdAt: "2023-07-01T12:30:45Z",
        cancelledAt: "2023-07-01T13:45:15Z",
      },
    },
    {
      id: "payment.refunded",
      name: "결제 환불",
      description: "결제가 환불되었을 때 발생합니다.",
      category: "payment",
      payload: {
        paymentId: "pay_AbCdEfGhIjKlMnOp",
        merchantId: "mer_1234567890",
        refundId: "ref_AbCdEfGhIjKl",
        customerId: "cus_AbCdEfGhIjKl",
        amount: 15000,
        refundAmount: 15000,
        currency: "KRW",
        orderId: "order_12345",
        status: "refunded",
        refundReason: "product_unsatisfactory",
        createdAt: "2023-07-01T12:30:45Z",
        completedAt: "2023-07-01T12:31:15Z",
        refundedAt: "2023-07-03T09:15:22Z",
      },
    },
    {
      id: "subscription.created",
      name: "구독 생성",
      description: "새로운 구독이 생성되었을 때 발생합니다.",
      category: "subscription",
      payload: {
        subscriptionId: "sub_AbCdEfGhIjKl",
        merchantId: "mer_1234567890",
        customerId: "cus_AbCdEfGhIjKl",
        planId: "plan_premium_monthly",
        status: "active",
        amount: 9900,
        currency: "KRW",
        billingCycle: "monthly",
        currentPeriodStart: "2023-07-01T00:00:00Z",
        currentPeriodEnd: "2023-08-01T00:00:00Z",
        createdAt: "2023-07-01T10:15:30Z",
      },
    },
    {
      id: "subscription.updated",
      name: "구독 업데이트",
      description: "구독 정보가 변경되었을 때 발생합니다.",
      category: "subscription",
      payload: {
        subscriptionId: "sub_AbCdEfGhIjKl",
        merchantId: "mer_1234567890",
        customerId: "cus_AbCdEfGhIjKl",
        status: "active",
        changes: {
          oldPlanId: "plan_premium_monthly",
          newPlanId: "plan_premium_annually",
          oldAmount: 9900,
          newAmount: 99000,
          oldBillingCycle: "monthly",
          newBillingCycle: "annually",
        },
        updatedAt: "2023-07-15T14:22:45Z",
      },
    },
    {
      id: "subscription.cancelled",
      name: "구독 취소",
      description: "구독이 취소되었을 때 발생합니다.",
      category: "subscription",
      payload: {
        subscriptionId: "sub_AbCdEfGhIjKl",
        merchantId: "mer_1234567890",
        customerId: "cus_AbCdEfGhIjKl",
        status: "cancelled",
        cancelReason: "user_request",
        planId: "plan_premium_monthly",
        effectiveUntil: "2023-08-01T00:00:00Z",
        cancelledAt: "2023-07-20T11:05:12Z",
        isImmediateCancel: false,
      },
    },
    {
      id: "subscription.payment_failed",
      name: "구독 결제 실패",
      description: "정기 결제가 실패했을 때 발생합니다.",
      category: "subscription",
      payload: {
        subscriptionId: "sub_AbCdEfGhIjKl",
        merchantId: "mer_1234567890",
        customerId: "cus_AbCdEfGhIjKl",
        paymentId: "pay_FailedPayment123",
        status: "past_due",
        planId: "plan_premium_monthly",
        amount: 9900,
        currency: "KRW",
        failedAt: "2023-08-01T00:15:22Z",
        nextRetryAt: "2023-08-02T00:15:22Z",
        attemptCount: 1,
        maxAttempts: 3,
        error: {
          code: "card_declined",
          message: "카드 한도 초과",
        },
      },
    },
  ];

  return (
    <div className="rounded-lg border border-[#CDE5FF] bg-white p-6 space-y-6">
      <div className="flex items-start gap-3">
        <Zap className="h-5 w-5 text-[#0067AC] mt-1" />
        <div>
          <h2 className="text-xl font-medium">웹훅 이벤트 유형</h2>
          <p className="text-[#5E99D6] mt-1">
            웹훅으로 수신할 수 있는 모든 이벤트 유형과 해당 페이로드 정보입니다.
          </p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
        <div className="flex gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-amber-800">웹훅 이벤트 유의사항</h3>
            <ul className="mt-1 list-disc pl-5 text-sm text-amber-700 space-y-1">
              <li>이벤트는 순서대로 전달되지 않을 수 있습니다.</li>
              <li>
                동일한 이벤트가 여러 번 전송될 수 있으므로 중복 처리에 대비해야
                합니다.
              </li>
              <li>
                웹훅 수신 서버는 2XX 응답을 빠르게 반환해야 합니다. 시간이 오래
                걸리는 작업은 비동기로 처리하세요.
              </li>
              <li>
                전송 실패 시, 지수 백오프 방식으로 최대 1시간 동안 5회까지
                재시도합니다.
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-3">결제 이벤트</h3>
          <div className="space-y-4">
            {eventTypes
              .filter((event) => event.category === "payment")
              .map((event) => (
                <div
                  key={event.id}
                  className="border border-[#CDE5FF] rounded-lg overflow-hidden"
                >
                  <div className="bg-[#F6FBFF] px-4 py-3 border-b border-[#CDE5FF]">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">
                          <code className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-md">
                            {event.id}
                          </code>
                        </h4>
                        <p className="text-[#0067AC] text-sm mt-1">
                          {event.name} - {event.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-white">
                    <h5 className="text-sm font-medium mb-2 text-gray-700">
                      샘플 페이로드
                    </h5>
                    <pre className="bg-gray-50 p-3 rounded-md overflow-x-auto text-xs">
                      <code>{JSON.stringify(event.payload, null, 2)}</code>
                    </pre>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-3">구독 이벤트</h3>
          <div className="space-y-4">
            {eventTypes
              .filter((event) => event.category === "subscription")
              .map((event) => (
                <div
                  key={event.id}
                  className="border border-[#CDE5FF] rounded-lg overflow-hidden"
                >
                  <div className="bg-[#F6FBFF] px-4 py-3 border-b border-[#CDE5FF]">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">
                          <code className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-md">
                            {event.id}
                          </code>
                        </h4>
                        <p className="text-[#0067AC] text-sm mt-1">
                          {event.name} - {event.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-white">
                    <h5 className="text-sm font-medium mb-2 text-gray-700">
                      샘플 페이로드
                    </h5>
                    <pre className="bg-gray-50 p-3 rounded-md overflow-x-auto text-xs">
                      <code>{JSON.stringify(event.payload, null, 2)}</code>
                    </pre>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="bg-[#F6FBFF] border border-[#CDE5FF] rounded-md p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-[#0067AC] flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-[#0067AC]">
              이벤트 확장 예정 안내
            </h3>
            <p className="mt-1 text-sm text-[#5E99D6]">
              향후 고객 생성, 변경 등의 고객 관련 이벤트와 정산 관련 이벤트가
              추가될 예정입니다. 필요한 이벤트 유형이 있으시면 고객센터로 문의해
              주세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
