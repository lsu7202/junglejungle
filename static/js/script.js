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

// function goToPage(pageNumber) {
//   if (pageNumber === 1) {
//     // 1번 페이지로 이동
//     window.location.href = 'cut2.html';
//   } else if (pageNumber === 2) {
//     // 2번 페이지로 이동
//     window.location.href = 'cut3.html';
//   }
// }