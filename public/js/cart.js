
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjYXJ0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIlxudmFyIGNsZWFyQ2FydEFsZXJ0SWQgPSAwO1xudmFyIHRheGVzUHJpY2UgPSAxO1xudmFyIHNoaXBwaW5nUHJpY2UgPSAyO1xuXG5mdW5jdGlvbiB1cENvdW50KCl7XG4gICAgdmFyIGN1clZhbCA9ICskKCcjaXRlbXNDb3VudCcpLnRleHQoKTtcbiAgICAkKCcjaXRlbXNDb3VudCcpLnRleHQoY3VyVmFsICsgMSk7XG59XG5cbmZ1bmN0aW9uIGRvd25Db3VudCgpe1xuICAgIHZhciBjdXJWYWwgPSArJCgnI2l0ZW1zQ291bnQnKS50ZXh0KCk7XG4gICAgaWYoY3VyVmFsID4gMSl7XG4gICAgICAgICQoJyNpdGVtc0NvdW50JykudGV4dChjdXJWYWwgLSAxKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGFkZDJDYXJ0RGV0YWlscyhhbGlhcywgbmFtZSl7XG4gICAgdmFyIGN1clZhbCA9ICskKCcjaXRlbXNDb3VudCcpLnRleHQoKTtcbiAgICBhZGQyQ2FydChhbGlhcywgbmFtZSwgY3VyVmFsKTtcbn1cblxuZnVuY3Rpb24gYWRkMkNhcnQoYWxpYXMsIG5hbWUsIGNvdW50KXtcblxuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgY2xlYXJUaW1lb3V0KGNsZWFyQ2FydEFsZXJ0SWQpO1xuICAgICQoJyNjdXJDYXJ0QWxlcnQnKS5yZW1vdmUoKTtcblxuICAgICQuYWpheCh7XG4gICAgICAgIHVybDogXCIvY2FydC9hZGRcIixcbiAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICBkYXRhVHlwZTogXCJqc29uXCIsXG4gICAgICAgIGNvbnRlbnRUeXBlOiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkoe2FsaWFzOiBhbGlhcywgY291bnQ6IGNvdW50fSksXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAgICAgICAgIGlmKGRhdGEuc3RhdHVzID09PSAnb2snKXtcbiAgICAgICAgICAgICAgICAkKCcjY2FydFNpemUnKS50ZXh0KGRhdGEuc2l6ZSk7XG4gICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSBkYXRhLml0ZW07XG4gICAgICAgICAgICAgICAgdmFyIGVsID0gJChcIi50ZW1wbGF0ZUFsZXJ0Q2FydFwiKS5lcSgwKS5jbG9uZSgpO1xuICAgICAgICAgICAgICAgIGVsLnJlbW92ZUNsYXNzKCd0ZW1wbGF0ZUFsZXJ0Q2FydCcpO1xuICAgICAgICAgICAgICAgIGVsLmF0dHIoJ2lkJywgXCJjdXJDYXJ0QWxlcnRcIik7XG4gICAgICAgICAgICAgICAgdmFyIGh0bWwgPSBlbFswXS5vdXRlckhUTUw7XG5cbiAgICAgICAgICAgICAgICBodG1sID0gaHRtbFxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvJWNhdGVnb3J5X2FsaWFzJS9nLCBpdGVtLmNhdGVnb3J5LmFsaWFzKVxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvJWl0ZW1fYWxpYXMlL2csIGl0ZW0uYWxpYXMpXG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8lbmFtZSUvZywgaXRlbS5uYW1lKTtcblxuICAgICAgICAgICAgICAgICQoJ2JvZHknKS5hcHBlbmQoaHRtbCk7XG5cbiAgICAgICAgICAgICAgICBjbGVhckNhcnRBbGVydElkID0gc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAkKCcjY3VyQ2FydEFsZXJ0JykucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgfSwgMzAwMCk7XG5cblxuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgYWxlcnQoXCJTb21lIGVycm9yIHdoaWxlIGFkZGluZyB0aGUgcHJvZHVjdFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5mdW5jdGlvbiB1cEl0ZW1DYXJ0KGVsLCBhbGlhcyl7XG5cbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cbiAgICAkLmFqYXgoe1xuICAgICAgICB1cmw6IFwiL2NhcnQvYWRkXCIsXG4gICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgZGF0YVR5cGU6IFwianNvblwiLFxuICAgICAgICBjb250ZW50VHlwZTogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KHthbGlhczogYWxpYXMsIGNvdW50OiAxfSksXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICB2YXIgaXRlbSA9IGRhdGEuaXRlbTtcbiAgICAgICAgICAgIGlmKGRhdGEuc3RhdHVzID09PSAnb2snKXtcbiAgICAgICAgICAgICAgICAkKCcjY2FydFNpemUnKS50ZXh0KGRhdGEuc2l6ZSk7XG5cbiAgICAgICAgICAgICAgICAkKGVsKS5wYXJlbnQoKS5maW5kKCcuaXRlbXNDb3VudCcpLnRleHQoaXRlbS5jb3VudCk7XG4gICAgICAgICAgICAgICAgcHJpY2VzQWZmZWN0KGl0ZW0ucHJpY2UsIDEsIGl0ZW0uYWxpYXMpO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgYWxlcnQoXCJTb21lIGVycm9yIHdoaWxlIGFkZGluZyB0aGUgcHJvZHVjdFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBkb3duSXRlbUNhcnQoZWwsIGFsaWFzLCBhbGwpe1xuXG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXG4gICAgJC5hamF4KHtcbiAgICAgICAgdXJsOiBcIi9jYXJ0L3JlbW92ZVwiLFxuICAgICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICAgIGRhdGFUeXBlOiBcImpzb25cIixcbiAgICAgICAgY29udGVudFR5cGU6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeSh7YWxpYXM6IGFsaWFzLCBjb3VudDogMSwgYWxsOiBhbGx9KSxcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAgICAgaWYoZGF0YS5zdGF0dXMgPT09ICdvaycpe1xuICAgICAgICAgICAgICAgICQoJyNjYXJ0U2l6ZScpLnRleHQoZGF0YS5zaXplKTtcbiAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IGRhdGEuaXRlbTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygtKCtpdGVtLnByaWNlKSk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coaXRlbS5wcmljZSk7XG4gICAgICAgICAgICAgICAgaWYoYWxsKXtcbiAgICAgICAgICAgICAgICAgICAgcHJpY2VzQWZmZWN0KC0oK2l0ZW0ucHJpY2UpLCArJChlbCkucGFyZW50cygnLmNhcnQtaXRlbScpLmxhc3QoKS5maW5kKCcuaXRlbXNDb3VudCcpLnRleHQoKSk7XG4gICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgIHByaWNlc0FmZmVjdCgtKCtpdGVtLnByaWNlKSwgMSwgaXRlbS5hbGlhcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmKCFhbGwgJiYgaXRlbS5jb3VudCA+IDApe1xuICAgICAgICAgICAgICAgICAgICAkKGVsKS5wYXJlbnQoKS5maW5kKCcuaXRlbXNDb3VudCcpLnRleHQoaXRlbS5jb3VudCk7XG4gICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgdmFyIHBhcmVudCA9ICAkKGVsKS5wYXJlbnRzKCcuY2FydC1pdGVtJykubGFzdCgpO1xuICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHBhcmVudFswXSk7XG4gICAgICAgICAgICAgICAgICAgcGFyZW50Lmh0bWwoJycpO1xuICAgICAgICAgICAgICAgICAgIHBhcmVudC5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBhbGVydChcIlNvbWUgZXJyb3Igd2hpbGUgYWRkaW5nIHRoZSBwcm9kdWN0XCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIHByaWNlc0FmZmVjdChwcmljZSwgY291bnQsIGFsaWFzKXtcbiAgICBsZXQgc3VtbWFyeSA9IE1hdGguYWJzKHByaWNlICogY291bnQpO1xuICAgIGNvbnNvbGUubG9nKHN1bW1hcnkgKyBcIiBcIiArIGNvdW50KTtcbiAgICB2YXIgYWRkID0gcHJpY2UgPiAwO1xuXG4gICAgYWZmZWN0RmllbGQoJyNzaXplJywgY291bnQsIGFkZCk7XG4gICAgYWZmZWN0RmllbGQoJyN0YXhlcycsIGNvdW50ICogdGF4ZXNQcmljZSwgYWRkKTtcbiAgICBhZmZlY3RGaWVsZCgnI3N1bW1hcnknLCBjb3VudCAqIHRheGVzUHJpY2UsIGFkZCk7XG4gICAgYWZmZWN0RmllbGQoJyNzaGlwcGluZycsIGNvdW50ICogc2hpcHBpbmdQcmljZSwgYWRkKTtcbiAgICBhZmZlY3RGaWVsZCgnI3N1bW1hcnknLCBjb3VudCAqIHNoaXBwaW5nUHJpY2UsIGFkZCk7XG4gICAgYWZmZWN0RmllbGQoJyN0b3RhbFByaWNlJywgc3VtbWFyeSwgYWRkKTtcbiAgICBhZmZlY3RGaWVsZCgnI3N1bW1hcnknLCBzdW1tYXJ5LCBhZGQpO1xuXG4gICAgaWYoYWxpYXMpe1xuICAgICAgICBhZmZlY3RGaWVsZCgnI3N1YnRvdGFsXycrYWxpYXMsIHN1bW1hcnksIGFkZCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBhZmZlY3RGaWVsZChzZWxlY3RvciwgdmFsdWUsIGFkZCl7XG4gICAgY29uc29sZS5sb2coc2VsZWN0b3IpO1xuICAgIHZhciBmaWVsZCA9IHBhcnNlSW50KCQoc2VsZWN0b3IpLnRleHQoKSk7XG4gICAgY29uc29sZS5sb2coZmllbGQpO1xuICAgIHZhciBjaGFuZ2VzID0gYWRkID8gZmllbGQgKyB2YWx1ZSA6IGZpZWxkIC0gdmFsdWU7XG4gICAgY29uc29sZS5sb2coY2hhbmdlcyk7XG4gICAgJChzZWxlY3RvcikudGV4dChjaGFuZ2VzKTtcbiAgICBjb25zb2xlLmxvZygnLS0tLS0tLS0tLS0tLScpO1xufVxuXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICQuYWpheCh7XG4gICAgICAgIHVybDogXCIvY2FydC9zaXplXCIsXG4gICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgZGF0YVR5cGU6IFwianNvblwiLFxuICAgICAgICBjb250ZW50VHlwZTogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICBpZihkYXRhLnN0YXR1cyA9PT0gJ29rJyl7XG4gICAgICAgICAgICAgICAgJCgnI2NhcnRTaXplJykudGV4dChkYXRhLnNpemUpO1xuXG4gICAgICAgICAgICB9ZWxzZXtcblxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG59KTsiXSwiZmlsZSI6ImNhcnQuanMifQ==
