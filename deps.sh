#install ffmpeg for video stream
apt-get update
apt-get upgrade -y
#apt-get install dialog
apt-get install -y libav-tools

apt-get install libjpeg8-dev imagemagick libv4l-dev
ln -s /usr/include/linux/videodev2.h /usr/include/linux/videodev.h
wget http://sourceforge.net/code-snapshots/svn/m/mj/mjpg-streamer/code/mjpg-streamer-code-182.zip
unzip mjpg-streamer-code-182.zip
cd mjpg-streamer-code-182/mjpg-streamer
make mjpg_streamer input_file.so output_http.so

cp mjpg_streamer /usr/local/bin
cp output_http.so input_file.so /usr/local/lib/
cp -R www /usr/local/www
