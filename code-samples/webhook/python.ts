export const pythonWebhookSample = `# Flask를 사용한 웹훅 처리 예제
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
    app.run(port=3000, debug=True)`;
