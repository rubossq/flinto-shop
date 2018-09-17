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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJhZG1pbl9lZGl0X2l0ZW0uanMiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gcmVhZFVybChpbnB1dCkge1xuXG4gICAgaWYgKGlucHV0LmZpbGVzICYmIGlucHV0LmZpbGVzWzBdKSB7XG4gICAgICAgIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgICAgICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgdmFyIGltZ0RhdGEgPSBlLnRhcmdldC5yZXN1bHQ7XG4gICAgICAgICAgICB2YXIgaW1nTmFtZSA9IGlucHV0LmZpbGVzWzBdLm5hbWU7XG4gICAgICAgICAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoXCJkYXRhLXRpdGxlXCIsIGltZ05hbWUpO1xuICAgICAgICAgICAgdmFyIGJsb2IgPSBkYXRhVVJJdG9CbG9iKGltZ0RhdGEpO1xuICAgICAgICAgICAgdmFyIGZkID0gbmV3IEZvcm1EYXRhKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCcjdXBsb2FkRm9ybScpKTtcbiAgICAgICAgICAgIGZkLmFwcGVuZChcImlucHV0SW1hZ2VcIiwgYmxvYik7XG5cblxuICAgICAgICB9O1xuICAgICAgICByZWFkZXIucmVhZEFzRGF0YVVSTChpbnB1dC5maWxlc1swXSk7XG4gICAgfVxuXG59XG5cbmZ1bmN0aW9uIHVwbG9hZChmb3JtRGF0YSl7XG5cbiAgICAkLmFqYXgoe1xuICAgICAgICB1cmw6IFwiL2FwL3VwbG9hZFwiLFxuICAgICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICAgIGRhdGE6IGZvcm1EYXRhLFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgaWYoZGF0YS5vayA9PT0gJ3llcycpe1xuICAgICAgICAgICAgICAgICQoXCIjc3VjY2Vzc0FsZXJ0XCIpLmZhZGVJbignZmFzdCcpO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgJChcIiNlcnJvckFsZXJ0XCIpLmZhZGVJbignZmFzdCcpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgJChcIiNzdWNjZXNzQWxlcnRcIikuZmFkZU91dCgnZmFzdCcpO1xuICAgICAgICAgICAgICAgICQoXCIjZXJyb3JBbGVydFwiKS5mYWRlT3V0KCdmYXN0Jyk7XG4gICAgICAgICAgICB9LCAxNTAwKTtcblxuICAgICAgICB9LFxuICAgICAgICBjYWNoZTogZmFsc2UsXG4gICAgICAgIGNvbnRlbnRUeXBlOiBmYWxzZSxcbiAgICAgICAgcHJvY2Vzc0RhdGE6IGZhbHNlXG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGRhdGFVUkl0b0Jsb2IoZGF0YVVSSSkge1xuICAgIHZhciBiaW5hcnkgPSBhdG9iKGRhdGFVUkkuc3BsaXQoJywnKVsxXSk7XG4gICAgdmFyIGFycmF5ID0gW107XG4gICAgZm9yKHZhciBpID0gMDsgaSA8IGJpbmFyeS5sZW5ndGg7IGkrKykge1xuICAgICAgICBhcnJheS5wdXNoKGJpbmFyeS5jaGFyQ29kZUF0KGkpKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBCbG9iKFtuZXcgVWludDhBcnJheShhcnJheSldLCB7dHlwZTogJ2ltYWdlL2pwZWcnfSk7XG59Il0sImZpbGUiOiJhZG1pbl9lZGl0X2l0ZW0uanMifQ==
