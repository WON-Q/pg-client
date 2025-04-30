export const restAuthSample = `# API 키를 사용한 액세스 토큰 발급 요청 (cURL)

curl -X POST https://api.payment-system.com/v1/auth/token \\
  -d "api_key=your_api_key" \\
  -d "api_secret=your_api_secret"

# 응답 예시
# {
#   "code": 0,
#   "message": "success",
#   "response": {
#     "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
#     "expired_at": 1679533500,  // 유닉스 타임스탬프(초 단위)
#     "now": 1679531700          // 현재 시간(초 단위)
#   }
# }`;
