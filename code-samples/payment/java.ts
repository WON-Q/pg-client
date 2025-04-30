export const javaPaymentSample = `// 발급받은 액세스 토큰으로 결제 생성 요청
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import okhttp3.*;

public class PaymentService {
    private static final String PAYMENT_URL = "https://api.payment-system.com/v1/payments";
    private static final OkHttpClient client = new OkHttpClient();
    private static final ObjectMapper mapper = new ObjectMapper();
    
    /**
     * 액세스 토큰을 사용하여 결제를 생성하는 함수
     */
    public static JsonNode createPayment() throws IOException {
        // 유효한 액세스 토큰 가져오기
        String accessToken = TokenManager.getValidAccessToken();
        
        // JSON 요청 본문 생성
        ObjectNode customerNode = mapper.createObjectNode()
                .put("name", "홍길동")
                .put("email", "customer@example.com");
        
        ObjectNode requestBody = mapper.createObjectNode()
                .put("amount", 10000)
                .put("currency", "KRW")
                .put("orderId", "ORDER_12345")
                .put("successUrl", "https://your-site.com/success")
                .put("cancelUrl", "https://your-site.com/cancel")
                .set("customer", customerNode);
        
        RequestBody body = RequestBody.create(
                requestBody.toString(),
                MediaType.parse("application/json")
        );
        
        Request request = new Request.Builder()
                .url(PAYMENT_URL)
                .addHeader("Content-Type", "application/json")
                .addHeader("Authorization", "Bearer " + accessToken)
                .post(body)
                .build();
        
        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("API 호출 실패: " + response.code());
            }
            
            JsonNode result = mapper.readTree(response.body().string());
            
            if (result.get("code").asInt() == 0) {
                JsonNode paymentData = result.get("response");
                String paymentId = paymentData.get("paymentId").asText();
                String paymentUrl = paymentData.get("paymentUrl").asText();
                
                System.out.println("결제 요청 성공: " + paymentId);
                System.out.println("결제 페이지 URL: " + paymentUrl);
                
                return paymentData;
            } else {
                String message = result.get("message").asText();
                throw new IOException("결제 요청 실패: " + message);
            }
        }
    }
    
    public static void main(String[] args) {
        try {
            JsonNode paymentData = createPayment();
            System.out.println("결제 데이터: " + paymentData.toString());
        } catch (IOException e) {
            System.err.println("에러 발생: " + e.getMessage());
        }
    }
}`;
