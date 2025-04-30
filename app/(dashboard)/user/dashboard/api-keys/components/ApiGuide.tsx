import React, { useState } from "react";
import { Info, ExternalLink } from "lucide-react";

// 코드 예제를 위한 탭 인터페이스 컴포넌트
const CodeTabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="flex space-x-2 mb-4 border-b overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`px-3 py-1 whitespace-nowrap ${
            activeTab === tab.id
              ? "border-b-2 border-[#0067AC] text-[#0067AC] font-medium"
              : "text-[#5E99D6] hover:text-[#0067AC]"
          }`}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default function ApiGuide() {
  const [authCodeTab, setAuthCodeTab] = useState("javascript");
  const [paymentCodeTab, setPaymentCodeTab] = useState("javascript");
  const [webhookCodeTab, setWebhookCodeTab] = useState("javascript");

  const authCodeTabs = [
    { id: "javascript", label: "JavaScript" },
    { id: "python", label: "Python" },
    { id: "java", label: "Java" },
    { id: "rest", label: "REST (cURL)" },
  ];

  const paymentCodeTabs = [
    { id: "javascript", label: "JavaScript" },
    { id: "python", label: "Python" },
    { id: "java", label: "Java" },
    { id: "rest", label: "REST (cURL)" },
  ];

  const webhookCodeTabs = [
    { id: "javascript", label: "JavaScript (Express)" },
    { id: "python", label: "Python (Flask)" },
    { id: "java", label: "Java (Spring)" },
  ];

  // 인증 코드 예제
  const authCodeExamples = {
    javascript: `// API 키를 사용한 토큰 발급 요청
const axios = require('axios');

const ACCESS_KEY_ID = 'AKIAIOSFODNN7EXAMPLE';
const SECRET_KEY = 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY';

