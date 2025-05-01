import React, { useState } from "react";
import {
  BookOpen,
  Check,
  Copy,
  AlertTriangle,
  Info,
  ExternalLink,
} from "lucide-react";
import {
  javascriptWebhookSample,
  pythonWebhookSample,
  phpWebhookSample,
  javaWebhookSample,
} from "@/code-samples";

export default function WebhookGuide() {
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  // 탭 관련 타입 정의
  type CodeLanguage = "nodejs" | "python" | "php" | "java";

  interface Tab {
    id: CodeLanguage;
    label: string;
  }

  interface CodeTabsProps {
    tabs: Tab[];
    activeTab: string;
    setActiveTab: (id: CodeLanguage) => void;
  }

  // 코드 예제를 위한 탭 인터페이스 컴포넌트
  const CodeTabs: React.FC<CodeTabsProps> = ({
    tabs,
    activeTab,
    setActiveTab,
  }) => {
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

  const [codeTab, setCodeTab] = useState<CodeLanguage>("nodejs");

  const codeTabs: Tab[] = [
    { id: "nodejs", label: "Node.js (Express)" },
    { id: "python", label: "Python (Flask)" },
    { id: "php", label: "PHP" },
    { id: "java", label: "Java (Spring)" },
  ];

  // 코드 예제 매핑
  const codeExamples: Record<CodeLanguage, string> = {
    nodejs: javascriptWebhookSample,
    python: pythonWebhookSample,
    php: phpWebhookSample,
    java: javaWebhookSample,
  };

  return (
    <div className="rounded-lg border border-[#CDE5FF] bg-white p-6 space-y-8">
      <div className="flex items-start gap-3">
        <BookOpen className="h-6 w-6 text-[#0067AC]" />
        <div>
          <h2 className="text-xl font-medium">웹훅 사용 가이드</h2>
          <p className="text-[#5E99D6] mt-1">
            웹훅을 사용하여 결제 이벤트를 실시간으로 처리하는 방법을 안내합니다.
          </p>
        </div>
      </div>

      {/* 1. 웹훅 개요 */}
      <section className="space-y-4">
        <h3 className="text-lg font-medium flex items-center">
          <span className="bg-[#0067AC] text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">
            1
          </span>
          웹훅 개요
        </h3>
        <div className="bg-[#F6FBFF] rounded-md p-4">
          <p className="mb-3">
            웹훅(Webhook)은 특정 이벤트가 발생했을 때 실시간으로 알림을 받을 수
            있는 방법입니다. 결제 시스템에서 결제 완료, 실패, 환불 등의 이벤트가
            발생하면 등록된 웹훅 URL로 HTTP POST 요청을 보냅니다.
          </p>

          <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-3">
            <h4 className="font-medium text-green-800 mb-2">✅ 웹훅의 장점</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-green-700">
              <li>실시간으로 결제 상태 변경을 감지할 수 있습니다.</li>
              <li>API를 주기적으로 호출(폴링)할 필요가 없어 효율적입니다.</li>
              <li>
                결제 프로세스 완료 후 비동기적으로 추가 작업을 처리할 수
                있습니다.
              </li>
              <li>
                사용자 리다이렉션이 실패하더라도 결제 상태를 안정적으로 처리할
                수 있습니다.
              </li>
            </ul>
          </div>

          <div className="bg-[#eaf5ff] rounded-md p-4 my-3">
            <h4 className="font-medium mb-2">웹훅 요청 형식</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>
                <strong>HTTP 메서드:</strong> POST
              </li>
              <li>
                <strong>요청 헤더:</strong>
                <ul className="list-none pl-5 mt-1">
                  <li>
                    • <code>Content-Type</code>: <code>application/json</code>
                  </li>
                  <li>
                    • <code>X-Signature</code>: <code>sha256=...</code> (HMAC
                    서명)
                  </li>
                  <li>
                    • <code>X-Event-Id</code>: 이벤트 고유 ID
                  </li>
                </ul>
              </li>
              <li>
                <strong>요청 본문:</strong> JSON 형식의 이벤트 데이터
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm">
            <p className="font-medium text-blue-800">웹훅 요청 예시:</p>
            <pre className="bg-blue-100/50 rounded p-2 mt-1 overflow-x-auto text-xs">
              <code>{`{
  "type": "payment.completed",   // 이벤트 유형
  "id": "evt_12345abcdef",       // 이벤트 고유 ID
  "createdAt": "2023-07-10T09:35:00Z",  // 이벤트 생성 시간
  "data": {                      // 이벤트 데이터
    "paymentId": "pay_67890",
    "merchantId": "mer_12345",
    "orderId": "order_12345",
    "amount": 15000,
    "currency": "KRW",
    "status": "completed",
    "paymentMethod": "card",
    "paidAt": "2023-07-10T09:34:55Z"
  }
}`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* 2. 웹훅 설정 방법 */}
      <section className="space-y-4">
        <h3 className="text-lg font-medium flex items-center">
          <span className="bg-[#0067AC] text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">
            2
          </span>
          웹훅 설정 방법
        </h3>
        <div className="bg-[#F6FBFF] rounded-md p-4">
          <p className="mb-3">
            웹훅을 사용하기 위해서는 다음과 같은 단계를 따라주세요:
          </p>

          <ol className="list-decimal list-inside space-y-3 mb-3">
            <li className="font-medium">웹훅을 수신할 엔드포인트 준비</li>
            <p className="text-sm ml-6 text-[#5E99D6]">
              웹훅 요청을 수신하고 처리할 수 있는 공개적으로 접근 가능한 HTTP
              엔드포인트를 준비합니다.
            </p>

            <li className="font-medium">대시보드에서 웹훅 등록</li>
            <p className="text-sm ml-6 text-[#5E99D6]">
              대시보드의 웹훅 관리 페이지에서 '새 웹훅 생성' 버튼을 클릭하여
              웹훅 URL과 수신할 이벤트 유형을 설정합니다.
            </p>

            <li className="font-medium">웹훅 시크릿 저장</li>
            <p className="text-sm ml-6 text-[#5E99D6]">
              웹훅 생성 시 발급되는 시크릿 키를 안전하게 저장합니다. 이 키는
              수신된 웹훅의 유효성을 검증하는 데 사용됩니다.
            </p>

            <li className="font-medium">서명 검증 구현</li>
            <p className="text-sm ml-6 text-[#5E99D6]">
              웹훅 요청의 <code>X-Signature</code> 헤더를 검증하여 요청의
              진위성을 확인하는 로직을 구현합니다.
            </p>

            <li className="font-medium">테스트 이벤트 전송</li>
            <p className="text-sm ml-6 text-[#5E99D6]">
              대시보드에서 '테스트 이벤트 전송' 기능을 사용하여 웹훅이 올바르게
              설정되었는지 확인합니다.
            </p>
          </ol>

          <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-3">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 text-amber-500" />
              <div>
                <h4 className="font-medium text-amber-800">
                  웹훅 URL 요구사항
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-amber-700 mt-1">
                  <li>인터넷에서 공개적으로 접근 가능해야 합니다.</li>
                  <li>HTTPS 프로토콜을 사용할 것을 강력히 권장합니다.</li>
                  <li>
                    응답 시간은 10초 이내여야 합니다. 오래 걸리는 작업은
                    비동기적으로 처리하세요.
                  </li>
                  <li>3xx 리다이렉션은 지원하지 않습니다.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 웹훅 서명 검증 */}
      <section className="space-y-4">
        <h3 className="text-lg font-medium flex items-center">
          <span className="bg-[#0067AC] text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">
            3
          </span>
          웹훅 서명 검증
        </h3>
        <div className="bg-[#F6FBFF] rounded-md p-4">
          <p className="mb-3">
            모든 웹훅 요청에는 <code>X-Signature</code> 헤더가 포함되어
            있습니다. 이 서명을 검증하여 웹훅 요청이 실제로 당사 서버에서
            전송되었으며 변경되지 않았는지 확인해야 합니다.
          </p>

          <div className="bg-[#eaf5ff] rounded-md p-4 my-3">
            <h4 className="font-medium mb-2">서명 검증 단계</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>요청 본문(raw payload)을 문자열로 가져옵니다.</li>
              <li>
                웹훅 생성 시 발급받은 웹훅 시크릿을 사용하여 HMAC-SHA256 해시를
                계산합니다.
              </li>
              <li>
                계산된 해시 값을 <code>X-Signature</code> 헤더 값과 비교합니다.
              </li>
              <li>서명이 일치하지 않으면 요청을 거부합니다.</li>
            </ol>
          </div>

          <CodeTabs
            tabs={codeTabs}
            activeTab={codeTab}
            setActiveTab={(id) => setCodeTab(id as CodeLanguage)}
          />

          <div className="relative">
            <pre className="bg-[#eaf5ff] rounded-md p-3 overflow-x-auto">
              <code>{codeExamples[codeTab]}</code>
            </pre>
            <button
              className="absolute top-3 right-3 bg-white/80 hover:bg-white p-1 rounded border border-[#CDE5FF]"
              onClick={() => copyToClipboard(codeExamples[codeTab], codeTab)}
            >
              {copiedSnippet === codeTab ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4 text-[#0067AC]" />
              )}
            </button>
          </div>
        </div>
      </section>

      {/* 4. 웹훅 이벤트 처리 */}
      <section className="space-y-4">
        <h3 className="text-lg font-medium flex items-center">
          <span className="bg-[#0067AC] text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">
            4
          </span>
          웹훅 이벤트 처리
        </h3>
        <div className="bg-[#F6FBFF] rounded-md p-4">
          <p className="mb-3">
            서명 검증 후에는 이벤트 유형에 따라 적절한 처리를 해야 합니다. 각
            이벤트 유형별 처리 예시는 다음과 같습니다:
          </p>

          <div className="bg-white border border-[#CDE5FF] rounded-md overflow-hidden mb-3">
            <table className="min-w-full divide-y divide-[#CDE5FF]">
              <thead className="bg-[#F6FBFF]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#0067AC] uppercase tracking-wider">
                    이벤트 유형
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#0067AC] uppercase tracking-wider">
                    처리 방법
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#CDE5FF]">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <code className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                      payment.created
                    </code>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    결제 요청이 생성되었음을 기록하고, 필요한 경우 주문 상태를
                    업데이트합니다.
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <code className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                      payment.completed
                    </code>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <ul className="list-disc list-inside">
                      <li>주문 상태를 '결제 완료'로 업데이트</li>
                      <li>영수증 생성 및 이메일 발송</li>
                      <li>재고 관리 시스템 업데이트</li>
                      <li>고객에게 주문 확인 알림</li>
                    </ul>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <code className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                      payment.failed
                    </code>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <ul className="list-disc list-inside">
                      <li>주문 상태를 '결제 실패'로 업데이트</li>
                      <li>고객에게 결제 실패 알림 및 대안 제시</li>
                      <li>실패 원인 분석 및 로깅</li>
                    </ul>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <code className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                      payment.cancelled
                    </code>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <ul className="list-disc list-inside">
                      <li>주문 상태를 '결제 취소'로 업데이트</li>
                      <li>예약된 리소스 반환</li>
                    </ul>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <code className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                      payment.refunded
                    </code>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <ul className="list-disc list-inside">
                      <li>주문 상태를 '환불 완료'로 업데이트</li>
                      <li>환불 영수증 발행 및 고객에게 발송</li>
                      <li>필요한 경우 재고 관리 시스템 업데이트</li>
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <div className="flex items-start">
              <Info className="h-5 w-5 mr-2 flex-shrink-0 text-blue-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-800">
                  웹훅 처리 모범 사례
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-blue-700 mt-1">
                  <li>
                    웹훅 요청을 수신하면 즉시 2xx 상태 코드로 응답하세요. 처리
                    시간이 오래 걸리는 작업은 비동기적으로 진행하세요.
                  </li>
                  <li>
                    중복 이벤트에 대비하세요. 동일한 이벤트가 여러 번 전송될 수
                    있습니다 (멱등성 보장).
                  </li>
                  <li>
                    이벤트 ID(<code>id</code> 필드)를 저장하여 중복 처리를
                    방지하세요.
                  </li>
                  <li>
                    모든 웹훅 요청과 처리 결과를 로깅하세요. 디버깅에 도움이
                    됩니다.
                  </li>
                  <li>
                    웹훅 처리에 실패한 경우를 대비한 재처리 메커니즘을
                    구현하세요.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 웹훅 에러 처리 및 재시도 정책 */}
      <section className="space-y-4">
        <h3 className="text-lg font-medium flex items-center">
          <span className="bg-[#0067AC] text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">
            5
          </span>
          에러 처리 및 재시도 정책
        </h3>
        <div className="bg-[#F6FBFF] rounded-md p-4">
          <p className="mb-3">
            웹훅 전송에 실패할 경우, 다음과 같은 재시도 정책을 따릅니다:
          </p>

          <div className="bg-white border border-[#CDE5FF] rounded-md overflow-hidden mb-3">
            <table className="min-w-full divide-y divide-[#CDE5FF]">
              <thead className="bg-[#F6FBFF]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#0067AC] uppercase tracking-wider">
                    상황
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#0067AC] uppercase tracking-wider">
                    정책
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#CDE5FF]">
                <tr>
                  <td className="px-6 py-4 text-sm">
                    웹훅 URL에 접속할 수 없음
                  </td>
                  <td className="px-6 py-4 text-sm">
                    지수 백오프 방식으로 최대 5회 재시도합니다. (2분, 5분, 15분,
                    30분, 1시간)
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm">
                    서버가 3xx-4xx 응답 반환
                  </td>
                  <td className="px-6 py-4 text-sm">
                    404, 410을 제외한 모든 3xx, 4xx 응답에 대해 위와 동일한
                    방식으로 재시도합니다. (404 및 410은 엔드포인트가 더 이상
                    존재하지 않음을 의미하므로 재시도하지 않습니다.)
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm">서버가 5xx 응답 반환</td>
                  <td className="px-6 py-4 text-sm">
                    지수 백오프 방식으로 최대 5회 재시도합니다.
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm">10초 이내 응답 없음</td>
                  <td className="px-6 py-4 text-sm">
                    타임아웃으로 처리하고 지수 백오프 방식으로 재시도합니다.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 text-amber-500" />
              <div>
                <h4 className="font-medium text-amber-800">
                  웹훅 실패 시 대응 방안
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-amber-700 mt-1">
                  <li>
                    웹훅 관리 대시보드에서 전송 실패한 이벤트를 확인하고
                    수동으로 재시도할 수 있습니다.
                  </li>
                  <li>
                    5회 연속 실패 시 웹훅은 비활성화 상태로 전환되며, 수동으로
                    다시 활성화해야 합니다.
                  </li>
                  <li>
                    API를 통해 최근 이벤트 이력을 조회하여 웹훅 수신에 실패한
                    이벤트를 처리할 수 있습니다.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. 로컬 개발 및 테스트 */}
      <section className="space-y-4">
        <h3 className="text-lg font-medium flex items-center">
          <span className="bg-[#0067AC] text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">
            6
          </span>
          로컬 개발 및 테스트
        </h3>
        <div className="bg-[#F6FBFF] rounded-md p-4">
          <p className="mb-3">
            로컬 개발 환경에서 웹훅을 테스트하기 위한 방법을 소개합니다:
          </p>

          <div className="space-y-4">
            <div className="bg-[#eaf5ff] rounded-md p-4">
              <h4 className="font-medium mb-2">1. 터널링 서비스 사용</h4>
              <p className="text-sm mb-2">
                ngrok, localtunnel 등의 터널링 서비스를 사용하여 로컬 서버를
                인터넷에 노출시킬 수 있습니다.
              </p>
              <div className="bg-[#d8e9f9] rounded-md p-2 text-xs overflow-x-auto">
                <code>
                  # ngrok 설치 및 실행 예시
                  <br />
                  npm install -g ngrok
                  <br />
                  ngrok http 3000
                </code>
              </div>
              <p className="text-sm mt-2">
                생성된 URL(예: https://abcd1234.ngrok.io)을 웹훅 URL로 등록하여
                테스트할 수 있습니다.
              </p>
            </div>

            <div className="bg-[#eaf5ff] rounded-md p-4">
              <h4 className="font-medium mb-2">2. 테스트 이벤트 전송</h4>
              <p className="text-sm">
                대시보드의 웹훅 관리 페이지에서 '테스트 이벤트 전송' 기능을
                사용하여 원하는 이벤트 유형의 테스트 데이터를 수신할 수
                있습니다.
              </p>
            </div>

            <div className="bg-[#eaf5ff] rounded-md p-4">
              <h4 className="font-medium mb-2">3. 웹훅 이벤트 로그</h4>
              <p className="text-sm">
                대시보드에서 웹훅 이벤트 전송 기록을 확인하고, 상태 코드, 응답
                시간, 오류 메시지 등의 상세 정보를 볼 수 있습니다.
              </p>
            </div>

            <div className="bg-[#eaf5ff] rounded-md p-4">
              <h4 className="font-medium mb-2">4. 페이로드 검증 도구</h4>
              <p className="text-sm">
                대시보드에서 제공하는 서명 검증 도구를 사용하여 웹훅 서명 검증
                로직이 올바르게 작동하는지 확인할 수 있습니다.
              </p>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-md p-3 mt-4">
            <div className="flex">
              <Info className="h-5 w-5 mr-2 flex-shrink-0 text-green-500" />
              <div>
                <h4 className="font-medium text-green-800">
                  팁: 로컬 웹훅 시뮬레이터
                </h4>
                <p className="text-sm text-green-700 mt-1">
                  개발 중에는 실제 웹훅 이벤트와 동일한 형식의 요청을 생성하는
                  시뮬레이터를 만들어 사용하면 편리합니다. 시뮬레이터는 서명
                  계산과 다양한 이벤트 유형 테스트에 도움이 됩니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="flex justify-center mt-6">
        <a
          href="/user/dashboard/webhooks/events"
          className="inline-flex items-center gap-2 text-[#0067AC] hover:underline"
        >
          <ExternalLink className="h-4 w-4" />
          웹훅 이벤트 유형 상세 보기
        </a>
      </div>
    </div>
  );
}
