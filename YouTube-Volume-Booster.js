// ==UserScript==
// @name          Youtube Volume Booster
// @author        emerysteele
// @namespace     namespace_emerysteele
// @description   Automatically boosts gain of quiet YouTube videos
// @version       2022.03.20
// @match         https://www.youtube.com/*
// @noframes
// @grant         none
// @compatible   chrome
// @compatible   firefox
// @compatible   opera
// @compatible   safari
// @compatible   edge
// @connect      youtube.com
// @run-at       document-end
// ==/UserScript==

// The gain will only be boosted if the content loudness is below 0dB, if above 0dB gain is reset to 1x (YouTube handles normalization in this case)
// Volume boost is calculated as a gain multipler based on how queit it is.

// 2022.03.20
// - First iteration

(function() {
    window.addEventListener("yt-navigate-finish", main, true);

    var gainAdjust = -0.0; //Use this to decrease or increase gain by a set value

    var video = undefined;
    var audioCtx = undefined;
    var mediaSource = undefined;
    var gainNode = (gainNode === undefined) ? undefined : gainNode;
    var player = undefined;
    var volumeLevel = undefined;
    var volumeGain = undefined;
    var volumeGainPwr = undefined;

    function main(){
        console.log("New page loaded, running content loudness analysis and gain boost if needed.");

        player = document.getElementById('movie_player');
        volumeLevel = player.getStatsForNerds(0).volume.match(/(-?[0-9]\d*(\.\d+)?dB)/)[0];
        volumeGain = volumeLevel.match(/[0-9]\d*(\.\d+)?/)[0];
        volumeGainPwr = Math.pow(10,volumeGain/20);

        console.log("Content loudness: "+volumeLevel);

        if(volumeLevel.indexOf("-") == 0){
            if(typeof gainNode == 'object'){
                gainNode.gain.value = parseFloat(volumeGainPwr).toFixed(4) + parseFloat(gainAdjust);

                console.log("Needed gain: "+volumeGainPwr.toFixed(4)+"x");
                console.log("Set gain (with gain adjust): "+gainNode.gain.value.toFixed(4)+"x");
            }
            else{
            video = document.querySelector('video');
            audioCtx = new AudioContext();
            mediaSource = audioCtx.createMediaElementSource(video);
            gainNode = audioCtx.createGain();
            mediaSource.connect(gainNode);

            gainNode.connect(audioCtx.destination);
            gainNode.gain.value = parseFloat(volumeGainPwr).toFixed(4) + parseFloat(gainAdjust);

            console.log("Needed gain: "+volumeGainPwr.toFixed(4)+"x");
            console.log("Set gain (with gain adjust): "+gainNode.gain.value.toFixed(4)+"x");
            }
        }
        else{
            if(typeof gainNode == 'object'){
                gainNode.gain.value = parseFloat(1) + parseFloat(gainAdjust);

                console.log("Needed gain: 1x");
                console.log("Set gain (with gain adjust): "+gainNode.gain.value.toFixed(4)+"x");
            }
            else{
                video = document.querySelector('video');
            audioCtx = new AudioContext();
            mediaSource = audioCtx.createMediaElementSource(video);
            gainNode = audioCtx.createGain();
            mediaSource.connect(gainNode);

            gainNode.connect(audioCtx.destination);
            gainNode.gain.value = parseFloat(1) + parseFloat(gainAdjust);

            console.log("Needed gain: 1x");
                console.log("Set gain (with gain adjust): "+gainNode.gain.value.toFixed(4)+"x");
            }
        }
    }

    main();

})();
