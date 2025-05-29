export interface BaseResponse<T> {
  isSuccess: boolean;
  statusCode: number;
  message: string;
  data?: T;
}

/**
 * 페이지네이션
 */
export interface Page<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

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

/**
 * 트랜잭션 상태
 */
export type TransactionStatus =
  | "PENDING"
  | "CREATED"
  | "APPROVED"
  | "CANCELLED"
  | "FAILED"
  | "AUTH_FAILED"
  | "REFUND_FAILED";

/**
 * 지불 방법
 */
export type PaymentMethod = "APP_CARD" | "WOORI_APP_CARD";
