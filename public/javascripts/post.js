$(function () {
    var simplemde = new SimpleMDE({
        element: $("#post")[0],
        spellChecker: false
    });

    $('#submit').click(function () {
        var data = {
            cate: $('[name="cate"]').val(),
            subCate: $('[name="subCate"]').val(),
            title: $('[name="title"]').val(),
            tags: $('.chips').material_chip('data'),
            post: simplemde.value()
        }

        $.ajax({
            url: '/post',
            data: {data: JSON.stringify(data)},
            type: 'POST',
            dataType: 'json',
            success: function (json) {
                if(json.code == 0 ){
                    window.location.href="/";
                }
            }
        })
    });
});