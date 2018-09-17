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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJpbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIkKCcjc2xpZGVyJykuY2Fyb3VzZWwoe1xuICAgIGludGVydmFsOiA1MDAwXG59KTtcblxuJCgnI3NsaWRlcicpLm9uKCdzbGlkZS5icy5jYXJvdXNlbCcsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIHNldEFjdGl2ZShldmVudC50byk7XG59KTtcblxuZnVuY3Rpb24gc2xpZGVUbyhzbGlkZSkge1xuICAgICQoJyNzbGlkZXInKS5jYXJvdXNlbChzbGlkZSk7XG4gICAgc2V0QWN0aXZlKHNsaWRlKTtcbn1cblxuZnVuY3Rpb24gc2V0QWN0aXZlKHNsaWRlKSB7XG4gICAgJCgnLnNsaWRlci1uYXYtaXRlbScpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKVxuICAgIH0pO1xuXG4gICAgJCgnLnNsaWRlci1uYXYtaXRlbScpLmVxKHNsaWRlKS5hZGRDbGFzcygnYWN0aXZlJylcbn0iXSwiZmlsZSI6ImluZGV4LmpzIn0=
