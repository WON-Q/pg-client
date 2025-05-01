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
