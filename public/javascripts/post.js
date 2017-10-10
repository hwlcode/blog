$(function () {
    var simplemde = new SimpleMDE({
        element: $("#post")[0],
        spellChecker: false,
        autosave: {
            enabled: true,
            unique_id: "post",
        }
    });

    $('#submit').click(function () {
        var data = {
            cate: $('[name="cate"]').val(),
            subCate: $('[name="subCate"]').val(),
            title: $('[name="title"]').val(),
            topics: $('.chips').material_chip('data'),
            post: simplemde.value()
        }

        $.ajax({
            url: '/post',
            data: data,
            type: 'POST',
            dataType: 'json',
            success: function (json) {
                console.log(json);
            }
        })
    });
});