/**
 * ApiKey 목록 조회 API의 개별 ApiKey DTO
 */
interface ApiKeyResponseDto {
  /**
   * API 키 ID
   */
  id: number;

  /**
   * 가맹점 ID
   */
  merchantId: number;

  /**
   * 가맹점 이름
   */
  merchantName: string;

  /**
   * API 키 이름
   */
  name: string;

  /**
   * 액세스 키
   */
  accessKey: string;

  /**
   * 액세스 키 활성화 여부
   */
  isActive: boolean;

  /**
   * 발급 시각
   */
  issuedAt: string;

  /**
   * 만료 시각
   */
  expiresAt: string | null;

  /**
   * 마지막 사용 시각
   */
  lastUsed: string | null;

}