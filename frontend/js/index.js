$('#slider').carousel({
    interval: 5000
});

$('#slider').on('slide.bs.carousel', function (event) {
    setActive(event.to);
});

function slideTo(slide) {
    $('#slider').carousel(slide);
    setActive(slide);
}

function setActive(slide) {
    $('.slider-nav-item').each(function () {
        $(this).removeClass('active')
    });

    $('.slider-nav-item').eq(slide).addClass('active')
}