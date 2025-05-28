import { TokenDto } from "@/types/api";

/**
 * 사용자 로그인 요청 DTO
 */
export interface LoginRequestDto {
  /**
   * 사용자 계정 ID (이메일)
   */
  email: string;

  /**
   * 사용자 비밀번호
   */
  password: string;
}

/**
 * 사용자 로그인 응답 DTO
 */
export interface LoginResponseDto {
  /**
   * 사용자 ID
   */
  id: number;

  /**
   * 사용자 이름
   */
  name: string;

  /**
   * 사용자 이메일
   */
  email: string;

  /**
   * 사용자 토큰 정보
   */
  token: TokenDto;
}
