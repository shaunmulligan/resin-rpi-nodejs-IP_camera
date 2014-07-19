#!/bin/bash
avconv -r 5 -s 320x240 -f video4linux2  -i /dev/video0 -f mpeg1video -b 300k -r 20 http://127.0.0.1:8082/skate19/320/240/
