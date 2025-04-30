export const pythonAuthSample = `# API 키를 사용한 액세스 토큰 발급 요청
import time
import requests
from datetime import datetime

API_KEY = 'your_api_key'
API_SECRET = 'your_api_secret'

# 토큰 정보를 저장할 변수
token_info = {
    'access_token': None,
    'expired_at': 0,
}

def get_access_token():
    """API 키와 시크릿을 사용하여 액세스 토큰을 발급받는 함수"""
    try:
        response = requests.post(
            'https://api.payment-system.com/v1/auth/token',
            data={
                'api_key': API_KEY,
                'api_secret': API_SECRET
            }
        )
        response.raise_for_status()
        
        result = response.json()
        
        if result['code'] == 0:
            token_data = result['response']
            token_info['access_token'] = token_data['access_token']
            token_info['expired_at'] = token_data['expired_at']
            
            print(f'액세스 토큰 발급 성공: {token_data["access_token"]}')
            print(f'만료시간: {datetime.fromtimestamp(token_data["expired_at"])}')
            
            return token_data['access_token']
        else:
            print(f'토큰 발급 실패: {result["message"]}')
            return None
            
    except requests.exceptions.RequestException as e:
        print(f'액세스 토큰 발급 에러: {e}')
        return None

def is_token_expired():
    """토큰이 만료되었는지 확인하는 함수 (만료 1분 전부터 만료된 것으로 간주)"""
    if not token_info['access_token']:
        return True
    
    # 만료 1분 전부터 갱신
    return time.time() >= (token_info['expired_at'] - 60)

def get_valid_access_token():
    """유효한 액세스 토큰을 반환하는 함수"""
    if is_token_expired():
        return get_access_token()
    return token_info['access_token']`;
