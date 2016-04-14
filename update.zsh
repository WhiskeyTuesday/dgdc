#!/bin/env zsh

#must be run from somewhere inside the dgdc directory due to limitations of middleman build command (it can't be pointed at a path, only looks in current location)

middleman build
\rm -rf /var/www/andysorensen.com/public_html/*
cp -r /var/www/andysorensen.com/dgdc/build/* /var/www/andysorensen.com/public_html
