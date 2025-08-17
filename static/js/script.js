// 컷 페이지 로드
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

// 엔딩 페이지 로드
function load_ending_page() {

    const gameIframe = parent.document.getElementById('game-container');

    // 만약 iframe 요소를 찾지 못했다면 콘솔에 오류 메시지를 출력합니다.
    if (!gameIframe) {
        console.error("오류: 'game-container' ID를 가진 iframe 요소를 찾을 수 없습니다.");
        return; // 함수 실행 중단
    }

    gameIframe.src = `/game/ending`;

    console.log(`'game_ending.html'을 iframe에 로드했습니다.`);
}

// 플레이어 이름 받아서 db에 저장
function save_playerName() {
    let name = $('#playerName').val();
    $.ajax({
        type: 'POST',
        url: '/game',
        data: { playerName: name },
        success: function (response) {
            console.log(response);
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
            console.log(response);
            let playerName = response['playerName'];
        }
    }
    );
}

// 댓글 받아서 db에 저장
function save_comment() {

    let comment = $('#comment-input').val();
    if (!comment) {
        alert("댓글을 입력하세요!");
        return;
    }

    $.ajax({
        type: 'POST',
        url: '/game/ending/comment',
        data: { playerComment: comment },
        success: function (response) {
            alert('댓글을 남겼습니다.');
            show_comment();
        },
        error: function (xhr, status, error) {
            console.error("서버 전송 오류:", error);
        }
    });
}

// 댓글창에 댓글 추가
function show_comment() {
    $.ajax({
        type: 'GET',
        url: '/game/ending/comment',
        dataType: "json",
        success: function (response) {
            console.log("hello");
            let comments = response['playerComment'];

            // 코멘트 영역 초기화
            $('#comment-list').empty();

            for (let i = 0; i < comments.length; i++) {
                let comment = comments[i].playerComment;
                $('#comment-list').append(`${comment}<br>`);
            }
        },
        error: function () {
            console.log("빠꾸해");
        }
    });
}

$(document).ready(function() {
    show_comment(); // DOM 준비 후 호출
});