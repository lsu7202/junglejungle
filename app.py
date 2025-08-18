from flask import Flask, render_template, jsonify, request, url_for
from flask_cors import CORS  # CORS 처리를 위해 임포트합니다.
from pymongo import MongoClient
import certifi # MongoDB Atlas의 TLS 인증서 처리를 위해 임포트합니다.

app = Flask(__name__)

ca = certifi.where()

uri = "mongodb+srv://admin:vlxjvos1080@cluster0.xdzsy0j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(uri, tlsCAFile=ca)
db = client.junglejungle

# 루트 URL('/')에 대한 라우트를 정의합니다.
# 사용자가 웹사이트의 메인 페이지에 접속할 때 이 함수가 실행됩니다.
@app.route('/')
def index():
    return render_template('index.html')


@app.route('/login')
def game_login():
    return render_template('login.html')

# '/game/컷번호' URL에 대한 라우트를 정의합니다. cut_id : 0~
@app.route('/game/<int:cut_id>')
def game_cut(cut_id):
    return render_template(f'cut{cut_id}.html')

#------------------------- DB 구조 ----------------------------------------------------------#
'''
choices : POST 플레이어의 선택을 저장합니다 / GET 플레이어의 선택을 조회합니다.
choice_0 , choice_1 같은 형식으로 POST
{playerID : str, choice_{num} : str}

saved_data : POST 유저의 게임 데이터를 저장합니다 / GET 유저의 게임 데이터를 불러옵니다.
{playerID : str, username : str, cut_id : int} 

playerComment : POST 플레이어의 후기를 저장합니다 / GET 플레이어들의 후기를 조회합니다.
{playerComment : str, Date : str}
'''

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



# ------------------------------------------------ update -----------------------#
# playerID 별로 저장된 choice는 choice_id 로 저장됩니다. 여기서 id는 cut_id의 id와 똑같이 해주세요.

@app.route('/api/choices', methods=['POST'])
def save_choice():
    if request.method == 'POST':
        receive_playerID = request.form.get('playerID')
        receive_id = request.form.get('cut_id')
        choice_text = request.form.get('choice_text')
        
        # playerID로 기존 document를 찾아서 choices 필드를 업데이트합니다.
        # upsert=True 옵션은 playerID에 해당하는 document가 없을 경우 새로 생성해줍니다.
        db.choices.update_one(
            {'playerID': receive_playerID},
            {'$set': {f'choices.choice_{receive_id}': choice_text}},
            upsert=True
        )
        
        return jsonify({'result': 'success'})

# 'playerID'로 저장된 선택지 목록 전체를 가져오기
@app.route('/api/choices', methods=['GET'])  
def get_choices():
    if request.method == 'GET':
        # GET 요청에서는 request.args를 사용하는 것이 일반적입니다.
        receive_playerID = request.args.get('playerID') 
        
        # find_one으로 playerID에 해당하는 하나의 document를 찾습니다.
        player_data = db.choices.find_one({'playerID': receive_playerID})
        
        if player_data and 'choices' in player_data:
            # document가 존재하고 'choices' 필드가 있으면 해당 객체를 반환합니다.
            choices_list = player_data['choices']
            return jsonify({'result': 'success', 'choices': choices_list})
        else:
            # 데이터가 없는 경우
            return jsonify({'result': 'success', 'choices': {}})


if __name__ == '__main__':

    app.run(debug=True)