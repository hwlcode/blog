$(function () {
    var simpleMDE = new SimpleMDE({
        element: document.getElementById("discuss"),
        status: false,
        toolbar: false
    });

    $('#submit-discuss').on('click', function () {
        $.ajax({
            url: '/discuss',
            data: {
                discuss: simpleMDE.value(),
                id: $('#article_id').val()
            },
            type: 'POST',
            dataType: 'json',
            success: function (json) {
                console.log(json);
                if(json.code == 0){
                    window.location.href += '?#discuss-list';
                }
            }
        })
    });
});