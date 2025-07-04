import { NextRequest, NextResponse } from "next/server";
import { BaseResponse, Page } from "@/types/api";
import { ApiKeyResponseDto } from "@/types/api";

/**
 * API 키 목록 조회 API (가맹점용)
 *
 * @param req - API 키 목록 조회 요청 정보
 * @returns API 키 목록과 페이징 정보가 포함된 응답
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);

    // 페이지네이션 파라미터 추출
    const page = searchParams.get("page") || "0";
    const size = searchParams.get("size") || "10";
    const sort = searchParams.get("sort") || "id,desc";

    // API 키 목록 조회 URL
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/api-keys?page=${page}&size=${size}&sort=${sort}`;

    // 인증 토큰 가져오기
    const authToken = req.headers.get("Authorization")?.replace("Bearer ", "");

    // 인증 토큰이 없는 경우
    if (!authToken) {
      return NextResponse.json(
        {
          success: false,
          message: "인증 토큰이 없습니다. 로그인 후 다시 시도해주세요.",
        },
        { status: 401 }
      );
    }

    // 백엔드 API 호출
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    });

    // 응답 상태가 성공이 아닌 경우 처리
    if (!response.ok) {
      const errorData: BaseResponse<void> = await response.json();
      return NextResponse.json(
        {
          success: false,
          message: errorData.message || "API 키 목록 조회 실패",
        },
        { status: response.status }
      );
    }

    // 정상적인 응답인 경우
    const data: BaseResponse<Page<ApiKeyResponseDto>> = await response.json();
    return NextResponse.json(data);

  } catch (error: unknown) {
    console.error("API 키 목록 조회 중 오류 발생:", error);

    let errorMessage = "알 수 없는 오류가 발생했습니다.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      {
        success: false,
        message: `API 키 목록 조회 중 오류: ${errorMessage}`,
      },
      { status: 500 }
    );
  }
}
