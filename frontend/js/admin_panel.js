function subscribeArrow(selector){
    $(selector).on('hide.bs.collapse', function () {
        $(selector).parent().find('.arrow').first()
            .html('<ion-icon name="arrow-dropright"></ion-icon>');
    });
    $(selector).on('show.bs.collapse', function () {
        $(selector).parent().find('.arrow').first()
            .html('<ion-icon name="arrow-dropdown"></ion-icon>');
    });
}

subscribeArrow('#categories-nav-block');

subscribeArrow('#items-nav-block');