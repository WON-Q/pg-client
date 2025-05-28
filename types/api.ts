export interface BaseResponse<T> {
  isSuccess: boolean;
  statusCode: number;
  message: string;
  data?: T;
}

/**
 * 토큰 정보 DTO
 */
export interface TokenDto {
  /**
   * 토큰 타입 (예: Bearer)
   */
  tokenType: string;

  /**
   * 사용자 역할
   */
  role: "MERCHANT" | "ADMIN";

  /**
   * 액세스 토큰
   */
  accessToken: string;

  /**
   * 액세스 토큰 만료 시간
   */
  accessTokenExpiresAt: string;

  /**
   * 리프레시 토큰
   */
  refreshToken: string;

  /**
   * 리프레시 토큰 만료 시간
   */
  refreshTokenExpiresAt: string;

}
