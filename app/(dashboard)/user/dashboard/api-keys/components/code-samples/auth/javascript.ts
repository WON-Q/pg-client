export const javascriptAuthSample = `// Access Key ID와 Secret Key를 사용한 액세스 토큰 발급 요청
const axios = require('axios');

async function getAccessToken() {
  const ACCESS_KEY_ID = 'your_access_key_id';
  const SECRET_KEY = 'your_secret_key';
  
  try {
    const response = await axios.post(
      'https://api.payment-system.com/v1/auth/token', 
      {
        access_key_id: ACCESS_KEY_ID,
        secret_key: SECRET_KEY
      }
    );
    
    const { code, message, response: tokenData } = response.data;
    
    if (code === 0) {
      console.log('액세스 토큰 발급 성공:', tokenData.access_token);
      console.log('만료시간:', new Date(tokenData.expired_at * 1000).toLocaleString());
      console.log('현재시간:', new Date(tokenData.now * 1000).toLocaleString());
      
      // 토큰 정보 저장 (실제 구현 시 보안 스토리지에 저장해야 함)
      sessionStorage.setItem('access_token', tokenData.access_token);
      sessionStorage.setItem('expired_at', tokenData.expired_at);
      
      return tokenData.access_token;
    } else {
      throw new Error(\`토큰 발급 실패: \${message}\`);
    }
  } catch (error) {
    console.error('액세스 토큰 발급 에러:', error.response?.data || error.message);
    throw error;
  }
}

// 토큰 만료 여부 확인 함수
function isTokenExpired() {
  const expiredAt = sessionStorage.getItem('expired_at');
  if (!expiredAt) return true;
  
  // 토큰 만료 1분 전에 미리 갱신
  const expiryTime = parseInt(expiredAt) * 1000;
  const currentTime = Date.now();
  return currentTime >= (expiryTime - 60000); // 60000ms = 1분
}

// 필요할 때 토큰을 가져오거나 갱신하는 함수
async function getValidAccessToken() {
  // 토큰이 없거나 만료되었으면 새로 발급
  if (isTokenExpired()) {
    return await getAccessToken();
  }
  // 아니면 기존 토큰 반환
  return sessionStorage.getItem('access_token');
}`;
