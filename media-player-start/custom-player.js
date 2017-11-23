// JavaScript source code
/*Here we are creating variables to hold references to all the objects we want to manipulate. We have three groups:
The <video> element, and the controls bar.
The play/pause, stop, rewind, and fast forward buttons.
The outer timer wrapper <div>, the digital timer readout <span>, and the inner <div> that gets wider as the time elapses.*/
var media = document.querySelector('video');
var controls = document.querySelector('.controls');

var play = document.querySelector('.play');
var stop = document.querySelector('.stop');
var rwd = document.querySelector('.rwd');
var fwd = document.querySelector('.fwd');

var timerWrapper = document.querySelector('.timer');
var timer = document.querySelector('.timer span');
var timerBar = document.querySelector('.timer div');

/*These two lines below remove the default browser controls from the video, and make the custom controls visible.*/
media.removeAttribute('controls');
controls.style.visibility = 'visible';


play.addEventListener('click', playPauseMedia); //playPauseMedia() function is invoked when the play button is clicked

/*Below, in the playPauseMedia function, we use an if statement to check whether the video is paused. 
The HTMLMediaElement.paused property returns true if the media is paused, which is any time the video is not playing, 
including when it is sat at 0 duration after it first loads. 
If it is paused, we set the data-icon attribute value on the play button to "u", which is a "paused" icon, 
and invoke the HTMLMediaElement.play() method to play the media.On the second click, 
the button will be toggled back again — the "play" icon will be shown again, 
and the video will be paused with HTMLMediaElement.paused().*/
function playPauseMedia() {
    rwd.classList.remove('active');
    fwd.classList.remove('active');
    clearInterval(intervalRwd);
    clearInterval(intervalFwd);
    if (media.paused) {
        play.setAttribute('data-icon', 'u');
        media.play();
    } else {
        play.setAttribute('data-icon', 'P');
        media.pause();
    }
}

/*We want to stop the video by running our stopMedia() function when the stop button is clicked. 
We do however also want to stop the video when it finishes playing — this is marked by the ended event firing,
so we also set up a listener to run the function on that event firing too.*/
stop.addEventListener('click', stopMedia);
media.addEventListener('ended', stopMedia);

/*Referring the stopMedia function below, there is no stop() method on the HTMLMediaElement API — the equivalent is to pause() the video, and set its currentTime property to 0. 
Setting currentTime to a value (in seconds) immediately jumps the media to that position.
All there is left to do after that is to set the displayed icon to the "play" icon. 
Regardless of whether the video was paused or playing when the stop button is pressed, you want it to be ready to play afterwards.*/
function stopMedia() {
    media.pause();
    media.currentTime = 0;
    play.setAttribute('data-icon', 'P');
    /*If the play/pause or stop buttons are pressed while the rewind or fast forward functionality is active, they just don't work. 
    We fix this using the four lines of code below so that they cancel the rwd/fwd button functionality 
    and play/stop the video as you'd expect */
    rwd.classList.remove('active');
    fwd.classList.remove('active');
    clearInterval(intervalRwd);
    clearInterval(intervalFwd);
}

rwd.addEventListener('click', mediaBackward); // Add event listener for rwd button
fwd.addEventListener('click', mediaForward); // Add event listener for the fwd button

// Interval variables to be used in mediaBackward/Forward functions below
var intervalFwd;
var intervalRwd;

/*Below in the mediaBackward function, 
We use an if statement to check whether the active class has been set on the rwd button, indicating that it has already been pressed. 
We use the we use the built in element classList property, and 
call classList.contains() method to check whether the list contains the active class. This returns a boolean true/false result.
If active has been set on the rwd button, we remove it using classList.remove(), 
clear the interval that has been set when the button was first pressed 
and use HTMLMediaElement.play() to cancel the rewind and start the video playing normally.
If it hasn't yet been set, we add the active class to the rwd button using classList.add(), 
pause the video using HTMLMediaElement.pause(), then set the intervalRwd variable to equal a setInterval() call. 
When invoked, setInterval() creates an active interval, meaning that it runs the function given as the first parameter every x milliseconds,
where x is the value of the 2nd parameter. So here we are running the windBackward() function every 200 milliseconds — 
we'll use this function to wind the video backwards constantly
*/
function mediaBackward() {
    clearInterval(intervalFwd);
    fwd.classList.remove('active');

    if (rwd.classList.contains('active')) {
        rwd.classList.remove('active');
        clearInterval(intervalRwd);
        media.play();
    } else {
        rwd.classList.add('active');
        media.pause();
        intervalRwd = setInterval(windBackward, 200);
    }
}

