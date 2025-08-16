from flask import Flask, render_template, url_for

app = Flask(__name__)

# 루트 URL('/')에 대한 라우트를 정의합니다.
# 사용자가 웹사이트의 메인 페이지에 접속할 때 이 함수가 실행됩니다.
@app.route('/')
def index():
    return render_template('index.html')

# '/game/title' URL에 대한 라우트를 정의합니다.
@app.route('/game/title')
def game_title():

    return render_template('game_title.html')

# '/game/컷번호' URL에 대한 라우트를 정의합니다. cut_id : 0~
@app.route('/game/<int:cut_id>')
def game_cut(cut_id):
    return render_template(f'cut{cut_id}.html')







if __name__ == '__main__':

    app.run(debug=True)
