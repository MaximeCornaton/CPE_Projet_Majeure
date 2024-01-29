# Projet majeure CLBD 2024

CHARPENAY Arthur, CHAUSSON Adrien, CORNATON Maxime, GUZELIAN Raphaël

## Getting started

1) Se placer dans son répertoire activemq et le lancer :
```
bin\activemq start
```

2) Lancer le reverse proxy (lancer docker au préalable):
```
docker run --rm --name my-custom-asi-nginx-container -p 80:80 -v "$(pwd)/nginx.conf":/etc/nginx/nginx.conf:ro nginx


docker run --rm --name my-custom-asi-nginx-container -p 80:80 -v ${PWD}/nginx.conf:/etc/nginx/nginx.conf:ro nginx

on windows PS
```

3) Lancer le microservice front :
```
npm run dev -- --host
```

4) Lancer le microservice user (springboot)
5) Lancer le microservice data (python):
```
Dans le dossier DataService :
python api.py
```

6) Exécuter les commandes suivantes dans l'ordre :
```
- git clone https://github.com/xtekky/gpt4free.git
- cd gpt4free
- docker pull selenium/node-chrome
- docker-compose build
- docker-compose up
```

## Règles du jeu 
```
Règles du jeu :
 - Gagner un combat donne +10 d'XP. Perdre en donne +5
 - Pour monter de niveau, il faut acquérir (niveau supérieur)*10 XP. Par exemple, passer du niveau 1 au 2 demande 20 XP
 - Monter de niveau permet d'augmenter son attaque et PV de +1, et l'endurance de 10


Règles du combat :
 - Toutes les 1 secondes, les joueurs ont le droit de donner un coup. Il n'y a pas d'ordre d'attaque. Les PV enlevés sont égaux à l'attaque de l'attaquant
 - Donner un coup consomme 10 d'endurances
 - Pour ne pas perdre des PV, on peut soit éviter le coup, soit bloquer en se mettant en garde
 - Eviter permet d'esquiver à droite ou à gauche, bloquer permet de parer n'importe quel coup (droite ou gauche)
 - Eviter consomme 5 d'endurances, et bloquer coûte 10
 - L'endurance se régénère de +5 toutes les 3 secondes 


Matchmaking :
 - Pour avoir des combats équilibrés, chaque joueur joue face à quelqu'un qui a soit +1 en attaque et -toughness en PV par rapport au joueur, soit -1 en attaque et +toughness en PV par rapport au joueur. Si aucun adversaire trouvé, combattre face à quelqu'un du même niveau 


Caractéristiques des joueurs :
 - Attaque (power)
 - PV (toughness x 5)
 - Endurance, 100 pour tout le monde au départ
```


## DevOps
Build un service :
```
docker build -t registry.gitlab.com/adrienchausson/uberbagarre/posedetectionservice .```
```
Run un service (pour test) :
```
docker run -p 5000:5000 registry.gitlab.com/adrienchausson/uberbagarre/posedetectionservice
```
Push un service :
```
docker push registry.gitlab.com/adrienchausson/uberbagarre/posedetectionservice
```
Voir port du container activemq :
```
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' activemq
```
# CPE_Projet_Majeure
