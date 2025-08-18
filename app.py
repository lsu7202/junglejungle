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

# '/game/login' URL에 대한 라우트를 정의합니다.
@app.route('/login')
def game_login():
    return render_template('login.html')

# '/game/signup' URL에 대한 라우트를 정의합니다.
@app.route('/signup')
def game_signup():
    return render_template('signup.html')

# '/game/컷번호' URL에 대한 라우트를 정의합니다. cut_id : 0~
@app.route('/game/<int:cut_id>')
def game_cut(cut_id):
    return render_template(f'cut{cut_id}.html')

# '/game/ending' URL에 대한 라우트를 정의합니다.
@app.route('/game/ending')
def game_ending():
    return render_template('game_ending.html')

# playerData(유저ID/유저PW) 받아서 저장
@app.route('/api/playerdata', methods=['POST'])
def save_playerData():
    receive_playerID = request.form.get('playerID')
    receive_Password = request.form.get('playerPassword')

    # DB에 이미 같은 ID가 있는지 확인
    if db.playerData.find_one({'playerID': receive_playerID}):
        return jsonify({'result': 'fail', 'message': '이미 존재하는 아이디입니다.'})
    
    # 중복 없으면 저장
    playerData = {'playerID': receive_playerID, 'playerPassword': receive_Password } 
    db.playerData.insert_one(playerData)
    return jsonify({'result': 'success', 'message': '회원가입 완료!'})

# commnet 저장
@app.route('/api/postcomment', methods=['POST'])
def save_comment():
    if request.method == 'POST':
        receive_comment = request.form.get('playerComment')
        receive_date = request.form.get('Date')
        comment_data = {'playerComment': receive_comment, 'Date': receive_date}  # +유저 정보 추가
        db.playerComment.insert_one(comment_data)
        return jsonify({'result': 'success'})

# comment 불러오기
@app.route('/api/loadcomment', methods=['GET'])
def load_comment():
    result = list(db.playerComment.find({}, {'_id': 0}))
    return jsonify({'result': 'success', 'playerComment': result, 'Date': result})

if __name__ == '__main__':

    app.run(debug=True)