function mediaForward() {//Functionality same as in mediaBackward above, but in reverse
    clearInterval(intervalRwd);
    rwd.classList.remove('active');

    if (fwd.classList.contains('active')) {
        fwd.classList.remove('active');
        clearInterval(intervalFwd);
        media.play();
    } else {
        fwd.classList.add('active');
        media.pause();
        intervalFwd = setInterval(windForward, 200);
    }
}

/*Below in the windBackward function, we start off with an if statement 
that checks to see whether the current time is less than 3 seconds, i.e., 
if rewinding by another three seconds would take it back past the start of the video.
 This would cause strange behaviour, so if this is the case we stop the video playing by calling stopMedia(), 
 remove the active class from the rewind button, and clear the intervalRwd interval to stop the rewind functionality. 
 If we didn't do this last step, the video would just keep rewinding forever.
If the current time is not within 3 seconds of the start of the video, 
we simply remove three seconds from the current time by executing media.currentTime -= 3.
 So in effect, we are rewinding the video by 3 seconds, once every 200 milliseconds.*/
function windBackward() {
    if (media.currentTime <= 3) {
        //rwd.classList.remove('active');
        //clearInterval(intervalRwd);
        stopMedia();
    } else {
        media.currentTime -= 3;
    }
}

function windForward() {//functionality same as in windBackward above, but in reverse
    if (media.currentTime >= media.duration - 3) {
        //fwd.classList.remove('active');
        //clearInterval(intervalFwd);
        stopMedia();
    } else {
        media.currentTime += 3;
    }
}

//Add timeupdate event function to update the time displays every time the timeupdate event is fired on the <video> element
media.addEventListener('timeupdate', setTime);

function setTime() {
    /*We work out the number of minutes and seconds in the HTMLMediaElement.currentTime value.*/
    var hours = Math.floor(media.currentTime / (60 * 60));
    var auxilliary = Math.floor(media.currentTime - hours * (60 * 60));
    var minutes = Math.floor(auxilliary / 60); //Math.floor(media.currentTime / 60);
    var seconds = Math.floor(auxilliary - minutes * 60); //Math.floor(media.currentTime - minutes * 60);

    //variables to be used in to set the hour, minutes and seconds
    var hourValue;
    var minuteValue;
    var secondValue;

    /*The if statements work out whether the number of hours, minutes and seconds are less than 10. 
    If so, they add a leading zero to the values, in the same way that a digital clock display works.*/
    if (hours < 10) {
        hourValue = '0' + hours;
    } else {
        hourValue = hours;
    }

    if (minutes < 10) {
        minuteValue = '0' + minutes;
    } else {
        minuteValue = minutes;
    }

    if (seconds < 10) {
        secondValue = '0' + seconds;
    } else {
        secondValue = seconds;
    }
    /*The actual time value to display is set as hourValue plus a colon character plus 
    minuteValue plus a colon character plus secondValue.*/
    var mediaTime = hourValue + ':' + minuteValue + ':' + secondValue;
    
    /*The Node.textContent value of the timer is set to the time value, so it displays in the UI.*/
    timer.textContent = mediaTime;

    /*The length we should set the inner <div> to is worked out by 
    first working out the width of the outer <div> (any element's clientWidth property will contain its length), 
    and then multiplying it by the HTMLMediaElement.currentTime divided by the total HTMLMediaElement.duration of the media.*/
    var barLength = timerWrapper.clientWidth * (media.currentTime / media.duration);
    
    /*We set the width of the inner <div> to equal the calculated bar length, plus "px", so it will be set to that number of pixels.*/
    timerBar.style.width = barLength + 'px';
}

/*function to turn timer inner <div> element into a true seek bar/scrobbler — i.e., 
when you click somewhere on the bar, it jumps to that relative position in the video playback*/
timerWrapper.onclick = function (e) {
    var timerWrapperRect = timerWrapper.getBoundingClientRect(); // Get X and Y values of the element's left/right and top/bottom sides
    media.currentTime = ((e.x - timerWrapperRect.left) / (timerWrapperRect.right - timerWrapperRect.left)) * media.duration; //e gets mouseclick coordinates
    media.play();
}
