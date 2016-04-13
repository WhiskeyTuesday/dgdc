#!/bin/env zsh

middleman build
\rm -rf /var/www/andysorensen.com/public_html/*
cp -r /var/www/andysorensen.com/dgdc/build/* /var/www/andysorensen.com/public_html
