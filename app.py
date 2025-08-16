# Flask 프레임워크에서 필요한 모듈들을 임포트합니다.
from flask import Flask, render_template, url_for

# Flask 애플리케이션 인스턴스를 생성합니다.
# __name__은 현재 모듈의 이름을 나타내며, Flask가 정적 파일과 템플릿 파일을 찾을 때 사용됩니다.
app = Flask(__name__)

# 루트 URL('/')에 대한 라우트를 정의합니다.
# 사용자가 웹사이트의 메인 페이지에 접속할 때 이 함수가 실행됩니다.
@app.route('/')
def index():
    # 'templates' 폴더 안에 있는 'index.html' 파일을 렌더링하여 반환합니다.
    # render_template 함수는 Jinja2 템플릿 엔진을 사용하여 HTML 파일을 처리합니다.
    return render_template('index.html')

# '/game' URL에 대한 라우트를 정의합니다.
# index.html 안의 iframe에서 game.html을 직접 호출할 수도 있지만,
# 만약 게임 페이지 자체에 직접 접속해야 할 경우를 대비해 라우트를 만듭니다.
@app.route('/game')
def game():
    # 'templates' 폴더 안에 있는 'game.html' 파일을 렌더링하여 반환합니다.
    return render_template('game_title.html')

# 이 부분이 앱을 실행하는 코드입니다.
# 파이썬 스크립트가 직접 실행될 때만 아래 코드가 실행되도록 합니다.
if __name__ == '__main__':
    # Flask 앱을 실행합니다.
    # debug=True는 개발 모드를 활성화하여 코드 변경 시 자동으로 서버를 재시작하고
    # 자세한 오류 메시지를 브라우저에 표시해줍니다.
    # 프로덕션 환경에서는 debug=False로 설정해야 합니다.
    app.run(debug=True)
