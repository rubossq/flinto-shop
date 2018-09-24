var baseUrl = '';
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

subscribeArrow('#categories-nav-block2');

subscribeArrow('#items-nav-block');

function setBaseUrl(url){
    baseUrl = url;
}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJhZG1pbl9wYW5lbC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYmFzZVVybCA9ICcnO1xuZnVuY3Rpb24gc3Vic2NyaWJlQXJyb3coc2VsZWN0b3Ipe1xuICAgICQoc2VsZWN0b3IpLm9uKCdoaWRlLmJzLmNvbGxhcHNlJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAkKHNlbGVjdG9yKS5wYXJlbnQoKS5maW5kKCcuYXJyb3cnKS5maXJzdCgpXG4gICAgICAgICAgICAuaHRtbCgnPGlvbi1pY29uIG5hbWU9XCJhcnJvdy1kcm9wcmlnaHRcIj48L2lvbi1pY29uPicpO1xuICAgIH0pO1xuICAgICQoc2VsZWN0b3IpLm9uKCdzaG93LmJzLmNvbGxhcHNlJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAkKHNlbGVjdG9yKS5wYXJlbnQoKS5maW5kKCcuYXJyb3cnKS5maXJzdCgpXG4gICAgICAgICAgICAuaHRtbCgnPGlvbi1pY29uIG5hbWU9XCJhcnJvdy1kcm9wZG93blwiPjwvaW9uLWljb24+Jyk7XG4gICAgfSk7XG59XG5cbnN1YnNjcmliZUFycm93KCcjY2F0ZWdvcmllcy1uYXYtYmxvY2syJyk7XG5cbnN1YnNjcmliZUFycm93KCcjaXRlbXMtbmF2LWJsb2NrJyk7XG5cbmZ1bmN0aW9uIHNldEJhc2VVcmwodXJsKXtcbiAgICBiYXNlVXJsID0gdXJsO1xufSJdLCJmaWxlIjoiYWRtaW5fcGFuZWwuanMifQ==
