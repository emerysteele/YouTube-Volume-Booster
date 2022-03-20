// ==UserScript==
// @name          Youtube Volume Booster
// @author        emerysteele
// @namespace     namespace_emerysteele
// @description   Automatically boosts gain of YouTube videos
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

// 2022.03.20
// - First iteration


(function() {
    window.addEventListener("yt-navigate-finish", main, true);

    var video = undefined;
    var audioCtx = undefined;
    var mediaSource = undefined;
    var gainNode = (gainNode === undefined) ? undefined : gainNode;
    var player = undefined;
    var volumeLevel = undefined;
    var volumeGain = undefined;
    var volumeGainPwr = undefined;

    function main(){
        console.log("New video loaded, running normalization script.");
        player = document.getElementById('movie_player');
        console.log(player);
        volumeLevel = player.getStatsForNerds(0).volume.match(/(-?[0-9]\d*(\.\d+)?dB)/)[0];
        volumeGain = volumeLevel.match(/[0-9]\d*(\.\d+)?/)[0];
        volumeGainPwr = Math.pow(10,volumeGain/20)
        console.log(volumeLevel);



        if(volumeLevel.indexOf("-") == 0){
            if(typeof gainNode == 'object'){
                gainNode.gain.value = volumeGainPwr;
                console.log(volumeGainPwr);
            }
            else{

            // create an audio context and hook up the video element as the source
            video = document.querySelector('video');
            audioCtx = new AudioContext();
            mediaSource = audioCtx.createMediaElementSource(video);
            gainNode = audioCtx.createGain();
            mediaSource.connect(gainNode);

            // connect the gain node to an output destination
            gainNode.connect(audioCtx.destination);


            gainNode.gain.value = volumeGainPwr;
            console.log(volumeGainPwr);
            }
        }
        else{
            if(typeof gainNode == 'object'){
                gainNode.gain.value = 1;
                console.log(1);
            }
            else{

            }
        }
    }

    main();

})();
