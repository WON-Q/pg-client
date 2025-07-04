import { NextRequest, NextResponse } from "next/server";
import { BaseResponse, LoginRequestDto, LoginResponseDto } from "@/types/api";

/**
 * 로그인 API
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body: LoginRequestDto = await req.json();
    const { email, password } = body;

    // email과 password가 모두 입력되었는지 확인
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "아이디와 비밀번호를 모두 입력해주세요.",
        },
        { status: 400 }
      );
    }

    // 서버에 사용자 로그인 요청
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );

    // 응답 상태가 성공이 아닌 경우 처리
    if (!response.ok) {
      const errorData: BaseResponse<void> = await response.json();
      return NextResponse.json(
        {
          success: false,
          message: errorData.message || "로그인 실패",
        },
        { status: response.status }
      );
    }

    // 정상적인 로그인 응답인 경우
    const data: BaseResponse<LoginResponseDto> = await response.json();
    return NextResponse.json(data);

  } catch (error: unknown) {
    console.error("로그인 처리 중 오류 발생:", error);

    let errorMessage = "알 수 없는 오류가 발생했습니다.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      {
        success: false,
        message: `로그인 중 오류: ${errorMessage}`,
      },
      { status: 500 }
    );
  }
}
