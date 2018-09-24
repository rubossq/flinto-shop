function search(){

    if($("#search").val().length >= 3){
        $('#itemsCountSearch').hide();
        $.ajax({
            url: "/catalog/items/find",
            type: 'POST',
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({name: $("#search").val()}),
            success: function (data) {
                $('.searchResultBlock').html('');
                if(data.status === 'ok'){

                    var items = data.items;
                    $('#itemsCountSearchVal').text(items.length);

                    var el = $(".templateSearchItem").eq(0).clone();
                    el.removeClass('templateSearchItem');
                    var html = el[0].outerHTML;
                    console.log(html);
                    for(var i=0; i<items.length; i++){

                        var curHtml = html
                            .replace(/%preview%/g, items[i].preview)
                            .replace(/%category_alias%/g, items[i].category.alias)
                            .replace(/%item_alias%/g, items[i].alias)
                            .replace(/%name%/g, items[i].name);
                        $('.searchResultBlock').eq(0).append(curHtml);
                    }

                }else{
                    $('#itemsCountSearchVal').text(0);
                }

                $('#itemsCountSearch').fadeIn('fast');
            }
        });
    }

}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJzZWFyY2guanMiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gc2VhcmNoKCl7XG5cbiAgICBpZigkKFwiI3NlYXJjaFwiKS52YWwoKS5sZW5ndGggPj0gMyl7XG4gICAgICAgICQoJyNpdGVtc0NvdW50U2VhcmNoJykuaGlkZSgpO1xuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdXJsOiBcIi9jYXRhbG9nL2l0ZW1zL2ZpbmRcIixcbiAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgICAgIGRhdGFUeXBlOiBcImpzb25cIixcbiAgICAgICAgICAgIGNvbnRlbnRUeXBlOiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICAgICAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KHtuYW1lOiAkKFwiI3NlYXJjaFwiKS52YWwoKX0pLFxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAkKCcuc2VhcmNoUmVzdWx0QmxvY2snKS5odG1sKCcnKTtcbiAgICAgICAgICAgICAgICBpZihkYXRhLnN0YXR1cyA9PT0gJ29rJyl7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGl0ZW1zID0gZGF0YS5pdGVtcztcbiAgICAgICAgICAgICAgICAgICAgJCgnI2l0ZW1zQ291bnRTZWFyY2hWYWwnKS50ZXh0KGl0ZW1zLmxlbmd0aCk7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGVsID0gJChcIi50ZW1wbGF0ZVNlYXJjaEl0ZW1cIikuZXEoMCkuY2xvbmUoKTtcbiAgICAgICAgICAgICAgICAgICAgZWwucmVtb3ZlQ2xhc3MoJ3RlbXBsYXRlU2VhcmNoSXRlbScpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgaHRtbCA9IGVsWzBdLm91dGVySFRNTDtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coaHRtbCk7XG4gICAgICAgICAgICAgICAgICAgIGZvcih2YXIgaT0wOyBpPGl0ZW1zLmxlbmd0aDsgaSsrKXtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGN1ckh0bWwgPSBodG1sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLyVwcmV2aWV3JS9nLCBpdGVtc1tpXS5wcmV2aWV3KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8lY2F0ZWdvcnlfYWxpYXMlL2csIGl0ZW1zW2ldLmNhdGVnb3J5LmFsaWFzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8laXRlbV9hbGlhcyUvZywgaXRlbXNbaV0uYWxpYXMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLyVuYW1lJS9nLCBpdGVtc1tpXS5uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJy5zZWFyY2hSZXN1bHRCbG9jaycpLmVxKDApLmFwcGVuZChjdXJIdG1sKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgICQoJyNpdGVtc0NvdW50U2VhcmNoVmFsJykudGV4dCgwKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAkKCcjaXRlbXNDb3VudFNlYXJjaCcpLmZhZGVJbignZmFzdCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbn0iXSwiZmlsZSI6InNlYXJjaC5qcyJ9
