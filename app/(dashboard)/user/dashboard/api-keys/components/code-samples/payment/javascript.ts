export const javascriptPaymentSample = `// 발급받은 액세스 토큰으로 결제 생성 요청
const axios = require('axios');

async function createPayment() {
  try {
    // 유효한 액세스 토큰 가져오기
    const accessToken = await getValidAccessToken();
    
    const response = await axios.post(
      'https://api.payment-system.com/v1/payments', 
      {
        amount: 10000,
        currency: 'KRW',
        orderId: 'ORDER_12345',
        customer: {
          name: '홍길동',
          email: 'customer@example.com'
        },
        successUrl: 'https://your-site.com/success',
        cancelUrl: 'https://your-site.com/cancel'
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': \`Bearer \${accessToken}\`
        }
      }
    );
    
    const { code, message, response: paymentData } = response.data;
    
    if (code === 0) {
      console.log('결제 요청 성공:', paymentData.paymentId);
      console.log('결제 페이지 URL:', paymentData.paymentUrl);
      
      // 결제 페이지로 리디렉션
      // window.location.href = paymentData.paymentUrl;
      
      return paymentData;
    } else {
      throw new Error(\`결제 요청 실패: \${message}\`);
    }
  } catch (error) {
    console.error('결제 요청 에러:', error.response?.data || error.message);
    throw error;
  }
}`;
