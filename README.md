# YouTube-Volume-Booster
[Tampermonkey](https://www.tampermonkey.net/) browser extension Userscript to automatically boost quiet YouTube videos.

Volume will only be boosted if content loudness is below 0dB. If above 0dB, gain is reset to 1x (YouTube handles normalization in this case).
Volume boost is calculated as a gain multipler based on how quiet it is.
This data is pulled directly from YouTube's Stats for Nerds when the video loads, so boost is instant.
