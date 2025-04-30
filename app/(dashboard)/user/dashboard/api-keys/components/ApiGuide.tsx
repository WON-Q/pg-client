import React, { useState } from "react";
import { Info, ExternalLink } from "lucide-react";

// 코드 샘플 임포트
import {
  javascriptAuthSample,
  pythonAuthSample,
  javaAuthSample,
  restAuthSample,
  javascriptPaymentSample,
  pythonPaymentSample,
  javaPaymentSample,
  restPaymentSample,
  javascriptWebhookSample,
  pythonWebhookSample,
  javaWebhookSample,
} from "./code-samples";

// 코드 예제를 위한 탭 인터페이스 컴포넌트
const CodeTabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="flex space-x-2 mb-4 border-b overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`px-3 py-1 whitespace-nowrap ${
            activeTab === tab.id
              ? "border-b-2 border-[#0067AC] text-[#0067AC] font-medium"
              : "text-[#5E99D6] hover:text-[#0067AC]"
          }`}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default function ApiGuide() {
  const [authCodeTab, setAuthCodeTab] = useState("javascript");
  const [paymentCodeTab, setPaymentCodeTab] = useState("javascript");
  const [webhookCodeTab, setWebhookCodeTab] = useState("javascript");

  const authCodeTabs = [
    { id: "javascript", label: "JavaScript" },
    { id: "python", label: "Python" },
    { id: "java", label: "Java" },
    { id: "rest", label: "REST (cURL)" },
  ];

  const paymentCodeTabs = [
    { id: "javascript", label: "JavaScript" },
    { id: "python", label: "Python" },
    { id: "java", label: "Java" },
    { id: "rest", label: "REST (cURL)" },
  ];

  const webhookCodeTabs = [
    { id: "javascript", label: "JavaScript (Express)" },
    { id: "python", label: "Python (Flask)" },
    { id: "java", label: "Java (Spring)" },
  ];

  // 인증 코드 예제 매핑
  const authCodeExamples = {
    javascript: javascriptAuthSample,
    python: pythonAuthSample,
    java: javaAuthSample,
    rest: restAuthSample,
  };

  // 결제 코드 예제 매핑
  const paymentCodeExamples = {
    javascript: javascriptPaymentSample,
    python: pythonPaymentSample,
    java: javaPaymentSample,
    rest: restPaymentSample,
  };

  // 웹훅 코드 예제 매핑
  const webhookCodeExamples = {
    javascript: javascriptWebhookSample,
    python: pythonWebhookSample,
    java: javaWebhookSample,
  };

  return (
    <div className="rounded-lg border border-[#CDE5FF] bg-white p-6 space-y-8">
      <h2 className="text-xl font-medium">API 키 사용 가이드</h2>

      {/* 1. 액세스 토큰 발급 */}
      <section className="space-y-4">
        <h3 className="text-lg font-medium flex items-center">
          <span className="bg-[#0067AC] text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">
            1
          </span>
          액세스 토큰 발급
        </h3>
        <div className="bg-[#F6FBFF] rounded-md p-4">
          <p className="mb-3">
            API에 접근하기 위해서는 먼저 발급받은 API 키(api_key)와 API
            시크릿(api_secret)을 사용하여 액세스 토큰을 발급받아야 합니다. 이
            토큰은 API에 대한 실제 요청에 사용됩니다.
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-3">
            <h4 className="font-medium text-amber-800 mb-2">⚠️ 중요 정보</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-amber-700">
              <li>액세스 토큰의 유효 기간은 발급 시점부터 30분입니다.</li>
              <li>
                만료된 토큰으로 API 요청 시 401 Unauthorized 응답이 반환됩니다.
              </li>
              <li>토큰 만료 전 재발급 요청 시 기존 토큰이 반환됩니다.</li>
              <li>
                만료 1분 이내에 재발급 요청 시 토큰 유효 시간이 5분 연장됩니다.
              </li>
            </ul>
          </div>

          <div className="bg-[#eaf5ff] rounded-md p-4 my-3">
            <h4 className="font-medium mb-2">요청 정보</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>
                <strong>엔드포인트:</strong>{" "}
                <code>POST https://api.payment-system.com/v1/auth/token</code>
              </li>
              <li>
                <strong>Content-Type:</strong>{" "}
                <code>application/x-www-form-urlencoded</code>
              </li>
              <li>
                <strong>파라미터:</strong>
                <ul className="list-none pl-5 mt-1">
                  <li>
                    • <code>api_key</code>: API 키 (필수)
                  </li>
                  <li>
                    • <code>api_secret</code>: API 시크릿 (필수)
                  </li>
                </ul>
              </li>
            </ul>
          </div>

          <CodeTabs
            tabs={authCodeTabs}
            activeTab={authCodeTab}
            setActiveTab={setAuthCodeTab}
          />

          <pre className="bg-[#eaf5ff] rounded-md p-3 overflow-x-auto">
            <code>{authCodeExamples[authCodeTab]}</code>
          </pre>

          <div className="bg-green-50 border border-green-200 rounded-md p-3 mt-4 text-sm">
            <p className="font-medium text-green-800">응답 예시:</p>
            <pre className="bg-green-100/50 rounded p-2 mt-1 overflow-x-auto">
              <code>{`{
  "code": 0,
  "message": "success",
  "response": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expired_at": 1679533500,  // 유닉스 타임스탬프(초 단위)
    "now": 1679531700          // 현재 시간(초 단위)
  }
}`}</code>
            </pre>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-md p-3 mt-4 text-sm">
            <p className="font-medium text-red-800">오류 응답 예시:</p>
            <pre className="bg-red-100/50 rounded p-2 mt-1 overflow-x-auto">
              <code>{`{
  "code": 401,
  "message": "Invalid API key or secret",
  "response": null
}`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* 2. 결제 요청 생성 */}
      <section className="space-y-4">
        <h3 className="text-lg font-medium flex items-center">
          <span className="bg-[#0067AC] text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">
            2
          </span>
          결제 요청 생성
        </h3>
        <div className="bg-[#F6FBFF] rounded-md p-4">
          <p className="mb-2">
            발급받은 액세스 토큰을 사용하여 결제를 요청합니다. 응답으로 받은
            결제 URL로 고객을 리디렉션하면 결제 프로세스가 시작됩니다.
          </p>

          <div className="bg-[#eaf5ff] rounded-md p-4 my-3">
            <h4 className="font-medium mb-2">요청 정보</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>
                <strong>엔드포인트:</strong>{" "}
                <code>POST https://api.payment-system.com/v1/payments</code>
              </li>
              <li>
                <strong>인증 방식:</strong> Bearer 토큰 인증 (Authorization
                헤더)
              </li>
              <li>
                <strong>요청 형식:</strong> JSON
              </li>
              <li>
                <strong>필수 필드:</strong>
                <ul className="list-none pl-5 mt-1">
                  <li>
                    • <code>amount</code>: 결제 금액 (숫자)
                  </li>
                  <li>
                    • <code>currency</code>: 통화 코드 (예: KRW, USD)
                  </li>
                  <li>
                    • <code>orderId</code>: 상점 주문번호
                  </li>
                  <li>
                    • <code>successUrl</code>: 결제 성공 시 리디렉션 URL
                  </li>
                  <li>
                    • <code>cancelUrl</code>: 결제 취소 시 리디렉션 URL
                  </li>
                </ul>
              </li>
            </ul>
          </div>

          <CodeTabs
            tabs={paymentCodeTabs}
            activeTab={paymentCodeTab}
            setActiveTab={setPaymentCodeTab}
          />

          <pre className="bg-[#eaf5ff] rounded-md p-3 overflow-x-auto">
            <code>{paymentCodeExamples[paymentCodeTab]}</code>
          </pre>

          <div className="bg-green-50 border border-green-200 rounded-md p-3 mt-4 text-sm">
            <p className="font-medium text-green-800">응답 예시:</p>
            <pre className="bg-green-100/50 rounded p-2 mt-1 overflow-x-auto">
              <code>{`{
  "code": 0,
  "message": "success",
  "response": {
    "paymentId": "PAY_67890",
    "paymentUrl": "https://payment-gateway.com/pay/67890",
    "amount": 10000,
    "currency": "KRW",
    "orderId": "ORDER_12345",
    "status": "ready",
    "createdAt": "2023-07-10T09:30:00Z"
  }
}`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* 3. 웹훅 처리 섹션 */}
      <section className="space-y-4">
        <h3 className="text-lg font-medium flex items-center">
          <span className="bg-[#0067AC] text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">
            3
          </span>
          웹훅 처리
        </h3>
        <div className="bg-[#F6FBFF] rounded-md p-4">
          <p className="mb-2">
            결제 상태가 변경될 때마다 설정된 웹훅 URL로 이벤트 알림이
            전송됩니다. 이를 통해 결제 완료, 실패, 환불 등의 이벤트를 실시간으로
            처리할 수 있습니다.
          </p>

          {/* ... 웹훅 관련 부분 ... */}
          <div className="bg-[#eaf5ff] rounded-md p-4 my-3">
            <h4 className="font-medium mb-2">웹훅 이벤트 종류</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>
                <strong>payment.created</strong> - 결제 요청이 생성됨
              </li>
              <li>
                <strong>payment.completed</strong> - 결제가 성공적으로 완료됨
              </li>
              <li>
                <strong>payment.failed</strong> - 결제 진행 중 오류 발생
              </li>
              <li>
                <strong>payment.cancelled</strong> - 사용자가 결제를 취소함
              </li>
              <li>
                <strong>payment.refunded</strong> - 결제가 환불됨
              </li>
            </ul>
          </div>

          <CodeTabs
            tabs={webhookCodeTabs}
            activeTab={webhookCodeTab}
            setActiveTab={setWebhookCodeTab}
          />

          <pre className="bg-[#eaf5ff] rounded-md p-3 overflow-x-auto">
            <code>{webhookCodeExamples[webhookCodeTab]}</code>
          </pre>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mt-4 text-sm">
            <p className="font-medium text-blue-800">웹훅 요청 예시:</p>
            <pre className="bg-blue-100/50 rounded p-2 mt-1 overflow-x-auto">
              <code>{`{
  "type": "payment.completed",
  "id": "evt_12345",
  "createdAt": "2023-07-10T09:35:00Z",
  "data": {
    "paymentId": "PAY_67890",
    "orderId": "ORDER_12345",
    "amount": 10000,
    "currency": "KRW",
    "status": "completed",
    "paidAt": "2023-07-10T09:34:55Z"
  }
}`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* 4. 보안 권장사항 */}
      <section className="space-y-4">
        <h3 className="text-lg font-medium flex items-center">
          <span className="bg-[#0067AC] text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">
            4
          </span>
          보안 권장사항
        </h3>
        <div className="bg-[#F6FBFF] rounded-md p-4">
          <ul className="list-disc list-inside space-y-2">
            <li>
              API 키와 시크릿은 서버 측에서만 사용하고, 클라이언트에 노출하지
              마세요.
            </li>
            <li>
              액세스 토큰은 안전하게 저장하고, 만료 전에 자동으로 갱신하는
              로직을 구현하세요.
            </li>
            <li>API 호출은 항상 HTTPS를 통해 진행하세요.</li>
            <li>웹훅 요청의 서명을 항상 검증하여 유효성을 확인하세요.</li>
            <li>정기적으로 API 키를 교체하여 보안을 강화하세요.</li>
          </ul>
        </div>
      </section>

      <div className="flex justify-center mt-6">
        <a
          href="#"
          className="inline-flex items-center gap-2 text-[#0067AC] hover:underline"
          target="_blank"
        >
          <ExternalLink className="h-4 w-4" />
          전체 API 문서 보기
        </a>
      </div>
    </div>
  );
}
