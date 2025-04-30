export const javascriptWebhookSample = `// Express.js를 사용한 웹훅 처리 예제
const express = require('express');
const crypto = require('crypto');
const app = express();

// JSON 요청 파싱 미들웨어
app.use(express.json());

// 웹훅 시크릿 키 (관리자 설정에서 확인 가능)
const WEBHOOK_SECRET = 'your_webhook_secret_key';

// 웹훅 서명 검증 함수
function verifySignature(payload, signature) {
  const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
  const calculatedSignature = hmac.update(JSON.stringify(payload)).digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(calculatedSignature, 'hex'),
    Buffer.from(signature, 'hex')
  );
}

// 웹훅 엔드포인트
app.post('/webhook', (req, res) => {
  const payload = req.body;
  const signature = req.headers['x-webhook-signature'];
  
  // 서명 검증
  if (!signature || !verifySignature(payload, signature)) {
    console.error('유효하지 않은 웹훅 서명');
    return res.status(401).send('Invalid signature');
  }
  
  // 이벤트 타입에 따른 처리
  console.log('웹훅 이벤트 수신:', payload.type);
  
  switch (payload.type) {
    case 'payment.created':
      // 결제 생성됨
      console.log('결제 생성:', payload.data.paymentId);
      break;
      
    case 'payment.completed':
      // 결제 완료됨
      console.log('결제 완료:', payload.data.paymentId);
      // 주문 상태 업데이트 로직
      updateOrderStatus(payload.data.orderId, 'completed');
      break;
      
    case 'payment.failed':
      // 결제 실패함
      console.log('결제 실패:', payload.data.paymentId);
      // 실패 처리 로직
      updateOrderStatus(payload.data.orderId, 'failed');
      break;
      
    case 'payment.refunded':
      // 환불 처리됨
      console.log('결제 환불:', payload.data.paymentId);
      // 환불 처리 로직
      updateOrderStatus(payload.data.orderId, 'refunded');
      break;
  }
  
  // 웹훅 수신 확인
  res.status(200).send('OK');
});

// 주문 상태 업데이트 함수 (예시)
function updateOrderStatus(orderId, status) {
  console.log(\`주문 ID: \${orderId}의 상태를 '\${status}'로 업데이트\`);
  // 데이터베이스 업데이트 로직
}

// 서버 시작
app.listen(3000, () => {
  console.log('웹훅 서버가 포트 3000에서 실행 중입니다');
});`;
