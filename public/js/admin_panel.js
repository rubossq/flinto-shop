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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJhZG1pbl9wYW5lbC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBzdWJzY3JpYmVBcnJvdyhzZWxlY3Rvcil7XG4gICAgJChzZWxlY3Rvcikub24oJ2hpZGUuYnMuY29sbGFwc2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICQoc2VsZWN0b3IpLnBhcmVudCgpLmZpbmQoJy5hcnJvdycpLmZpcnN0KClcbiAgICAgICAgICAgIC5odG1sKCc8aW9uLWljb24gbmFtZT1cImFycm93LWRyb3ByaWdodFwiPjwvaW9uLWljb24+Jyk7XG4gICAgfSk7XG4gICAgJChzZWxlY3Rvcikub24oJ3Nob3cuYnMuY29sbGFwc2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICQoc2VsZWN0b3IpLnBhcmVudCgpLmZpbmQoJy5hcnJvdycpLmZpcnN0KClcbiAgICAgICAgICAgIC5odG1sKCc8aW9uLWljb24gbmFtZT1cImFycm93LWRyb3Bkb3duXCI+PC9pb24taWNvbj4nKTtcbiAgICB9KTtcbn1cblxuc3Vic2NyaWJlQXJyb3coJyNjYXRlZ29yaWVzLW5hdi1ibG9jazInKTtcblxuc3Vic2NyaWJlQXJyb3coJyNpdGVtcy1uYXYtYmxvY2snKTsiXSwiZmlsZSI6ImFkbWluX3BhbmVsLmpzIn0=
