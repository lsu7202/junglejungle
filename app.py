from flask import Flask, render_template, jsonify, request, url_for
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

# playername 받아서 저장
@app.route('/game', methods=['POST'])
def post_playerName():
    receive_playerName = request.form.get('playerName')
    playerName = {'playerName': receive_playerName} 
    db.playerName.insert_one(playerName)
    return jsonify({'result': 'success'})

# playername 불러오기
@app.route('/game', methods=['GET'])
def load_playerName():
    result = list(db.playerName.find({}, {'_id': 0}))
    return jsonify({'result': 'success', 'playerName': result})

# commnet 저장
@app.route('/game/ending/comment', methods=['POST'])
def post_comment():
    if request.method == 'POST':
        receive_comment = request.form.get('playerComment')
        add_comment = {'playerComment': receive_comment}  # +유저 정보 추가
        db.playerComment.insert_one(add_comment)
        return jsonify({'result': 'success'})

# comment 불러오기
@app.route('/game/ending/comment', methods=['GET'])
def load_comment():
    result = list(db.playerComment.find({}, {'_id': 0}))
    return jsonify({'result': 'success', 'playerComment': result})

if __name__ == '__main__':

    app.run(debug=True)
