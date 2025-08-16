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

// 플레이어 이름 받아서 db에 저장
function save_playerName() {
    let name = $('#playerName').val();
    $.ajax({
        type: 'POST',
        url: '/game',
        data: { playerName: name },
        success: function (response) {
        },
        error: function (xhr, status, error) {
            console.error("서버 전송 오류:", error);
        }
    });
}

// 플레이어 이름 불러오기
function load_playerName() {
    $.ajax({
        type: 'GET',
        url: '/game',
        success: function (response) {
            let playerName = response['playerName'];
            }
        }
    );
}