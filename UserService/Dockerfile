# Utiliser l'image Maven officielle
FROM maven:3.8.1-openjdk-11 AS builder

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier le fichier POM.xml pour télécharger les dépendances Maven avant de copier les sources
COPY pom.xml .

# Exécuter une phase Maven pour télécharger les dépendances (cela crée une couche Docker cache)
RUN ["mvn", "verify", "--fail-never"]

# Copier les sources du projet
COPY src ./src

# Ajout de cette étape pour installer dans le référentiel local
RUN ["mvn", "install", "-DskipTests"]

# Compiler l'application
RUN ["mvn", "package", "-DskipTests"]

# Utiliser une image plus légère pour l'exécution
FROM adoptopenjdk:11-jre-hotspot

# Copier le JAR construit à partir de l'image de construction
COPY --from=builder /app/target/UserService-0.0.1-SNAPSHOT.jar /app/UserService.jar

# Exposer le port sur lequel l'application Spring Boot écoute
EXPOSE 8081

# Commande pour démarrer l'application lorsque le conteneur démarre
CMD ["java", "-jar", "/app/UserService.jar"]
