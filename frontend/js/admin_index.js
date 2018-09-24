function clearTmp(){
    $.ajax({
        url: baseUrl+"/clear_tmp",
        type: 'POST',
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
            if(data.result === 'ok'){
                $(".tmpInfo").fadeOut('fast');
                $(".tmpCleared").fadeIn('fast');
            }else{
                alert('some error');
            }

        }
    });
}