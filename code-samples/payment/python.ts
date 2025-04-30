export const pythonPaymentSample = `# 발급받은 액세스 토큰으로 결제 생성 요청
import requests
import json

def create_payment():
    """액세스 토큰을 사용하여 결제를 생성하는 함수"""
    try:
        # 유효한 액세스 토큰 가져오기
        access_token = get_valid_access_token()
        
        if not access_token:
            print("유효한 액세스 토큰이 없습니다.")
            return None
            
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {access_token}'
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
        
        response = requests.post(
            'https://api.payment-system.com/v1/payments',
            json=payload,
            headers=headers
        )
        response.raise_for_status()
        
        result = response.json()
        
        if result['code'] == 0:
            payment_data = result['response']
            print(f'결제 요청 성공: {payment_data["paymentId"]}')
            print(f'결제 페이지 URL: {payment_data["paymentUrl"]}')
            
            # 결제 페이지로 리디렉션 (웹 환경인 경우)
            # import webbrowser
            # webbrowser.open(payment_data["paymentUrl"])
            
            return payment_data
        else:
            print(f'결제 요청 실패: {result["message"]}')
            return None
            
    except requests.exceptions.RequestException as e:
        print(f'결제 요청 에러: {e}')
        return None`;
