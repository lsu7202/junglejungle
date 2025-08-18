function load_game_new(cut_id) {

    const gameIframe = parent.document.getElementById('game-container');

    // 만약 iframe 요소를 찾지 못했다면 콘솔에 오류 메시지를 출력합니다.
    if (!gameIframe) {
        console.error("오류: 'game-container' ID를 가진 iframe 요소를 찾을 수 없습니다.");
        return; // 함수 실행 중단
    }

    gameIframe.src = `/game/${cut_id}`;

    console.log(`'cut${cut_id}.html'을 iframe에 로드했습니다.`);
}

function save_choice(cut_id, playerID, choice_text) {
    $.ajax({
        type : "POST",
        url : "/api/choices",
        data : {
            'playerID' : playerID,
            'cut_id' : cut_id,
            'choice_text' : choice_text
        },
        success : function(response) {
            if(response['result'] === 'success') {
                console.log('POST choice')
            }
        }
    })
}




// 이벤트리스너 부분 ----------------------------------------------------

// 선택지 저장 버튼을 정의합니다!
const choiceButtons = document.getElementsByClassName('choice-btn');

for (const button of choiceButtons) {
    button.addEventListener('click', function() {

        const playerID = 'USER1'; 
        const currentCut = this.dataset.currentCut;
        const nextCut = this.dataset.nextCut;
        const choiceText = this.dataset.choiceText;

        console.log(`선택: ${choiceText}, 다음 컷: ${nextCut}`);

        save_choice(currentCut, playerID, choiceText);

        load_game_new(nextCut);
    });
}
