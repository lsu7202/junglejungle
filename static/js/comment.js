$(document).ready(function () {
    showComment();

    $('#post-comment-btn').click(function () {
        let name = $('#name_input').val();
        let comment = $('#comment_input').val();

        $.ajax({
            type: 'POST',
            url: 'game/ending',
            data: { comment_give: comment },
            success: function (response) {
                alert('댓글을 남겼습니다.');
                window.location.reload();
            }
        });
    });
});

function showComment() {
    $.ajax({
        type: 'GET',
        url: 'game/ending',
        success: function (response) {
            let comments = response['add_comment'];

            // 코멘트 영역 초기화
            $('#comment-list').empty();

            for (let i = 0; i < comments.length; i++) {
                let comment = comments[i]['comment'];

                let temp_comment = `${comment}<br>`;

                $('#comment-list').append(temp_comment);
            }
        }
    });
}