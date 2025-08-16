from flask import Flask, render_template, jsonify, url_for
from pymongo import MongoClient
app = Flask(__name__)

uri = "mongodb+srv://1s00b1n526:urzcH2690ovTy7xS@cluster0.lows1qr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&tlsAllowInvalidCertificates=true"
client = MongoClient(uri)
db = client.junglejungle

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

    # '/game/ending' URL에 대한 라우트를 정의합니다.
@app.route('/game/ending')
def game_ending():
    return render_template('game_ending.html')

@app.route('/game/ending', methods=['POST'])
def post_comment():
    if request.method == 'POST':
        comment_receive = request.form.get('comment_give')
        add_comment = {'comment': comment_receive}  # +유저 정보 추가
        db.comment.insert_one(add_comment)
        return jsonify({'result': 'success'})

    else:  # GET
        result = list(db.comment.find({}, {'_id': 0}))
        return jsonify({'result': 'success', 'add_comment': result})

if __name__ == '__main__':

    app.run(debug=True)
