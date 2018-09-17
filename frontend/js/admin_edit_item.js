function readUrl(input) {

    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var imgData = e.target.result;
            var imgName = input.files[0].name;
            input.setAttribute("data-title", imgName);
            var blob = dataURItoBlob(imgData);
            var fd = new FormData(document.getElementById('#uploadForm'));
            fd.append("inputImage", blob);


        };
        reader.readAsDataURL(input.files[0]);
    }

}

function upload(formData){

    $.ajax({
        url: "/ap/upload",
        type: 'POST',
        data: formData,
        success: function (data) {
            if(data.ok === 'yes'){
                $("#successAlert").fadeIn('fast');
            }else{
                $("#errorAlert").fadeIn('fast');
            }

            setTimeout(function(){
                $("#successAlert").fadeOut('fast');
                $("#errorAlert").fadeOut('fast');
            }, 1500);

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