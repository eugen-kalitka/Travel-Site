//handlebars helpers
Handlebars.registerHelper('convertTime', function(ms) {
    return moment.unix(ms).format('HH:mm');
});
Handlebars.registerHelper('convertDegrees', function(deg) {
    var dirs = ['North', 'Northeast', 'East', 'Southeast', 'South', 'Southwest', 'West', 'Northwest'];
    var val = Math.round(deg/45);
    return dirs[(val % 8)];
});
Handlebars.registerHelper('roundTemperature', function(value) {
    return Math.round(value);
});

//main script
(function() {
    var widgetOuter = document.getElementById('widgetOuter'),
        widgetInner = document.getElementById('widgetInner'),
        widgetButton = document.getElementById('widgetButton'),
        refresh = document.getElementById('refresh'),
        widgetBody = document.getElementById('widgetBody'),
        submitGeo = document.getElementById('submitGeo'),
        closeMap = document.getElementById('closeMap'),
        lightbox = document.getElementById('lightbox'),
        findGeo = document.getElementById('findGeo'),
        weatherTemplate = document.getElementById('weatherTemplate');

    widgetOuter.style.display = 'block';

    var generateErrMessage = function() {
        var p = document.createElement('p');
        p.classList.add('widget-body__error');
        p.innerHTML = 'Sorry, we can\'t find the content you\'re looking.<br/> Please see the <a href="https://github.com/eugen-kalitka/Travel-Site/blob/master/README.md">README</a> file for details';
        widgetBody.appendChild(p);
    };

    var addEventHandler = function(element, event, func) {
        try {
            element.addEventListener(event, func, false)
        } catch(err) {
            element.attachEvent('on'+event, func);
        }
    };
    var removeEventHandler = function(element, event, func) {
        try {
            element.removeEventListener(event, func, false)
        } catch(err) {
            element.detachEvent('on'+event, func);
        }
    };

    var removeChildExcept = function(node, id) {
        while (node.lastChild.id != id) {
            node.removeChild(node.lastChild);
        }
    };

    var processServerResponse = function(data) {
        // clean before inserting template
        removeChildExcept(widgetBody, 'refresh');
        //inserting handlebars template
        var template = Handlebars.compile(weatherTemplate.innerHTML);
        $(widgetBody).append(template(data));
        // inserting time with moment.js library
        var curTime = moment().format("dddd, MMMM Do YYYY, HH:mm:ss");
        $('#widgetTime').text('Get at ' + curTime);
        refresh.classList.remove('loading');
    };

    var getWeather = function(address, dataToSend, success) {
        var promise = new RSVP.Promise(function(resolve, reject) {
            $.ajax({
                url: address,
                data: dataToSend,
                dataType: 'json',
                beforeSend: function() {
                    refresh.classList.add('loading');
                },
                error: function() {
                    setTimeout(function() {
                        removeChildExcept(widgetBody, 'refresh');
                        generateErrMessage();
                        refresh.classList.remove('loading');
                    }, 3000);
                },
                success: function(data) {
                    success(data);
                    resolve(data);
                }
            });
        })
            .then(function(result) {
                addEventHandler(document.querySelector('#coords'), 'click', function () {
                    $(lightbox).fadeIn('slow');
                    drawMap(result);
                });
            });
    };

    var refreshWeather = function() {
        getWeather('/weather', null, processServerResponse);
    };

    addEventHandler(refresh, 'click', refreshWeather);

    var drawMap = function(coordsObj) {
        var coordLat = coordsObj.coord.lat,
            coordLon = coordsObj.coord.lon,
            myLatlng = new google.maps.LatLng(coordLat, coordLon),
            myOptions = {
                zoom: 8,
                center: myLatlng
            },
            map = new google.maps.Map(document.getElementById("map-canvas"), myOptions),
            marker = new google.maps.Marker({
                position: myLatlng,
                map: map
            }),
            geocoder = new google.maps.Geocoder();

        google.maps.event.trigger(map, 'resize');

        function detectLocation() {
            var promise = new RSVP.Promise(function(resolve, reject) {

                var address = document.getElementById('address').value;
                geocoder.geocode( { 'address': address}, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        map.setCenter(results[0].geometry.location);

                        //remove marker before adding new
                        marker.setMap(null);

                        marker = new google.maps.Marker({
                            map: map,
                            position: results[0].geometry.location
                        });
                        var targetLat = results[0].geometry.location.A,
                            targetLon = results[0].geometry.location.F;

                        targetLat = parseFloat(targetLat.toFixed(6));
                        targetLon = parseFloat(targetLon.toFixed(6));
                        var targetCoords = {
                            lat: targetLat,
                            lon: targetLon
                        };
                        resolve(targetCoords);
                    } else {
                        alert('Geocode was not successful for the following reason: ' + status);
                    }
                });

            });
            promise.then(function(coordinates){
                $(submitGeo).off('click').on('click', function () {
                    getWeather('/weather/target', coordinates, processServerResponse);
                    $(lightbox).fadeOut('slow');
                });
                removeEventHandler(refresh, 'click', refreshWeather);
                $(refresh).off('click').on('click', function() {
                    getWeather('/weather/target', coordinates, processServerResponse);
                });
            });


        }

        addEventHandler(closeMap, 'click', function() {
            $(lightbox).fadeOut('slow');
        });
        addEventHandler(findGeo, 'click', function() {
            detectLocation();
        });
    };

    var flag = 1;
    addEventHandler(widgetButton, 'click', function() {
        widgetInner.classList.toggle('active');

        if(flag && widgetInner.classList.contains('active')) {
            setTimeout(function(){
                getWeather('/weather', null, processServerResponse);
            }, 300);
            flag = false;
        }
    });
})();