function setImage(el){
    let prop = 'background-image';

    $('.item-images').removeClass('border border-primary');

    $('#previewBlock').css(prop, $(el).css(prop));

    $(el).addClass('border border-primary');
}