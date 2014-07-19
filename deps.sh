#install ffmpeg for video stream
apt-get update
apt-get upgrade -y
#apt-get install dialog
apt-get install -y libav-tools

#!/bin/bash
grep "start_x=1" /boot/config.txt
if grep "start_x=1" /boot/config.txt
then
        exit
else
        sed -i "s/start_x=0/start_x=1/g" /boot/config.txt
        reboot
fi
exit
