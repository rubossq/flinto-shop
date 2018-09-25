
function readUrl(input) {

    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var imgData = e.target.result;
            var imgName = input.files[0].name;
            input.setAttribute("data-title", imgName);
            var blob = dataURItoBlob(imgData);
            var fd = new FormData(document.getElementById('#uploadForm'));
            fd.append("photo", blob);

            upload(fd);

        };
        reader.readAsDataURL(input.files[0]);
    }

}

function removeImage(el, id, src, folder){

    $.ajax({
        url: baseUrl+"/"+id+"/images/remove",
        type: 'POST',
        dataType: "json",
        data: JSON.stringify({name: src.split('/').pop(), folder: folder}),
        contentType: "application/json",
        success: function (data) {
            if(data.result === 'ok'){
                $(el).parent().remove();
            }else{
                alert('some error while removing');
            }

        }
    });

}

function upload(formData){

    $.ajax({
        url: baseUrl+"/upload",
        type: 'POST',
        data: formData,
        success: function (data) {
            console.log(data);
            if(data.result === 'ok'){
                var el = $(".templateImageBlock").eq(0).clone();
                el.removeClass('templateImageBlock');
                var html = el[0].outerHTML;
                html = html.replace(/%src%/g, data.src);
                console.log(html);
                $('.images-block').eq(0).append(html);
            }else{
                alert('some error while uploading');
            }
        },
        cache: false,
        contentType: false,
        processData: false
    });
}

function dataURItoBlob(dataURI) {
    var binary = atob(dataURI.split(',')[1]);
    var array = [];
    for(var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
}

