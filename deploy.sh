#!/bin/bash
sudo kill -9 $(sudo lsof -t -i:9090)
nohup java -jar  target/technology-agriculture-web-app-0.0.1-SNAPSHOT.war >> web-app.log &
