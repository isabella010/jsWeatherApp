var listData;
var sunData;

$(document).ready(function(){
    $('#submitCity').click(function(){
        var city = $("#city").val();
        if(city != ''){
            $.ajax({
                url: "https://api.openweathermap.org/data/2.5/find?callback?&q=" + city + "&units=metric" + "&appid=97eaa9d3202c18880ca8bdc602e4905d",
                type: "GET",
                dataType: "jsonp",
                async: false,
                success: function (data){
                    $("#results").html('');
                    $("#error").html('');
                    
                    listData = data;
                    moreData();
                },
                error: function () {
                    $("#results").html('');
                    $("#error").html('Data not found');
                }
            });
        } else {
            $("#results").html('');
            $("#error").html('Search box can\'t be null');
        }
    });
});

function displayHtml(returnedData, j){
    $("#results").html(returnedData);
    $("#city").val('');
    $('#nav').remove(); // Remove previous pagination container if it exists
    $('#results').after('<div id="nav"></div>'); 

    var pages = Math.ceil(j / 3);  // Use Math.ceil to ensure pages are counted correctly

    if(pages > 1) {  // Only create pagination if there are more than one page
        $('#results tbody tr').hide();  
        $('#results tbody tr').slice(0, 3).show();

        for (var i = 0; i < pages; i++) {  
            $('#nav').append('<a href="#" rel="' + i + '">' + (i + 1) + '</a> ');  
        }
        
        $('#nav a:first').addClass('active');  
        $('#nav a').bind('click', function() {  
            $('#nav a').removeClass('active');  
            $(this).addClass('active');

            var current = $(this).attr('rel');  
            var first = current * 3;  
            var last = first + 3;  

            $('#results tr').css('opacity','0.0').hide().slice(first, last).css('display','table-row').animate({opacity:1}, 300);  
        });
    }
}

function moreData(){
    var widget = '';
    
    for (let i = 0; i < listData.list.length; i++) {
        $.ajax({ 
            url: "https://api.openweathermap.org/data/2.5/weather?id=" + listData.list[i].id + "&units=metric" + "&appid=97eaa9d3202c18880ca8bdc602e4905d",
            type: "GET",
            dataType: "jsonp",
            async: false,
            success: function(info){ 
                widget += display(info, i);
                displayHtml(widget, listData.list.length);
            } 
        });
    }
}

function display(sunData, i){
    let rdate = new Date(sunData.sys.sunrise * 1000);
    var rise = rdate.toLocaleTimeString();
    let sdate = new Date(sunData.sys.sunset * 1000);
    var set = sdate.toLocaleTimeString();

    return "<table class='table'>" +
        "<tr>" +
            "<td class='tdOne'>" +
                "<img src='https://openweathermap.org/img/wn/" + listData.list[i].weather[0].icon + "@2x.png' />" +
            "</td>" +
            "<td class='tdTwo'>" +
                "<p><b>" + listData.list[i].name + ", " + listData.list[i].sys.country + " " + 
                "<img src='https://openweathermap.org/images/flags/" + listData.list[i].sys.country.toLowerCase() + ".png' />" + 
                " <i>" + listData.list[i].weather[0].description + "</i></b></p>" +
                "<p><span class='badge badge-info'>" + listData.list[i].main.temp + "°С</span>" + 
                " temperature from " + listData.list[i].main.temp_min + " to " + listData.list[i].main.temp_max + " °С," + 
                " wind " + listData.list[i].wind.speed + " m/s. clouds " + listData.list[i].clouds.all + " %, " + 
                listData.list[i].main.pressure + " hpa</p>" +
                "<p>humidity " + listData.list[i].main.humidity + " %, sunrise " + rise + ", sunset " + set + "</p>" +
                "<p> Geo coords [" + listData.list[i].coord.lat + ", " + listData.list[i].coord.lon + "]</p>" +
            "</td>" +
        "</tr>" +
    "</table>";
}
