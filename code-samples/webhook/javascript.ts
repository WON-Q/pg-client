export const javascriptWebhookSample = `const express = require('express');
const crypto = require('crypto');
const app = express();

// JSON 본문 파싱
app.use(express.json());

// 웹훅 핸들러
app.post('/webhooks', (req, res) => {
  const payload = req.body;
  const signature = req.headers['x-signature'];
  const webhookSecret = 'YOUR_WEBHOOK_SECRET'; // 대시보드에서 생성된 웹훅 시크릿
  
  // 서명 검증
  const computedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(JSON.stringify(payload))
    .digest('hex');
  
  if (signature !== \`sha256=\${computedSignature}\`) {
    console.error('잘못된 서명');
    return res.status(401).send('잘못된 서명');
  }
  
  // 이벤트 타입에 따른 처리
  const eventType = payload.type;
  
  switch(eventType) {
    case 'payment.completed':
      // 결제 완료 처리
      const paymentId = payload.data.paymentId;
      const amount = payload.data.amount;
      console.log(\`결제 완료: \${paymentId}, \${amount}원\`);
      break;
    
    case 'payment.failed':
      // 결제 실패 처리
      console.log(\`결제 실패: \${payload.data.paymentId}\`);
      console.log(\`사유: \${payload.data.error?.message}\`);
      break;
    
    // 기타 이벤트 처리
    default:
      console.log(\`이벤트 수신: \${eventType}\`);
  }
  
  // 빠르게 200 응답 (성공 확인)
  res.status(200).send('ok');
  
  // 필요한 경우 비동기로 추가 작업 처리
  processWebhookAsync(payload).catch(console.error);
});

// 비동기로 오래 걸리는 작업 처리
async function processWebhookAsync(payload) {
  // DB 업데이트, 이메일 발송 등 시간이 걸리는 작업
}

app.listen(3000, () => {
  console.log('웹훅 서버가 포트 3000에서 실행 중입니다.');
});`;
