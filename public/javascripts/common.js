$(document).ready(function(){
    //login modal
    $('.modal').modal();
    // select
    $('select').material_select();
    //chips
    $('.chips-placeholder').material_chip({
        placeholder: '添加标签',
        secondaryPlaceholder: '+Tag',
    });
    //header dropdown
    $(".dropdown-button").dropdown();
});
