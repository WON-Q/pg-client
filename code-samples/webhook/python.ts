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