async function getAuthToken() {
  try {
    const response = await axios.post('https://api.payment-system.com/v1/auth/token', {}, {
      headers: {
        'Authorization': \`Basic \${Buffer.from(\`\${ACCESS_KEY_ID}:\${SECRET_KEY}\`).toString('base64')}\`
      }
    });
    
    // 토큰 정보 저장
    const { token, expiresIn } = response.data;
    console.log('인증 토큰 발급 성공:', token);
    console.log('유효 시간:', expiresIn, '초');
    
    return token;
  } catch (error) {
    console.error('인증 토큰 발급 실패:', error.response?.data || error.message);
    throw error;
  }
}

// 사용 예시
getAuthToken()
  .then(token => console.log('발급된 토큰:', token))
  .catch(err => console.error('오류 발생:', err));`,

    python: `# API 키를 사용한 토큰 발급 요청
import requests
import base64

ACCESS_KEY_ID = 'AKIAIOSFODNN7EXAMPLE'
SECRET_KEY = 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY'

def get_auth_token():
    auth_string = f"{ACCESS_KEY_ID}:{SECRET_KEY}"
    auth_header = base64.b64encode(auth_string.encode()).decode()
    
    headers = {
        'Authorization': f'Basic {auth_header}'
    }
    
    try:
        response = requests.post(
            'https://api.payment-system.com/v1/auth/token',
            headers=headers
        )
        response.raise_for_status()
        
        # 토큰 정보 저장
        data = response.json()
        token = data['token']
        expires_in = data['expiresIn']
        
        print(f'인증 토큰 발급 성공: {token}')
        print(f'유효 시간: {expires_in}초')
        
        return token
    except requests.exceptions.RequestException as e:
        print(f'인증 토큰 발급 실패: {e}')
        raise

# 사용 예시
try:
    token = get_auth_token()
    print(f'발급된 토큰: {token}')
except Exception as e:
    print(f'오류 발생: {e}')`,

    java: `// API 키를 사용한 토큰 발급 요청
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Base64;
import org.json.JSONObject;

public class AuthTokenExample {
    private static final String ACCESS_KEY_ID = "AKIAIOSFODNN7EXAMPLE";
    private static final String SECRET_KEY = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY";
    private static final String API_URL = "https://api.payment-system.com/v1/auth/token";

    public static String getAuthToken() throws Exception {
        // 인증 헤더 생성
        String authString = ACCESS_KEY_ID + ":" + SECRET_KEY;
        String encodedAuth = Base64.getEncoder().encodeToString(authString.getBytes());
        
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(API_URL))
                .header("Authorization", "Basic " + encodedAuth)
                .POST(HttpRequest.BodyPublishers.noBody())
                .build();

        HttpResponse<String> response = client.send(request,
                HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() == 200) {
            JSONObject jsonResponse = new JSONObject(response.body());
            String token = jsonResponse.getString("token");
            int expiresIn = jsonResponse.getInt("expiresIn");
            
            System.out.println("인증 토큰 발급 성공: " + token);
            System.out.println("유효 시간: " + expiresIn + "초");
            
            return token;
        } else {
            throw new RuntimeException("인증 토큰 발급 실패: " + response.body());
        }
    }

    public static void main(String[] args) {
        try {
            String token = getAuthToken();
            System.out.println("발급된 토큰: " + token);
        } catch (Exception e) {
            System.err.println("오류 발생: " + e.getMessage());
        }
    }
}`,

    rest: `# API 키를 사용한 토큰 발급 요청 (cURL)
# ACCESS_KEY_ID와 SECRET_KEY를 Base64로 인코딩하여 Basic 인증 헤더 생성

curl -X POST https://api.payment-system.com/v1/auth/token \
  -H "Authorization: Basic $(echo -n 'AKIAIOSFODNN7EXAMPLE:wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY' | base64)"

# 응답 예시
# {
#   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
#   "expiresIn": 3600
# }`,
  };

  // 결제 요청 코드 예제
  const paymentCodeExamples = {
    javascript: `// 발급받은 토큰으로 결제 생성 요청
const axios = require('axios');

async function createPayment(token) {
  try {
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
          'Authorization': \`Bearer \${token}\`
        }
      }
    );
    
    const { paymentId, paymentUrl } = response.data.data;
    console.log('결제 생성 성공:', paymentId);
    console.log('결제 페이지 URL:', paymentUrl);
    
    // 결제 페이지로 리디렉션
    // window.location.href = paymentUrl;
    
    return response.data;
  } catch (error) {
    console.error('결제 생성 실패:', error.response?.data || error.message);
    throw error;
  }
}

// 사용 예시
getAuthToken()
  .then(token => createPayment(token))
  .then(data => console.log('결제 데이터:', data))
  .catch(err => console.error('오류 발생:', err));`,

    python: `# 발급받은 토큰으로 결제 생성 요청
import requests

def create_payment(token):
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {token}'
    }
    
    payload = {
        'amount': 10000,
        'currency': 'KRW',
        'orderId': 'ORDER_12345',
        'customer': {
            'name': '홍길동',
            'email': 'customer@example.com'
        },
        'successUrl': 'https://your-site.com/success',
        'cancelUrl': 'https://your-site.com/cancel'
    }
    
    try:
        response = requests.post(
            'https://api.payment-system.com/v1/payments',
            json=payload,
            headers=headers
        )
        response.raise_for_status()
        
        data = response.json()
        payment_id = data['data']['paymentId']
        payment_url = data['data']['paymentUrl']
        
        print(f'결제 생성 성공: {payment_id}')
        print(f'결제 페이지 URL: {payment_url}')
        
        # 결제 페이지로 리디렉션 (웹 환경인 경우)
        # import webbrowser
        # webbrowser.open(payment_url)
        
        return data
    except requests.exceptions.RequestException as e:
        print(f'결제 생성 실패: {e}')
        raise

# 사용 예시
try:
    token = get_auth_token()
    payment_data = create_payment(token)
    print(f'결제 데이터: {payment_data}')
except Exception as e:
    print(f'오류 발생: {e}')`,

    java: `// 발급받은 토큰으로 결제 생성 요청
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import org.json.JSONObject;

public class PaymentExample {
    private static final String API_URL = "https://api.payment-system.com/v1/payments";

    public static JSONObject createPayment(String token) throws Exception {
        JSONObject customer = new JSONObject();
        customer.put("name", "홍길동");
        customer.put("email", "customer@example.com");
        
        JSONObject requestBody = new JSONObject();
        requestBody.put("amount", 10000);
        requestBody.put("currency", "KRW");
        requestBody.put("orderId", "ORDER_12345");
        requestBody.put("customer", customer);
        requestBody.put("successUrl", "https://your-site.com/success");
        requestBody.put("cancelUrl", "https://your-site.com/cancel");
        
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(API_URL))
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + token)
                .POST(HttpRequest.BodyPublishers.ofString(requestBody.toString()))
                .build();

        HttpResponse<String> response = client.send(request,
                HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() == 200) {
            JSONObject jsonResponse = new JSONObject(response.body());
            JSONObject data = jsonResponse.getJSONObject("data");
            String paymentId = data.getString("paymentId");
            String paymentUrl = data.getString("paymentUrl");
            
            System.out.println("결제 생성 성공: " + paymentId);
            System.out.println("결제 페이지 URL: " + paymentUrl);
            
            return jsonResponse;
        } else {
            throw new RuntimeException("결제 생성 실패: " + response.body());
        }
    }

    public static void main(String[] args) {
        try {
            String token = AuthTokenExample.getAuthToken();
            JSONObject paymentData = createPayment(token);
            System.out.println("결제 데이터: " + paymentData.toString(2));
        } catch (Exception e) {
            System.err.println("오류 발생: " + e.getMessage());
        }
    }
}`,

    rest: `# 발급받은 토큰으로 결제 생성 요청 (cURL)
# 먼저 토큰을 발급 받은 후, 해당 토큰으로 결제 요청

# 1. 토큰 발급
TOKEN=$(curl -s -X POST https://api.payment-system.com/v1/auth/token \
  -H "Authorization: Basic $(echo -n 'AKIAIOSFODNN7EXAMPLE:wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY' | base64)" \
  | jq -r '.token')

# 2. 결제 요청
curl -X POST https://api.payment-system.com/v1/payments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
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
#   "success": true,
#   "data": {
#     "paymentId": "PAY_67890",
#     "paymentUrl": "https://payment-gateway.com/pay/67890",
#     "amount": 10000,
#     "createdAt": "2023-07-10T09:30:00Z"
#   }
# }`,
  };

  // 웹훅 처리 코드 예제
  const webhookCodeExamples = {
    javascript: `// Express.js를 사용한 웹훅 처리 예제
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
});`,

    python: `# Flask를 사용한 웹훅 처리 예제
from flask import Flask, request, jsonify
import hmac
import hashlib
import json

app = Flask(__name__)

# 웹훅 시크릿 키 (관리자 설정에서 확인 가능)
WEBHOOK_SECRET = 'your_webhook_secret_key'

# 웹훅 서명 검증 함수
def verify_signature(payload, signature):
    calculated_signature = hmac.new(
        WEBHOOK_SECRET.encode('utf-8'),
        json.dumps(payload).encode('utf-8'),
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(calculated_signature, signature)

# 주문 상태 업데이트 함수 (예시)
def update_order_status(order_id, status):
    print(f"주문 ID: {order_id}의 상태를 '{status}'로 업데이트")
    # 데이터베이스 업데이트 로직

# 웹훅 엔드포인트
@app.route('/webhook', methods=['POST'])
def webhook_handler():
    payload = request.json
    signature = request.headers.get('x-webhook-signature')
    
    # 서명 검증
    if not signature or not verify_signature(payload, signature):
        print('유효하지 않은 웹훅 서명')
        return jsonify(error='Invalid signature'), 401
    
    # 이벤트 타입에 따른 처리
    print(f'웹훅 이벤트 수신: {payload["type"]}')
    
    if payload['type'] == 'payment.created':
        # 결제 생성됨
        print(f'결제 생성: {payload["data"]["paymentId"]}')
    
    elif payload['type'] == 'payment.completed':
        # 결제 완료됨
        print(f'결제 완료: {payload["data"]["paymentId"]}')
        # 주문 상태 업데이트 로직
        update_order_status(payload['data']['orderId'], 'completed')
    
    elif payload['type'] == 'payment.failed':
        # 결제 실패함
        print(f'결제 실패: {payload["data"]["paymentId"]}')
        # 실패 처리 로직
        update_order_status(payload['data']['orderId'], 'failed')
    
    elif payload['type'] == 'payment.refunded':
        # 환불 처리됨
        print(f'결제 환불: {payload["data"]["paymentId"]}')
        # 환불 처리 로직
        update_order_status(payload['data']['orderId'], 'refunded')
    
    # 웹훅 수신 확인
    return 'OK', 200

if __name__ == '__main__':
    app.run(port=3000, debug=True)`,

    java: `// Spring Boot를 사용한 웹훅 처리 예제
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.Map;

@SpringBootApplication
public class WebhookHandlerApplication {
    public static void main(String[] args) {
        SpringApplication.run(WebhookHandlerApplication.class, args);
    }
}

@RestController
class WebhookController {
    // 웹훅 시크릿 키 (관리자 설정에서 확인 가능)
    private static final String WEBHOOK_SECRET = "your_webhook_secret_key";
    
    @PostMapping("/webhook")
    public ResponseEntity<String> handleWebhook(
            @RequestBody Map<String, Object> payload,
            @RequestHeader(value = "x-webhook-signature", required = false) String signature) {
        
        // 서명 검증
        if (signature == null || !verifySignature(payload, signature)) {
            System.err.println("유효하지 않은 웹훅 서명");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid signature");
        }
        
        // 이벤트 타입에 따른 처리
        String eventType = (String) payload.get("type");
        Map<String, Object> data = (Map<String, Object>) payload.get("data");
        String paymentId = (String) data.get("paymentId");
        String orderId = (String) data.get("orderId");
        
        System.out.println("웹훅 이벤트 수신: " + eventType);
        
        switch (eventType) {
            case "payment.created":
                // 결제 생성됨
                System.out.println("결제 생성: " + paymentId);
                break;
                
            case "payment.completed":
                // 결제 완료됨
                System.out.println("결제 완료: " + paymentId);
                // 주문 상태 업데이트 로직
                updateOrderStatus(orderId, "completed");
                break;
                
            case "payment.failed":
                // 결제 실패함
                System.out.println("결제 실패: " + paymentId);
                // 실패 처리 로직
                updateOrderStatus(orderId, "failed");
                break;
                
            case "payment.refunded":
                // 환불 처리됨
                System.out.println("결제 환불: " + paymentId);
                // 환불 처리 로직
                updateOrderStatus(orderId, "refunded");
                break;
        }
        
        // 웹훅 수신 확인
        return ResponseEntity.ok("OK");
    }
    
    // 웹훅 서명 검증 함수
    private boolean verifySignature(Map<String, Object> payload, String signature) {
        try {
            Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(WEBHOOK_SECRET.getBytes(), "HmacSHA256");
            sha256_HMAC.init(secretKey);
            
            // JSON 문자열로 변환 (실제 구현 시 JSON 라이브러리 사용 권장)
            String payloadString = payload.toString();
            
            byte[] hash = sha256_HMAC.doFinal(payloadString.getBytes());
            StringBuilder calculatedSignature = new StringBuilder();
            for (byte b : hash) {
                calculatedSignature.append(String.format("%02x", b));
            }
            
            return calculatedSignature.toString().equals(signature);
        } catch (Exception e) {
            System.err.println("서명 검증 중 오류 발생: " + e.getMessage());
            return false;
        }
    }
    
    // 주문 상태 업데이트 함수 (예시)
    private void updateOrderStatus(String orderId, String status) {
        System.out.println("주문 ID: " + orderId + "의 상태를 '" + status + "'로 업데이트");
        // 데이터베이스 업데이트 로직
    }
}`,
  };

  return (
    <div className="rounded-lg border border-[#CDE5FF] bg-white p-6 space-y-8">
      <h2 className="text-xl font-medium">API 키 사용 가이드</h2>

      {/* 1. 인증 토큰 발급 */}
      <section className="space-y-4">
        <h3 className="text-lg font-medium flex items-center">
          <span className="bg-[#0067AC] text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">
            1
          </span>
          인증 토큰 발급
        </h3>
        <div className="bg-[#F6FBFF] rounded-md p-4">
          <p className="mb-2">
            API를 사용하기 위해서는 먼저 Access Key ID와 Secret Key로 인증
            토큰을 발급받아야 합니다. 발급받은 토큰은 일정 시간(기본 1시간) 동안
            유효하며, 만료되면 새로운 토큰을 발급받아야 합니다.
          </p>

          <div className="bg-[#eaf5ff] rounded-md p-4 my-3">
            <h4 className="font-medium mb-2">요청 정보</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>
                <strong>엔드포인트:</strong>{" "}
                <code>POST https://api.payment-system.com/v1/auth/token</code>
              </li>
              <li>
                <strong>인증 방식:</strong> Basic 인증 (Access Key ID와 Secret
                Key 조합)
              </li>
              <li>
                <strong>응답:</strong> 토큰 및 만료 시간 정보
              </li>
            </ul>
          </div>

          <CodeTabs
            tabs={authCodeTabs}
            activeTab={authCodeTab}
            setActiveTab={setAuthCodeTab}
          />

          <pre className="bg-[#eaf5ff] rounded-md p-3 overflow-x-auto">
            <code>{authCodeExamples[authCodeTab]}</code>
          </pre>

          <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mt-4 text-sm">
            <p className="font-medium text-amber-800">응답 예시:</p>
            <pre className="bg-amber-100/50 rounded p-2 mt-1 overflow-x-auto">
              <code>{`{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600
}`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* 2. 결제 요청 생성 */}
      <section className="space-y-4">
        <h3 className="text-lg font-medium flex items-center">
          <span className="bg-[#0067AC] text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">
            2
          </span>
          결제 요청 생성
        </h3>
        <div className="bg-[#F6FBFF] rounded-md p-4">
          <p className="mb-2">
            발급받은 인증 토큰으로 결제를 요청합니다. 응답으로 받은 결제 URL로
            고객을 리디렉션하면 결제 프로세스가 시작됩니다.
          </p>

          <div className="bg-[#eaf5ff] rounded-md p-4 my-3">
            <h4 className="font-medium mb-2">요청 정보</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>
                <strong>엔드포인트:</strong>{" "}
                <code>POST https://api.payment-system.com/v1/payments</code>
              </li>
              <li>
                <strong>인증 방식:</strong> Bearer 토큰 인증
              </li>
              <li>
                <strong>요청 형식:</strong> JSON
              </li>
              <li>
                <strong>필수 필드:</strong> amount, currency, orderId,
                successUrl, cancelUrl
              </li>
            </ul>
          </div>

          <CodeTabs
            tabs={paymentCodeTabs}
            activeTab={paymentCodeTab}
            setActiveTab={setPaymentCodeTab}
          />

          <pre className="bg-[#eaf5ff] rounded-md p-3 overflow-x-auto">
            <code>{paymentCodeExamples[paymentCodeTab]}</code>
          </pre>

          <div className="bg-green-50 border border-green-200 rounded-md p-3 mt-4 text-sm">
            <p className="font-medium text-green-800">응답 예시:</p>
            <pre className="bg-green-100/50 rounded p-2 mt-1 overflow-x-auto">
              <code>{`{
  "success": true,
  "data": {
    "paymentId": "PAY_67890",
    "paymentUrl": "https://payment-gateway.com/pay/67890",
    "amount": 10000,
    "currency": "KRW",
    "orderId": "ORDER_12345",
    "status": "pending",
    "createdAt": "2023-07-10T09:30:00Z"
  }
}`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* 3. 웹훅 처리 */}
      <section className="space-y-4">
        <h3 className="text-lg font-medium flex items-center">
          <span className="bg-[#0067AC] text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">
            3
          </span>
          웹훅 처리
        </h3>
        <div className="bg-[#F6FBFF] rounded-md p-4">
          <p className="mb-2">
            결제 상태가 변경될 때마다 설정된 웹훅 URL로 이벤트 알림이
            전송됩니다. 이를 통해 결제 완료, 실패, 환불 등의 이벤트를 실시간으로
            처리할 수 있습니다.
          </p>

          <div className="bg-[#eaf5ff] rounded-md p-4 my-3">
            <h4 className="font-medium mb-2">웹훅 이벤트 종류</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>
                <strong>payment.created</strong> - 결제 요청이 생성됨
              </li>
              <li>
                <strong>payment.completed</strong> - 결제가 성공적으로 완료됨
              </li>
              <li>
                <strong>payment.failed</strong> - 결제 진행 중 오류 발생
              </li>
              <li>
                <strong>payment.cancelled</strong> - 사용자가 결제를 취소함
              </li>
              <li>
                <strong>payment.refunded</strong> - 결제가 환불됨
              </li>
            </ul>
          </div>

          <CodeTabs
            tabs={webhookCodeTabs}
            activeTab={webhookCodeTab}
            setActiveTab={setWebhookCodeTab}
          />

          <pre className="bg-[#eaf5ff] rounded-md p-3 overflow-x-auto">
            <code>{webhookCodeExamples[webhookCodeTab]}</code>
          </pre>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mt-4 text-sm">
            <p className="font-medium text-blue-800">웹훅 요청 예시:</p>
            <pre className="bg-blue-100/50 rounded p-2 mt-1 overflow-x-auto">
              <code>{`{
  "type": "payment.completed",
  "id": "evt_12345",
  "createdAt": "2023-07-10T09:35:00Z",
  "data": {
    "paymentId": "PAY_67890",
    "orderId": "ORDER_12345",
    "amount": 10000,
    "currency": "KRW",
    "status": "completed",
    "paidAt": "2023-07-10T09:34:55Z"
  }
}`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* 4. 보안 권장사항 */}
      <section className="space-y-4">
        <h3 className="text-lg font-medium flex items-center">
          <span className="bg-[#0067AC] text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">
            4
          </span>
          보안 권장사항
        </h3>
        <div className="bg-[#F6FBFF] rounded-md p-4">
          <ul className="list-disc list-inside space-y-2">
            <li>
              Secret Key는 서버 측에서만 사용하고, 클라이언트에 노출하지 마세요.
            </li>
            <li>
              인증 토큰은 서버 메모리에 안전하게 보관하고 필요할 때만
              사용하세요.
            </li>
            <li>
              웹훅 요청의 서명을 항상 검증하여 요청의 유효성을 확인하세요.
            </li>
            <li>HTTPS를 통해서만 API를 호출하세요.</li>
            <li>정기적으로 API 키를 교체하여 보안을 강화하세요.</li>
          </ul>
        </div>
      </section>

      <div className="flex justify-center mt-6">
        <a
          href="#"
          className="inline-flex items-center gap-2 text-[#0067AC] hover:underline"
          target="_blank"
        >
          <ExternalLink className="h-4 w-4" />
          전체 API 문서 보기
        </a>
      </div>
    </div>
  );
}
