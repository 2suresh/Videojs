Videojs
=======

Play Video and add activity using video.js player with custom json input data

Example
=======

var op = {   
    elementId : 'video',
    videoUrl: "oceans-clip.webm",
    poster: "oceans-clip.png",
    cbPlay: videoPlayed,
    cbPause: videoPaused,
    cbSeeking: videoSeeking,
    tags: [9, 16, 23, 28, 36], // pushing the tag & marking the progress bar
    activityText : ["this", "is", "so", "cool", ":)"],
    cbTag: tag
};

elementId: id of video tag
VideoURL: choose your video to play
poster: load the image before loading video
cbSeeking: find the seeking time
cbPlay, cbPause: Add your custom activity
tags: create a mark on progress bar like youtube video player
activityText: sample text to show when tage reaches the currentTime()
cbTag: add you activity