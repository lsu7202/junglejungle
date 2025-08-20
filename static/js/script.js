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

        const playerID = load_playerIdInSession(); 
        const currentCut = this.dataset.currentCut;
        const nextCut = this.dataset.nextCut;
        const choiceText = this.dataset.choiceText;

        console.log(`선택: ${choiceText}, 다음 컷: ${nextCut}`);

        save_choice(currentCut, playerID, choiceText);

        load_game_new(nextCut);
    });
}


const selectButton = $('.select-btn');

for (const button of selectButton) {
    button.addEventListener('click', function() {
        const nextCut = this.dataset.nextCut;
        
        // save_playerName이 성공하면 load_game_new를 실행하도록 콜백으로 전달
        save_playerName(function() {
            load_game_new(nextCut);
        });
    });
}
// ---------------------------------[1] 페이지 로딩 로직--------------------------------//
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
                set_playerIdInSession(ID)
            } else {
                alert("아이디 또는 비밀번호가 올바르지 않습니다.");
            }
        },
        error: function(xhr, status, error) {
            console.error("서버 전송 오류:", error);
        }
    });
}

// script.js

// 플레이어 이름 받아서 db에 저장
function save_playerName(callback) { // 성공 시 실행할 콜백 함수를 인자로 받습니다.
    let name = $('#playerName').val();
    playerID = load_playerIdInSession()
    if (!name) {
        alert("이름을 입력해주세요!");
        return;
    }
    $.ajax({
        type: 'POST',
        url: '/api/playerName',
        data: { 'playerName': name, 'playerID':  playerID},
        success: function (response) {
            console.log(response);
            set_usernameInSession(name); // 세션 변수 설정
            if (callback) {
                callback(); // 성공 시 콜백 함수 실행
            }
        },
        error: function (xhr, status, error) {
            console.error("서버 전송 오류:", error);
        }
    });
}

function set_playerIdInSession(playerID) {
    console.log(`${playerID} 저장`)
    parent.player_session.playerID = playerID
}

function set_usernameInSession(username) {
    console.log(`${username} 저장`)
    parent.player_session.username = username
}

function load_usernameInSession() {
    return parent.player_session.username
}

function load_playerIdInSession() {
    return parent.player_session.playerID
}

// -------------------------------- [2] USER DB 자바스크립트 로직 --------------------------------//
// ------------------------------------------------------------------------------------//


// ------------------------------------------------------------------------------------//
// ----------------------------------[3] 게시물 관리 로직---------------------------------//


// 후기 받아서 db에 저장
function save_review() {

    let comment = $('#save-review-box').val();
    let comment_date = getCurrentDateTimeStr();
    if (!comment) {
        alert("입력할 내용이 없습니다.");
        return;
    }

    const playerID = load_playerIdInSession()
    const playerName = load_usernameInSession()

    $.ajax({
        type: 'POST',
        url: '/api/postreview',
        data: { playerReview: comment, Date: comment_date, playerID: playerID, playerName:playerName },
        success: function (response) {
            alert('작성완료.');
            $('#save-review-box').val('');
            show_review();
            
        },
        error: function (xhr, status, error) {
            console.error("서버 전송 오류:", error);
        }
    });
}



// [수정됨] 후기창에 후기 추가
function show_review() {
    $.ajax({
        type: 'GET',
        url: '/api/loadreview',
        dataType: "json",
        success: function (response) {
            let comments = response.playerReview;
            
            $('.contents').empty();

            if (!comments || comments.length === 0) {
                $('.contents').html('<div class="comment-box" style="text-align:center;">아직 작성된 후기가 없습니다.</div>');
                return;
            }

            for (let i = comments.length - 1; i >= 0; i--) {
                let review = comments[i];
                let review_id = review._id; // << [추가] 각 후기의 고유 ID
                let playerName = review.playerName;
                let commentText = review.playerReview;
                let date = review.Date;
                let replies = review.replies || [];
                let replyCount = replies.length;

                let replies_html = `<div class="replies-container">`;
                if (replyCount > 0) {
                    for (const reply of replies) {
                        replies_html += `
                            <div class="single-reply">
                                <div class="reply-info">${reply.playerName}</div>
                                <div class="reply-text">${reply.replyText}</div>
                            </div>
                        `;
                    }
                }
                replies_html += '</div>';

                // [수정] comment-box div에 data-review-id 속성으로 고유 ID를 저장
                let comment_box_html = `
                <div class="comment-box" data-review-id="${review_id}">
                    <div class="review-info-box">
                        <span>${playerName}</span>
                        <span>${date}</span>
                    </div>
                    <div class="review-text-box">${commentText}</div>
                    ${replies_html}
                    <div class="reply-button-container">
                        <button class="view-replies-btn" onclick="toggle_replies(this)" data-count="${replyCount}">답글 보기 (${replyCount})</button>
                        <button class="reply-btn" onclick="show_reply_input(this)">답글달기</button>
                    </div>
                    <div class="reply-input-container"></div>
                </div>
                `;
                $('.contents').append(comment_box_html);
            }
        },
        error: function () {
            console.log("후기 불러오기 실패");
            $('.contents').html('<div class="comment-box" style="text-align:center;">후기를 불러오는 데 실패했습니다.</div>');
        }
    });
}

