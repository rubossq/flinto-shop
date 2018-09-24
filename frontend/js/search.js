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