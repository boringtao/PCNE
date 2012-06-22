$(document).ready(
	function(){
    var postcardTemplate = '<div class="postcard"><blockquote class="contents">' +
        '{{ text }}</blockquote><aside>{{ place }}</aside></div>';

    function postcardMarkup(text, place) {
        return Mustache.to_html(postcardTemplate, {
            text: text, place: place
        });
    }

    function appendNewPostcard(text, place) {
        $('#postcards-posted').append(postcardMarkup(text, place));
        bindLongTouchListener();
    }
    
    var content = 'This is a sample postcard, that I have written from sunny Vancouver.',
    location = 'Vancouver, B.C.',
    longTouch = {
        element: null,
        since: null
    },
    touchHandlers = {
        start: function (e) {
            var now = +(new Date());
            longTouch.element = e.target;
            longTouch.since = now;
        },
        end: function (e) {
            var now = +(new Date()), duration;
            if (longTouch.element == e.target) {
                duration = now - longTouch.since;
                if (duration > 500) longTouchHandler(e.target);
                longTouch = {};
            }
        }
    };
    

    appendNewPostcard(content, location);

    $('#newPostcard').live('submit', function () {
      handleNewPostcard();
      return false;
    });
        
    function handleNewPostcard() {
        var postcardBox = $('textarea#postcardContents')[0],
            content = postcardBox.value;

        postcardBox.blur();
        navigator.geolocation.getCurrentPosition(function (resultsObj) {
            var latlng = positionToLatLongString(resultsObj);
            appendNewPostcard(content, latlng);            
        }, function () {
            appendNewPostcard(content, 'Terra Incognita');
        });
        postcardBox.value = '';
    }
    
    function positionToLatLongString(pos) {
        return pos.coords.latitude + ',' + pos.coords.longitude;
    }

  	  
    function longTouchHandler(ele) {
       navigator.camera.getPicture(function (img) {          
        alert(img);
        try {
            x$('#postcardImage').attr('src','data:image/png;base64,' + img);
         } catch(e) {
             alert(e);
         }
       }, function (e) {
           alert('camera failure!');
       }, {
           quality: 30,
           sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
           destinationType: navigator.camera.DestinationType.DATA_URL
       });
    }    
    
    function bindLongTouchListener() {
       $('div.postcard:first-child').on('touchstart', touchHandlers.start).on('touchend',   touchHandlers.end);
    }

    function saveImage(data) {
        window.localStorage.setItem('andrews.drink', data);
        return true;
    }

    function loadImage() {
        return window.localStorage.getItem('andrews.drink');
    }

    
    
	}
);