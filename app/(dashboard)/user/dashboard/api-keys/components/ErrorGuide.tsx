import React from "react";
import { AlertCircle, AlertTriangle } from "lucide-react";

export default function ErrorGuide() {
  return (
    <div className="rounded-lg border border-[#CDE5FF] bg-white p-6 space-y-6">
      <h2 className="text-xl font-medium">에러 가이드</h2>
      <p className="text-[#5E99D6]">
        API 사용 중 발생할 수 있는 에러 코드와 해결 방법을 안내합니다.
      </p>

      <div className="space-y-4">
        <div className="border border-[#CDE5FF] rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-[#CDE5FF]">
            <thead className="bg-[#F6FBFF]">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-[#0067AC] uppercase tracking-wider"
                >
                  에러 코드
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-[#0067AC] uppercase tracking-wider"
                >
                  설명
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-[#0067AC] uppercase tracking-wider"
                >
                  해결 방법
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#CDE5FF]">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                    401
                  </span>
                  <span className="ml-2">AUTH_FAILED</span>
                </td>
                <td className="px-6 py-4">API 키 인증 실패</td>
                <td className="px-6 py-4 text-sm">
                  <ul className="list-disc list-inside">
                    <li>API 키가 올바른지 확인하세요.</li>
                    <li>인증 헤더 형식이 정확한지 확인하세요.</li>
                  </ul>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                    400
                  </span>
                  <span className="ml-2">INVALID_PARAMS</span>
                </td>
                <td className="px-6 py-4">요청 파라미터 오류</td>
                <td className="px-6 py-4 text-sm">
                  <ul className="list-disc list-inside">
                    <li>필수 파라미터가 모두 포함되어 있는지 확인하세요.</li>
                    <li>파라미터 형식이 올바른지 확인하세요.</li>
                  </ul>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                    402
                  </span>
                  <span className="ml-2">PAYMENT_FAILED</span>
                </td>
                <td className="px-6 py-4">결제 처리 실패</td>
                <td className="px-6 py-4 text-sm">
                  <ul className="list-disc list-inside">
                    <li>금액이 올바른지 확인하세요.</li>
                    <li>고객 정보가 정확한지 확인하세요.</li>
                    <li>결제 수단이 유효한지 확인하세요.</li>
                  </ul>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                    429
                  </span>
                  <span className="ml-2">RATE_LIMIT</span>
                </td>
                <td className="px-6 py-4">요청 한도 초과</td>
                <td className="px-6 py-4 text-sm">
                  <ul className="list-disc list-inside">
                    <li>API 호출 빈도를 줄이세요.</li>
                    <li>요청 횟수 제한을 확인하세요.</li>
                    <li>배치 처리를 고려하세요.</li>
                  </ul>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                    500
                  </span>
                  <span className="ml-2">SERVER_ERROR</span>
                </td>
                <td className="px-6 py-4">서버 내부 오류</td>
                <td className="px-6 py-4 text-sm">
                  <ul className="list-disc list-inside">
                    <li>잠시 후 다시 시도하세요.</li>
                    <li>문제가 지속되면 고객센터로 문의하세요.</li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-[#F6FBFF] border border-[#CDE5FF] rounded-md p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-[#0067AC] mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-[#0067AC]">
                에러 대응 팁
              </h3>
              <div className="mt-2 text-sm space-y-2">
                <p>
                  1. 모든 API 요청에 고유한 <code>idempotencyKey</code>를
                  포함시켜 중복 요청을 방지하세요.
                </p>
                <p>
                  2. 에러 발생 시 상세 정보는 응답의 <code>error.details</code>{" "}
                  필드에서 확인할 수 있습니다.
                </p>
                <p>
                  3. 네트워크 오류 발생 시 지수 백오프(exponential backoff)
                  방식으로 재시도하세요.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-md bg-[#fff8e6] p-4 border border-[#ffd978]">
        <div className="flex">
          <AlertTriangle className="h-5 w-5 text-[#f59e0b]" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-[#b45309]">
              환불 및 취소 정책
            </h3>
            <div className="mt-2 text-sm text-[#92400e]">
              <p>
                결제 완료 후 취소는 3시간 이내에만 API를 통해 자동으로 처리할 수
                있습니다. 이후 환불이 필요한 경우 관리자 대시보드 또는
                고객센터를 통해 요청하세요.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
