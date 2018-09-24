
var clearCartAlertId = 0;
var taxesPrice = 1;
var shippingPrice = 2;

function upCount(){
    var curVal = +$('#itemsCount').text();
    $('#itemsCount').text(curVal + 1);
}

function downCount(){
    var curVal = +$('#itemsCount').text();
    if(curVal > 1){
        $('#itemsCount').text(curVal - 1);
    }
}

function add2CartDetails(alias, name){
    var curVal = +$('#itemsCount').text();
    add2Cart(alias, name, curVal);
}

function add2Cart(alias, name, count){

    event.stopPropagation();
    event.preventDefault();
    clearTimeout(clearCartAlertId);
    $('#curCartAlert').remove();

    $.ajax({
        url: "/cart/add",
        type: 'POST',
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({alias: alias, count: count}),
        success: function (data) {

            if(data.status === 'ok'){
                $('#cartSize').text(data.size);
                var item = data.item;
                var el = $(".templateAlertCart").eq(0).clone();
                el.removeClass('templateAlertCart');
                el.attr('id', "curCartAlert");
                var html = el[0].outerHTML;

                html = html
                    .replace(/%category_alias%/g, item.category.alias)
                    .replace(/%item_alias%/g, item.alias)
                    .replace(/%name%/g, item.name);

                $('body').append(html);

                clearCartAlertId = setTimeout(function(){
                    $('#curCartAlert').remove();
                }, 3000);


            }else{
                alert("Some error while adding the product");
            }
        }
    });
}

function upItemCart(el, alias){

    event.stopPropagation();
    event.preventDefault();


    $.ajax({
        url: "/cart/add",
        type: 'POST',
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({alias: alias, count: 1}),
        success: function (data) {
            var item = data.item;
            if(data.status === 'ok'){
                $('#cartSize').text(data.size);

                $(el).parent().find('.itemsCount').text(item.count);
                pricesAffect(item.price, 1, item.alias);
            }else{
                alert("Some error while adding the product");
            }
        }
    });
}

function downItemCart(el, alias, all){

    event.stopPropagation();
    event.preventDefault();


    $.ajax({
        url: "/cart/remove",
        type: 'POST',
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({alias: alias, count: 1, all: all}),
        success: function (data) {

            if(data.status === 'ok'){
                $('#cartSize').text(data.size);
                var item = data.item;
                console.log(-(+item.price));
                console.log(item.price);
                if(all){
                    pricesAffect(-(+item.price), +$(el).parents('.cart-item').last().find('.itemsCount').text());
                }else{
                    pricesAffect(-(+item.price), 1, item.alias);
                }
                if(!all && item.count > 0){
                    $(el).parent().find('.itemsCount').text(item.count);
                }else{
                   var parent =  $(el).parents('.cart-item').last();
                   console.log(parent[0]);
                   parent.html('');
                   parent.remove();
                }
            }else{
                alert("Some error while adding the product");
            }
        }
    });
}

function pricesAffect(price, count, alias){
    let summary = Math.abs(price * count);
    console.log(summary + " " + count);
    var add = price > 0;

    affectField('#size', count, add);
    affectField('#taxes', count * taxesPrice, add);
    affectField('#summary', count * taxesPrice, add);
    affectField('#shipping', count * shippingPrice, add);
    affectField('#summary', count * shippingPrice, add);
    affectField('#totalPrice', summary, add);
    affectField('#summary', summary, add);

    if(alias){
        affectField('#subtotal_'+alias, summary, add);
    }
}

function affectField(selector, value, add){
    console.log(selector);
    var field = parseInt($(selector).text());
    console.log(field);
    var changes = add ? field + value : field - value;
    console.log(changes);
    $(selector).text(changes);
    console.log('-------------');
}

$(document).ready(function(){
    $.ajax({
        url: "/cart/size",
        type: 'POST',
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
            if(data.status === 'ok'){
                $('#cartSize').text(data.size);

            }else{

            }
        }
    });
});