###A raspberry pi IP camera

This project uses the raspberry pi camera module and a raspberry pi B+ to stream live video to multiple browser clients. 

It uses MJPEG Streamer with raspicam input plugin from https://github.com/jacksonliam/mjpg-streamer.git to stream mjpeg1 video to the browser via websockets. The video is then decoded on the browser side using jsmpg.js (https://github.com/phoboslab/jsmpeg)

The raspberry pi can only do about 10 fps and the project is not really very stable as is, so use at your own risk :)
