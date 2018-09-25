
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


//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJhZG1pbl9lZGl0X2l0ZW0uanMiXSwic291cmNlc0NvbnRlbnQiOlsiXG5mdW5jdGlvbiByZWFkVXJsKGlucHV0KSB7XG5cbiAgICBpZiAoaW5wdXQuZmlsZXMgJiYgaW5wdXQuZmlsZXNbMF0pIHtcbiAgICAgICAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG4gICAgICAgIHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICB2YXIgaW1nRGF0YSA9IGUudGFyZ2V0LnJlc3VsdDtcbiAgICAgICAgICAgIHZhciBpbWdOYW1lID0gaW5wdXQuZmlsZXNbMF0ubmFtZTtcbiAgICAgICAgICAgIGlucHV0LnNldEF0dHJpYnV0ZShcImRhdGEtdGl0bGVcIiwgaW1nTmFtZSk7XG4gICAgICAgICAgICB2YXIgYmxvYiA9IGRhdGFVUkl0b0Jsb2IoaW1nRGF0YSk7XG4gICAgICAgICAgICB2YXIgZmQgPSBuZXcgRm9ybURhdGEoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJyN1cGxvYWRGb3JtJykpO1xuICAgICAgICAgICAgZmQuYXBwZW5kKFwicGhvdG9cIiwgYmxvYik7XG5cbiAgICAgICAgICAgIHVwbG9hZChmZCk7XG5cbiAgICAgICAgfTtcbiAgICAgICAgcmVhZGVyLnJlYWRBc0RhdGFVUkwoaW5wdXQuZmlsZXNbMF0pO1xuICAgIH1cblxufVxuXG5mdW5jdGlvbiByZW1vdmVJbWFnZShlbCwgaWQsIHNyYywgZm9sZGVyKXtcblxuICAgICQuYWpheCh7XG4gICAgICAgIHVybDogYmFzZVVybCtcIi9cIitpZCtcIi9pbWFnZXMvcmVtb3ZlXCIsXG4gICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgZGF0YVR5cGU6IFwianNvblwiLFxuICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeSh7bmFtZTogc3JjLnNwbGl0KCcvJykucG9wKCksIGZvbGRlcjogZm9sZGVyfSksXG4gICAgICAgIGNvbnRlbnRUeXBlOiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgIGlmKGRhdGEucmVzdWx0ID09PSAnb2snKXtcbiAgICAgICAgICAgICAgICAkKGVsKS5wYXJlbnQoKS5yZW1vdmUoKTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIGFsZXJ0KCdzb21lIGVycm9yIHdoaWxlIHJlbW92aW5nJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuICAgIH0pO1xuXG59XG5cbmZ1bmN0aW9uIHVwbG9hZChmb3JtRGF0YSl7XG5cbiAgICAkLmFqYXgoe1xuICAgICAgICB1cmw6IGJhc2VVcmwrXCIvdXBsb2FkXCIsXG4gICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgZGF0YTogZm9ybURhdGEsXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgICAgIGlmKGRhdGEucmVzdWx0ID09PSAnb2snKXtcbiAgICAgICAgICAgICAgICB2YXIgZWwgPSAkKFwiLnRlbXBsYXRlSW1hZ2VCbG9ja1wiKS5lcSgwKS5jbG9uZSgpO1xuICAgICAgICAgICAgICAgIGVsLnJlbW92ZUNsYXNzKCd0ZW1wbGF0ZUltYWdlQmxvY2snKTtcbiAgICAgICAgICAgICAgICB2YXIgaHRtbCA9IGVsWzBdLm91dGVySFRNTDtcbiAgICAgICAgICAgICAgICBodG1sID0gaHRtbC5yZXBsYWNlKC8lc3JjJS9nLCBkYXRhLnNyYyk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coaHRtbCk7XG4gICAgICAgICAgICAgICAgJCgnLmltYWdlcy1ibG9jaycpLmVxKDApLmFwcGVuZChodG1sKTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIGFsZXJ0KCdzb21lIGVycm9yIHdoaWxlIHVwbG9hZGluZycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBjYWNoZTogZmFsc2UsXG4gICAgICAgIGNvbnRlbnRUeXBlOiBmYWxzZSxcbiAgICAgICAgcHJvY2Vzc0RhdGE6IGZhbHNlXG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGRhdGFVUkl0b0Jsb2IoZGF0YVVSSSkge1xuICAgIHZhciBiaW5hcnkgPSBhdG9iKGRhdGFVUkkuc3BsaXQoJywnKVsxXSk7XG4gICAgdmFyIGFycmF5ID0gW107XG4gICAgZm9yKHZhciBpID0gMDsgaSA8IGJpbmFyeS5sZW5ndGg7IGkrKykge1xuICAgICAgICBhcnJheS5wdXNoKGJpbmFyeS5jaGFyQ29kZUF0KGkpKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBCbG9iKFtuZXcgVWludDhBcnJheShhcnJheSldLCB7dHlwZTogJ2ltYWdlL2pwZWcnfSk7XG59XG5cbiJdLCJmaWxlIjoiYWRtaW5fZWRpdF9pdGVtLmpzIn0=
