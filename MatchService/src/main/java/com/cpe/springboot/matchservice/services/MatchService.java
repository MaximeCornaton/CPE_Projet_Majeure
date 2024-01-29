package com.cpe.springboot.matchservice.services;

import com.cpe.springboot.matchservice.models.LikeModel;
import com.cpe.springboot.matchservice.repositories.LikesRepository;
import com.cpe.springboot.matchservice.models.UserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Random;

@Service
public class MatchService {
    private final RestTemplate restTemplate;
    private final LikesRepository likesRepository;
    @Autowired
    public MatchService(RestTemplate restTemplate, LikesRepository likesRepository) {
        this.restTemplate = restTemplate;
        this.likesRepository = likesRepository;
    }

    public UserDTO recommendProfiles(String userId) {
        // Appeler la méthode getAllUsers de UserService
        ResponseEntity<List<UserDTO>> response = restTemplate.exchange(
                "http://localhost/userservice/users",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<UserDTO>>() {
                }
        );

        List<UserDTO> users = response.getBody();
        UserDTO randomUser = null;
        if ((users != null) && (!users.isEmpty())) {
            // Recherche de l'utilisateur demandeur de recommandation et suppression de cet utilisateur
            UserDTO userAsker = null;
            for (UserDTO user : users) {
                if (user.getId().equals(userId)) {
                    userAsker = user;
                    break;
                }
            }

            if (userAsker != null) {
                users.remove(userAsker); // Retirer l'utilisateur demandeur de la liste de recommandation
                System.out.println("Utilisateur demandeur de recommandation retiré des recommandations");
            } else {
                System.out.println("Utilisateur demandeur de recommandation non trouvé");
            }

            List<UserDTO> usersToRecommand = deleteAlreadyLikedUsers(userId, users);
            System.out.println("[MATCHSERVICE] Utilisateurs à recommander : " + usersToRecommand);

            // Choix aléatoire d'un élément de la liste
            if (!usersToRecommand.isEmpty()) {
                Random random = new Random();
                randomUser = usersToRecommand.get(random.nextInt(usersToRecommand.size()));
                System.out.println("Élément aléatoire de la liste : " + randomUser);
            } else {
                System.out.println("La liste est vide après avoir retiré l'utilisateur demandeur de recommandation");
            }
        }
        return randomUser;
    }

    private List<UserDTO> deleteAlreadyLikedUsers(String userId, List<UserDTO> users) {
        // Récupération des likes de l'utilisateur demandeur de recommandation
        List<LikeModel> likes = likesRepository.findByUserLiking(userId);
        if ((likes != null) && (likes.size() > 0)) {
            // Suppression des utilisateurs déjà likés
            for (LikeModel like : likes) {
                for (UserDTO user : users) {
                    if (user.getId().equals(like.getUserLiked())) {
                        users.remove(user);
                        break;
                    }
                }
            }
        }
        return users;
    }

    public List<UserDTO> getMatches(String userId) {
        // Récupération des likes réciproques de userId
        List<LikeModel> likesOut = likesRepository.findByUserLiking(userId); //Tous ceux que userId a liké
        List<LikeModel> likesIn = likesRepository.findByUserLiked(userId); //Tous ceux qui ont liké userId
        List<LikeModel> matches = new ArrayList<>();
        for (LikeModel like : likesOut) {
            //Si le like est réciproque, on l'ajoute à la liste des matches
            for (LikeModel like2 : likesIn) {
                if (like.getUserLiking().equals(like2.getUserLiked()) && like.getUserLiked().equals(like2.getUserLiking())) {
                    matches.add(like);
                }
            }
        }

        List<UserDTO> users = new LinkedList<>();
        for (LikeModel like : matches) {
            users.add(restTemplate.getForObject("http://localhost/userservice/user/" + like.getUserLiked(), UserDTO.class));
        }
        System.out.println("[MATCHSERVICE] Matches de " + userId + ": " + users);
        return users;
    }

    public boolean isMatch(LikeModel likeModel) {
        LikeModel like1 = likesRepository.findByUserLikingAndUserLiked(likeModel.getUserLiking(), likeModel.getUserLiked());
        if (like1 != null) {
            System.out.println("[MATCHSERVICE] : **************************PROBLEME : USER DEJA LIKE**************************");
            return false;
        }
        likesRepository.save(likeModel);
        System.out.println("[MATCHSERVICE] Like enregistré !");
        LikeModel like2 = likesRepository.findByUserLikingAndUserLiked(likeModel.getUserLiked(), likeModel.getUserLiking());
        if (like2 != null) {
            System.out.println("[MATCHSERVICE] : C'est un match !");
            return true;
        }
        System.out.println("[MATCHSERVICE] : Ce n'est pas un match !");
        return false;
    }
}
