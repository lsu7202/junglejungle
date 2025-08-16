document.addEventListener('DOMContentLoaded', () => {
    const titleText = document.getElementById('title-text-img');
    const newGameBtn = document.getElementById('new-game-btn');
    const loadGameBtn = document.getElementById('load-game-btn');

    // Add animation class to title text after a delay
    setTimeout(() => {
        titleText.classList.add('fade-in');
    }, 500); // Delay for 0.5 seconds

    // Add animation class to buttons after title text animation
    setTimeout(() => {
        newGameBtn.classList.add('slide-in');
        loadGameBtn.classList.add('slide-in');
    }, 1500); // Delay for 1.5 seconds

    newGameBtn.addEventListener('click', () => {
        alert('새 게임 시작!');
        // 여기에 새 게임 시작 로직을 추가하세요 (예: 페이지 이동)
        // window.location.href = '/start_new_game'; 
    });

    loadGameBtn.addEventListener('click', () => {
        alert('게임 불러오기!');
        // 여기에 게임 불러오기 로직을 추가하세요 (예: 페이지 이동)
        // window.location.href = '/load_saved_game';
    });
});
