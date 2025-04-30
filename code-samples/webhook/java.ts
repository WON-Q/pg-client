export const javaWebhookSample = `// Spring Boot를 사용한 웹훅 처리 예제
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
}`;
