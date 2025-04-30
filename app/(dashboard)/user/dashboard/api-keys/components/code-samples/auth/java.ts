export const javaAuthSample = `// Access Key ID와 Secret Key를 사용한 액세스 토큰 발급 요청
import java.io.IOException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import okhttp3.*;

public class TokenManager {
    private static final String ACCESS_KEY_ID = "your_access_key_id";
    private static final String SECRET_KEY = "your_secret_key";
    private static final String TOKEN_URL = "https://api.payment-system.com/v1/auth/token";
    
    private static String accessToken;
    private static long expiredAt;
    private static final OkHttpClient client = new OkHttpClient();
    private static final ObjectMapper mapper = new ObjectMapper();
    
    /**
     * Access Key ID와 Secret Key를 사용하여 액세스 토큰을 발급받는 함수
     */
    public static String getAccessToken() throws IOException {
        FormBody formBody = new FormBody.Builder()
                .add("access_key_id", ACCESS_KEY_ID)
                .add("secret_key", SECRET_KEY)
                .build();
                
        Request request = new Request.Builder()
                .url(TOKEN_URL)
                .post(formBody)
                .build();
        
        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("API 호출 실패: " + response.code());
            }
            
            JsonNode result = mapper.readTree(response.body().string());
            
            if (result.get("code").asInt() == 0) {
                JsonNode tokenData = result.get("response");
                accessToken = tokenData.get("access_token").asText();
                expiredAt = tokenData.get("expired_at").asLong();
                
                LocalDateTime expireTime = LocalDateTime.ofInstant(
                        Instant.ofEpochSecond(expiredAt), ZoneId.systemDefault());
                
                System.out.println("액세스 토큰 발급 성공: " + accessToken);
                System.out.println("만료시간: " + expireTime);
                
                return accessToken;
            } else {
                String message = result.get("message").asText();
                throw new IOException("토큰 발급 실패: " + message);
            }
        }
    }
    
    /**
     * 토큰이 만료되었는지 확인하는 함수 (만료 1분 전부터 만료된 것으로 간주)
     */
    public static boolean isTokenExpired() {
        if (accessToken == null) {
            return true;
        }
        
        // 만료 1분 전부터 갱신
        long currentTime = Instant.now().getEpochSecond();
        return currentTime >= (expiredAt - 60);
    }
    
    /**
     * 유효한 액세스 토큰을 반환하는 함수
     */
    public static String getValidAccessToken() throws IOException {
        if (isTokenExpired()) {
            return getAccessToken();
        }
        return accessToken;
    }
    
    public static void main(String[] args) {
        try {
            String token = getValidAccessToken();
            System.out.println("발급된 토큰: " + token);
        } catch (IOException e) {
            System.err.println("에러 발생: " + e.getMessage());
        }
    }
}`;
