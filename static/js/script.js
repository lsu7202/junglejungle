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

// 엔딩 페이지로 이동
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

// 선택지 저장 버튼을 정의합니다! ----------------- 이벤트 리스너

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
// ---------------------------------[1] 다음 페이지 로딩 로직--------------------------------//
// ------------------------------------------------------------------------------------//






// ------------------------------------------------------------------------------------//
// -------------------------------- [2] USER DB 자바스크립트 로직 --------------------------------//

// 로그인 페이지로 이동
function load_game_login() {

    const gameIframe = parent.document.getElementById('game-container');

    // 만약 iframe 요소를 찾지 못했다면 콘솔에 오류 메시지를 출력합니다.
    if (!gameIframe) {
        console.error("오류: 'game-container' ID를 가진 iframe 요소를 찾을 수 없습니다.");
        return; // 함수 실행 중단
    }

    gameIframe.src = `/login`;

    console.log(`'login.html'을 iframe에 로드했습니다.`);
}

// 회원가입 페이지로 이동
function load_game_signup() {

    const gameIframe = parent.document.getElementById('game-container');

    // 만약 iframe 요소를 찾지 못했다면 콘솔에 오류 메시지를 출력합니다.
    if (!gameIframe) {
        console.error("오류: 'game-container' ID를 가진 iframe 요소를 찾을 수 없습니다.");
        return; // 함수 실행 중단
    }

    gameIframe.src = `/signup`;

    console.log(`'signup.html'을 iframe에 로드했습니다.`);
}

// 유저ID/유저PW 받아서 db에 저장
function save_playerData() {
    let ID = $('#playerID_signup').val();
    let password = $('#password_signup').val();

    if (!ID || !password) {
        alert("아이디와 비밀번호를 입력해주세요!");
        return;
    }
    
    $.ajax({
        type: 'POST',
        url: '/api/playerdata',
        data: { playerID: ID, playerPassword: password },
        success: function (response) {
            if(response.result === 'fail'){
                alert(response.message); // 이미 존재하는 ID입니다
            } else {
                alert(response.message); // 회원가입 완료
                load_game_login(); // 로그인 페이지로 이동
            }
        },
        error: function (xhr, status, error) {
            console.error("서버 전송 오류:", error);
        }
    });
}

// 로그인
function load_playerData() {
    let ID = $('#playerID_login').val();
    let password = $('#password_login').val();

    if (!ID || !password) {
        alert("아이디와 비밀번호를 입력해주세요!");
        return;
    }
    $.ajax({
        type: 'POST',
        url: '/api/login',
        data: { playerID: ID, playerPassword: password },
        success: function(response) {
            if (response.result === 'success') {
                load_game_new(100);
            } else {
                alert("아이디 또는 비밀번호가 올바르지 않습니다.");
            }
        },
        error: function(xhr, status, error) {
            console.error("서버 전송 오류:", error);
        }
    });
}

// 플레이어 이름 받아서 db에 저장
function save_playerName() {
    let name = $('#playerName').val();
    $.ajax({
        type: 'POST',
        url: '/api/playerdata',
        data: { playerName: name },
        success: function (response) {
            console.log(response);
        },
        error: function (xhr, status, error) {
            console.error("서버 전송 오류:", error);
        }
    });
}

// -------------------------------- [2] USER DB 자바스크립트 로직 --------------------------------//
// ------------------------------------------------------------------------------------//






// ------------------------------------------------------------------------------------//
// ----------------------------------[3] 게시물 관리 로직---------------------------------//


// 댓글 받아서 db에 저장
function save_comment() {

    let comment = $('#comment-input').val();
    let comment_date = getCurrentDateTimeStr();
    if (!comment) {
        alert("댓글을 입력하세요!");
        return;
    }

    $.ajax({
        type: 'POST',
        url: '/api/postcomment',
        data: { playerComment: comment, Date: comment_date },
        success: function (response) {
            alert('댓글을 남겼습니다.');
            $('#comment-input').val('');
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
        url: '/api/loadcomment',
        dataType: "json",
        success: function (response) {
            console.log("저장됐어요");
            let comments = response['playerComment'];
            let dates = response['Date'];

            // 코멘트 영역 초기화
            $('#comment-list').empty();

            for (let i = comments.length - 1; i >= 0; i--) {
                let comment = comments[i].playerComment;
                let date = comments[i].Date;
                $('#comment-list').append(`${comment} ${date}<br>`);
            }
        },
        error: function () {
            console.log("빠꾸해");
        }
    });
}

// 현재 시간 저장하는 함수(댓글과 함께 사용) ex.2025-08-17 14:35
function getCurrentDateTimeStr() {
    const now = new Date();
    const dateStr = now.getFullYear() + '-' +
        String(now.getMonth() + 1).padStart(2, '0') + '-' +
        String(now.getDate()).padStart(2, '0');
    const timeStr = String(now.getHours()).padStart(2, '0') + ':' +
        String(now.getMinutes()).padStart(2, '0');
    return `${dateStr} ${timeStr}`;
}
// ----------------------------------[3] 게시물 관리 로직---------------------------------//
// ------------------------------------------------------------------------------------//






// ------------------------------------------------------------------------------------//
// ----------------------------------[4] 엔딩페이지에 선택 불러오기---------------------------------//
$(document).ready(function () {
    show_comment(); // DOM 준비 후 호출
});


function get_choices(playerID, callback) {
    $.ajax({
        url: '/api/choices',
        type: 'GET',
        data: { playerID: playerID },
        success: function(response) {
            if (response.result === 'success' && response.choices) {
                // 성공적으로 데이터를 받으면 콜백 함수를 호출하며 데이터를 전달
                callback(response.choices);
            }
        },
        error: function(xhr, status, error) {
            console.error("Failed to get choices:", status, error);
        }
    });
}

// ----------------------------------[4] 엔딩페이지에 선택 불러오기---------------------------------//
// ------------------------------------------------------------------------------------//