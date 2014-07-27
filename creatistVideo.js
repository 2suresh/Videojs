/**/
var CreatistVideo = function(options) {
	var seekStart = 0;
    var seekEnd = 0;
	var defaults = {
		elementId : null,
		videoUrl : null,
		poster : "oceans-clip.png",
	    cbPlay : null,
	    cbPause : null,
	    cbSeeking : null,
	    tags : [], // [<list of timestamp>]
	    activityText : [],
	    cbTag : null
	};

	var options = $.extend({}, defaults, options);

	// storage
	var _error = null;
	var _data = null;
	this.getLastError = function() {
		var tempError = _error;
		_error = null;
		return tempError;
	}
	this.getLastData = function() {
		var tempData = _data;
		_data = null;
		return tempData;
	}
	// END storage

	this.init = function() {
		if(options.videoUrl == null) {
			_error = "Video URL is missing";
			return false;
		}
		if(typeof options.activityText == 'undefined') {
			_error = "Activity text is missing";
			return false;
		}
		if(typeof options.tags == 'undefined') {
			_error = "Activity tags are missing";
			return false;
		}

		if(options.elementId == null) {
			options.elementId = new Date().getTime();
			var element = $('<div id="'+options.elementId+'"></div>').appendTo('body');
		}
		// console.log(element);

		var myPlayer = videojs(options.elementId);
		// mark the progress bar when tags reach the current time
		myPlayer.markers({
            setting: {
                markerTip: {
                    default_text: "This is a break"
                },
                breakOverlay: {
                    display: true,
                    display_time: 3,
                    default_text: "This is an break overlay "
                }
            },
            //set break time
            marker_breaks: options.tags,

            marker_text: options.activityText
        });
        // validate text length with tags length
		if(options.activityText.length != options.tags.length) {
			_error = "Activity text and tags are not equal";
			return false;
		}
        // END mark

		poster = options.poster;// videoSrc.replace(/.mp4/, '.jpg');
		myPlayer.posterImage.show();
		myPlayer.src({type: "video/webm", src: options.videoUrl});
		myPlayer.one('canplay', function() {
			$('video').attr('poster', poster);
			myPlayer.play();
		});
		// show the poster if the video reaches end
		myPlayer.on('ended', function() {
			myPlayer.posterImage.show();
		});
		// console log if the inbuild play button clicked
		myPlayer.on('play', function(event){
			options.cbPlay(event);
		});
		// console log if the inbuild pause button clicked
		myPlayer.on('pause', function(event){
			options.cbPause(event);
		});
		// console log if the user rewind/ fast forward
		myPlayer.on('timeupdate', function(event) {
			var whereYouAt = Math.round(myPlayer.currentTime());
            var howLongIsThis = Math.round(myPlayer.duration());
            var percentThis = Math.round(whereYouAt / howLongIsThis * 100);
            seekStart = seekEnd;
            seekEnd = whereYouAt;
            if (Math.abs(seekStart - seekEnd) > 1) {
                isUserSeeking = true;
                console.log("seek start @ " + seekStart);
                console.log("seek end @ " + seekEnd);
            }

            // call the tag if the the time reaches
            for (i = 0; i < options.tags.length; i++) {
                if (whereYouAt == Math.floor(options.tags[i])) {
                    // myPlayer.pause();
                    options.cbTag(whereYouAt);
                    window.setTimeout(function () {
                        myPlayer.play();
                    });                    
                    return;
                }
            }
		});
	}
}
