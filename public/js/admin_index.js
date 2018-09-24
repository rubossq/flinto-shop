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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJhZG1pbl9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBjbGVhclRtcCgpe1xuICAgICQuYWpheCh7XG4gICAgICAgIHVybDogYmFzZVVybCtcIi9jbGVhcl90bXBcIixcbiAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICBkYXRhVHlwZTogXCJqc29uXCIsXG4gICAgICAgIGNvbnRlbnRUeXBlOiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgIGlmKGRhdGEucmVzdWx0ID09PSAnb2snKXtcbiAgICAgICAgICAgICAgICAkKFwiLnRtcEluZm9cIikuZmFkZU91dCgnZmFzdCcpO1xuICAgICAgICAgICAgICAgICQoXCIudG1wQ2xlYXJlZFwiKS5mYWRlSW4oJ2Zhc3QnKTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIGFsZXJ0KCdzb21lIGVycm9yJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuICAgIH0pO1xufSJdLCJmaWxlIjoiYWRtaW5faW5kZXguanMifQ==
