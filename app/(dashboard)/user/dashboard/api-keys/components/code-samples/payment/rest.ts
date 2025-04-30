export const restPaymentSample = `# 발급받은 액세스 토큰으로 결제 생성 요청 (cURL)

# 1. 먼저 액세스 토큰을 발급받습니다
TOKEN_RESPONSE=$(curl -s -X POST https://api.payment-system.com/v1/auth/token \\
  -d "access_key_id=your_access_key_id" \\
  -d "secret_key=your_secret_key")

# 2. 액세스 토큰 추출
ACCESS_TOKEN=$(echo $TOKEN_RESPONSE | jq -r '.response.access_token')

# 3. 액세스 토큰을 사용하여 결제 요청
curl -X POST https://api.payment-system.com/v1/payments \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $ACCESS_TOKEN" \\
  -d '{
    "amount": 10000,
    "currency": "KRW",
    "orderId": "ORDER_12345",
    "customer": {
      "name": "홍길동",
      "email": "customer@example.com"
    },
    "successUrl": "https://your-site.com/success",
    "cancelUrl": "https://your-site.com/cancel"
  }'

# 응답 예시
# {
#   "code": 0,
#   "message": "success",
#   "response": {
#     "paymentId": "PAY_67890",
#     "paymentUrl": "https://payment-gateway.com/pay/67890",
#     "amount": 10000,
#     "orderId": "ORDER_12345",
#     "status": "ready",
#     "createdAt": "2023-07-10T09:30:00Z"
#   }
# }`;
