from flask import Flask, render_template, jsonify, request, url_for
from flask_cors import CORS
from pymongo import MongoClient
import certifi
from bson.objectid import ObjectId # 고유 ID 처리를 위해 import

app = Flask(__name__)

ca = certifi.where()

uri = "mongodb+srv://admin:vlxjvos1080@cluster0.xdzsy0j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(uri, tlsCAFile=ca)
db = client.junglejungle

# --- (기존 코드는 변경 없음) ---
@app.route('/')
def index():
    return render_template('index.html')


@app.route('/login')
def game_login():
    return render_template('login.html')

@app.route('/signup')
def game_signup():
    return render_template('signup.html')

@app.route('/game/<int:cut_id>')
def game_cut(cut_id):
    return render_template(f'cut{cut_id}.html')

@app.route('/game/ending')
def game_ending():
    return render_template('game_ending.html')

#------------------------- DB API 정의 코드 ----------------------------------------------------------#

@app.route('/api/playerdata', methods=['POST'])
def save_playerData():
    receive_playerID = request.form.get('playerID')
    receive_Password = request.form.get('playerPassword')

    if db.playerData.find_one({'playerID': receive_playerID}):
        return jsonify({'result': 'fail', 'message': '이미 존재하는 아이디입니다.'})
    
    playerData = {'playerID': receive_playerID, 'playerPassword': receive_Password } 
    db.playerData.insert_one(playerData)
    return jsonify({'result': 'success', 'message': '회원가입 완료!'})

@app.route('/api/playerName', methods=['POST'])
def set_playername():
    playerID = request.form.get('playerID')
    playerName = request.form.get('playerName')
    if not playerName:
        return jsonify({"success": False, "message": "이름을 입력해주세요."})

    db.playerData.update_one(
        {"playerID": playerID},
        {"$set": {"playerName": playerName}}
    )

    return jsonify({"success": True})

@app.route('/api/playerName', methods=['GET'])
def get_playername():
    playerID = request.args.get('playerID')
    if not playerID:
        return jsonify({"success" : False, "message":"불러올 이름이 없습니다"})
    
    result = db.playerData.find_one({'playerID':playerID}, {'playerName': 1, '_id': 0})
    if result:
        return jsonify({
            'success':True, 'playerName' : result['playerName']
        })

@app.route('/api/login', methods=['POST'])
def login_player():
    receive_ID = request.form.get('playerID')
    receive_Password = request.form.get('playerPassword')
    
    user = db.playerData.find_one({'playerID': receive_ID, 'playerPassword': receive_Password})
    
    if user:
        return jsonify({'result': 'success'})
    else:
        return jsonify({'result': 'fail'})

@app.route('/api/postreview', methods=['POST'])
def save_review():
    if request.method == 'POST':
        receive_playerID = request.form.get('playerID')
        receive_username = request.form.get('playerName')
        receive_comment = request.form.get('playerReview')
        receive_date = request.form.get('Date')
        comment_data = {'playerID':receive_playerID, 'playerName':receive_username, 'playerReview': receive_comment, 'Date': receive_date}
        db.playerComment.insert_one(comment_data)
        return jsonify({'result': 'success'})

# [수정됨] review 불러오기: 각 후기 데이터에 고유 '_id'를 문자열로 변환하여 추가
@app.route('/api/loadreview', methods=['GET'])
def load_review():
    reviews = list(db.playerComment.find({}))
    for review in reviews:
        review['_id'] = str(review['_id'])
    return jsonify({'result': 'success', 'playerReview': reviews})

# [수정됨] 답글 달기: playerID 대신 고유 'review_id'를 받아 처리
@app.route('/api/reply', methods=['POST'])
def reply():
    if request.method == 'POST':
        review_id = request.form.get('review_id')
        replier_playerName = request.form.get('playerName')
        replyText = request.form.get('replyText')

        if not all([review_id, replier_playerName, replyText]):
            return jsonify({'result': 'fail', 'message': '필수 정보가 누락되었습니다.'})

        try:
            result = db.playerComment.update_one(
                {'_id': ObjectId(review_id)},
                {'$push': {'replies': {'playerName': replier_playerName, 'replyText': replyText}}}
            )

            if result.modified_count > 0:
                return jsonify({'result': 'success'})
            else:
                return jsonify({'result': 'fail', 'message': '해당 후기를 찾을 수 없습니다.'})
        except Exception as e:
            return jsonify({'result': 'fail', 'message': f'오류 발생: {e}'})

# --- (이하 코드는 변경 없음) ---
@app.route('/api/choices', methods=['POST'])
def save_choice():
    if request.method == 'POST':
        receive_playerID = request.form.get('playerID')
        receive_id = request.form.get('cut_id')
        choice_text = request.form.get('choice_text')
        
        db.choices.update_one(
            {'playerID': receive_playerID},
            {'$set': {f'choices.{receive_id}': choice_text}},
            upsert=True
        )
        
        return jsonify({'result': 'success'})

@app.route('/api/choices', methods=['GET'])  
def get_choices():
    if request.method == 'GET':
        receive_playerID = request.args.get('playerID') 
        
        player_data = db.choices.find_one({'playerID': receive_playerID})
        
        if player_data and 'choices' in player_data:
            choices_list = player_data['choices']
            return jsonify({'result': 'success', 'choices': choices_list})
        else:
            return jsonify({'result': 'success', 'choices': {}})
        
@app.route('/api/get_last_cut', methods=['GET'])
def get_last_cut():
    playerID = request.args.get('playerID')
    player_data = db.choices.find_one({'playerID': playerID})
    if player_data and 'choices' in player_data:
        choices = player_data['choices']
        if not choices:
            return jsonify({'result': 'fail', 'message': '선택 기록이 없습니다.'})

        cut_ids = sorted(choices.keys(), key=int)
        last_cut_id = sorted(choices.keys(), key=int)[-1]

        return jsonify({'result': 'success', 'last_cut_id': last_cut_id, 'sorted_cutID': cut_ids})
    else:
        return jsonify({'result': 'fail', 'message': '선택 기록이 없습니다.'})
        

if __name__ == '__main__':

    app.run(debug=True)