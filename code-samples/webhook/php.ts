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
