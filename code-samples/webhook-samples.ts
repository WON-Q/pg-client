export const nodeJsWebhookSample = `const express = require('express');
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

export const pythonWebhookSample = `from flask import Flask, request, jsonify
import hmac
import hashlib
import json

app = Flask(__name__)

@app.route('/webhooks', methods=['POST'])
def handle_webhook():
    payload = request.json
    signature = request.headers.get('X-Signature')
    webhook_secret = 'YOUR_WEBHOOK_SECRET'  # 대시보드에서 생성된 웹훅 시크릿
    
    # 서명 검증
    computed_signature = hmac.new(
        webhook_secret.encode('utf-8'),
        json.dumps(payload).encode('utf-8'),
        hashlib.sha256
    ).hexdigest()
    
    if signature != f'sha256={computed_signature}':
        print('잘못된 서명')
        return jsonify(error='Invalid signature'), 401
    
    # 이벤트 타입에 따른 처리
    event_type = payload.get('type')
    
    if event_type == 'payment.completed':
        # 결제 완료 처리
        payment_id = payload['data']['paymentId']
        amount = payload['data']['amount']
        print(f'결제 완료: {payment_id}, {amount}원')
    
    elif event_type == 'payment.failed':
        # 결제 실패 처리
        payment_id = payload['data']['paymentId']
        error_message = payload['data'].get('error', {}).get('message', '알 수 없는 오류')
        print(f'결제 실패: {payment_id}')
        print(f'사유: {error_message}')
    
    else:
        # 기타 이벤트 처리
        print(f'이벤트 수신: {event_type}')
    
    # 빠르게 200 응답 (성공 확인)
    return jsonify(success=True), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)`;

export const phpWebhookSample = `<?php
// 웹훅 요청 처리
$payload = file_get_contents('php://input');
$signature = $_SERVER['HTTP_X_SIGNATURE'] ?? '';
$webhook_secret = 'YOUR_WEBHOOK_SECRET'; // 대시보드에서 생성된 웹훅 시크릿

// 서명 검증
$computed_signature = hash_hmac('sha256', $payload, $webhook_secret);
if ($signature !== "sha256={$computed_signature}") {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid signature']);
    exit;
}

// 페이로드 파싱
$data = json_decode($payload, true);
$event_type = $data['type'] ?? '';

// 이벤트 타입에 따른 처리
switch ($event_type) {
    case 'payment.completed':
        // 결제 완료 처리
        $payment_id = $data['data']['paymentId'];
        $amount = $data['data']['amount'];
        error_log("결제 완료: {$payment_id}, {$amount}원");
        break;
        
    case 'payment.failed':
        // 결제 실패 처리
        $payment_id = $data['data']['paymentId'];
        $error_message = $data['data']['error']['message'] ?? '알 수 없는 오류';
        error_log("결제 실패: {$payment_id}");
        error_log("사유: {$error_message}");
        break;
        
    default:
        // 기타 이벤트 처리
        error_log("이벤트 수신: {$event_type}");
}

// 빠르게 200 응답 (성공 확인)
http_response_code(200);
echo json_encode(['success' => true]);

// 작업 로그를 별도 파일에 기록
error_log(date('Y-m-d H:i:s') . " - Webhook received: {$event_type} - " . json_encode($data['data']), 3, 'webhooks.log');`;

export const javaWebhookSample = `import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/webhooks")
public class WebhookController {

    private static final String WEBHOOK_SECRET = "YOUR_WEBHOOK_SECRET"; // 대시보드에서 생성된 웹훅 시크릿
    private static final ObjectMapper objectMapper = new ObjectMapper();
    
    @PostMapping
    public ResponseEntity<Map<String, Boolean>> handleWebhook(
            @RequestBody JsonNode payload,
            @RequestHeader(value = "X-Signature", required = false) String signature) {
        
        // 서명 검증
        try {
            if (!isValidSignature(payload, signature)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", false));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", false));
        }
        
        // 이벤트 타입 추출
        String eventType = payload.path("type").asText();
        
        // 비동기로 이벤트 처리
        CompletableFuture.runAsync(() -> processEvent(eventType, payload));
        
        // 즉시 200 응답
        return ResponseEntity.ok(Map.of("success", true));
    }
    
    private boolean isValidSignature(JsonNode payload, String signature) throws Exception {
        if (signature == null) {
            return false;
        }
        
        Mac sha256Hmac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKey = new SecretKeySpec(WEBHOOK_SECRET.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        sha256Hmac.init(secretKey);
        
        String payloadString = objectMapper.writeValueAsString(payload);
        byte[] computedSignatureBytes = sha256Hmac.doFinal(payloadString.getBytes(StandardCharsets.UTF_8));
        
        StringBuilder sb = new StringBuilder();
        for (byte b : computedSignatureBytes) {
            sb.append(String.format("%02x", b));
        }
        String computedSignature = "sha256=" + sb.toString();
        
        return computedSignature.equals(signature);
    }
    
    private void processEvent(String eventType, JsonNode payload) {
        try {
            switch (eventType) {
                case "payment.completed":
                    JsonNode data = payload.path("data");
                    String paymentId = data.path("paymentId").asText();
                    int amount = data.path("amount").asInt();
                    System.out.println("결제 완료: " + paymentId + ", " + amount + "원");
                    break;
                    
                case "payment.failed":
                    data = payload.path("data");
                    paymentId = data.path("paymentId").asText();
                    String errorMessage = data.path("error").path("message").asText("알 수 없는 오류");
                    System.out.println("결제 실패: " + paymentId);
                    System.out.println("사유: " + errorMessage);
                    break;
                    
                default:
                    System.out.println("이벤트 수신: " + eventType);
                    break;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}`;
