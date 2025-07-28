#!/bin/bash

# Start the first process
node /app/index.js &

sleep 5
# Start the second process
x11vnc -display :99 -forever -nopw  &

# Wait for any process to exit
wait -n

exit 1