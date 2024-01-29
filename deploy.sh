#!/bin/bash

# Étape 1
/opt/homebrew/bin/activemq start &

# Étape 2
docker run --rm --name my-custom-asi-nginx-container -p 80:80 -v "$(pwd)/nginx.conf":/etc/nginx/nginx.conf:ro nginx &

# Étape 3
cd StaticService
npm install &
npm run dev -- --host &
cd ..

# Étape 4
#cd UserService
#mvn clean package &
#java -jar target/UserService-0.0.1-SNAPSHOT.jar &
#cd ..

# Étape 5
cd DataService
#pip3 install flask
python3 api_img_carac.py &