function toggle_replies(buttonElement) {
    const $button = $(buttonElement);
    const repliesContainer = $button.closest('.comment-box').find('.replies-container');

    repliesContainer.slideToggle();

    if (repliesContainer.is(':visible')) {
        $button.text(`답글 숨기기 (${$button.data('count')})`);
    } else {
        $button.text(`답글 보기 (${$button.data('count')})`);
    }
}

function show_reply_input(buttonElement) {
    const replyInputContainer = $(buttonElement).closest('.comment-box').find('.reply-input-container');
    
    if (replyInputContainer.children().length > 0) {
        replyInputContainer.empty();
        return;
    }

    let reply_input_html = `
        <div class="reply-input-box">
            <textarea placeholder="답글을 입력하세요..."></textarea>
            <button onclick="submit_reply(this)">등록</button>
        </div>
    `;
    replyInputContainer.html(reply_input_html);
}

// [수정됨] 답글 등록 로직
function submit_reply(buttonElement) {
    const commentBox = $(buttonElement).closest('.comment-box');
    const review_id = commentBox.data('review-id'); // << [수정] data 속성에서 고유 ID 가져오기
    const replyTextArea = commentBox.find('.reply-input-box textarea');
    const replyText = replyTextArea.val();
    
    const replier_playerName = load_usernameInSession();

    if (!replyText) {
        alert("답글 내용을 입력해주세요.");
        return;
    }

    if (!replier_playerName) {
        alert("답글을 작성하려면 로그인이 필요합니다.");
        return;
    }
    
    $.ajax({
        type: 'POST',
        url: '/api/reply',
        data: {
            'review_id': review_id, // << [수정] 서버에 playerID 대신 review_id 전송
            'playerName': replier_playerName,
            'replyText': replyText
        },
        success: function(response) {
            if (response.result === 'success') {
                const new_reply_html = `
                    <div class="single-reply">
                        <div class="reply-info">${replier_playerName}</div>
                        <div class="reply-text">${replyText}</div>
                    </div>
                `;
                
                const repliesContainer = commentBox.find('.replies-container');
                repliesContainer.append(new_reply_html);
                
                repliesContainer.slideDown();
                
                const viewRepliesBtn = commentBox.find('.view-replies-btn');
                let newCount = (viewRepliesBtn.data('count') || 0) + 1;
                viewRepliesBtn.data('count', newCount);
                viewRepliesBtn.text(`답글 숨기기 (${newCount})`);

                commentBox.find('.reply-input-container').empty();

            } else {
                alert(response.message || '답글 등록에 실패했습니다.');
            }
        },
        error: function() {
            alert('서버와 통신 중 오류가 발생했습니다.');
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
// --- (이하 코드는 변경 없음) ---
// ------------------------------------------------------------------------------------//
$(document).ready(function () {});


function get_choices(playerID, callback) {
    $.ajax({
        url: '/api/choices',
        type: 'GET',
        data: { playerID: playerID },
        success: function(response) {
            if (response.result === 'success' && response.choices) {
                callback(response.choices);
            }
        },
        error: function(xhr, status, error) {
            console.error("Failed to get choices:", status, error);
        }
    });
}

//-----------------------------------------------------------------------------------------//
async function load_saved_game() {
    try {
        const gameIframe = parent.document.getElementById('game-container');
        if (!gameIframe) {
            console.error("오류: 'game-container' ID를 가진 iframe 요소를 찾을 수 없습니다.");
            return;
        }

        const playerID = load_playerIdInSession();
        if (!playerID) {
            console.error("오류: playerID를 세션에서 불러올 수 없습니다.");
            return;
        }

        console.log("Player ID:", playerID);

        const nameResponse = await $.ajax({
            url: '/api/playerName',
            type: 'GET',
            data: { 'playerID': playerID }
        });
        
        set_usernameInSession(nameResponse.playerName);
        console.log("가져온 Username:", load_usernameInSession());

        const cutResponse = await $.ajax({
            url: '/api/get_last_cut',
            type: 'GET',
            data: { 'playerID': playerID }
        });

        if (cutResponse.result === 'success') {
            const cut_id = cutResponse.last_cut_id;
            console.log("정렬된 컷 ID 목록:", cutResponse.sorted_cutID);
            console.log("마지막 컷 ID:", cut_id);
            
            gameIframe.src = `/game/${cut_id}`;
        } else {
            alert(cutResponse.message);
        }

    } catch (error) {
        console.error("게임 불러오기 중 오류 발생:", error);
    }
}
//-----------------------------------------------------------------------------------------//