package com.cpe.springboot.userservice.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.cpe.springboot.userservice.models.DTOMapper;
import com.cpe.springboot.userservice.models.UserDTO;
import com.cpe.springboot.userservice.models.UserModel;
import com.cpe.springboot.userservice.repositories.UserRepository;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;


@Service
public class UserService {
    @Autowired
    JmsTemplate jmsTemplate;

    private final UserRepository userRepository;
    private final RestTemplate restTemplate;

    @Autowired
    public UserService(UserRepository userRepository, RestTemplate restTemplate) {
        this.userRepository = userRepository;
        this.restTemplate = restTemplate;
    }

    public List<UserModel> getAllUsers() {
        List<UserModel> userList = new ArrayList<>();
        userRepository.findAll().forEach(userList::add);
        return userList;
    }

    public UserModel getUser(String id) {
        Optional<UserModel> uOpt = userRepository.findById(id);
        if (uOpt.isPresent()) {
            UserModel u = uOpt.get();
            try {
                // Préparez les en-têtes de la requête
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);

                // Créez le corps de la requête
                String requestBody = "{\"image_base64\": \"" + u.getImg() + "\", \"level\": \"" + u.getLevel() + "\"}";

                // Effectuez la requête POST
                HttpEntity<String> requestEntity = new HttpEntity<>(requestBody, headers);
                ResponseEntity<String> responseEntity = restTemplate.exchange("http://localhost/dataservice/get_frame", HttpMethod.POST, requestEntity, String.class);

                // Récupérez la réponse
                String responseBody = responseEntity.getBody();

                // Utilisez JSONObject pour extraire les valeurs
                JSONObject jsonObject = new JSONObject(responseBody);
                String imageBase64 = jsonObject.getString("image_base64");
                u.setImg(imageBase64);
                System.out.println("Image set");
            } catch (Exception e) {
                System.out.println("Erreur lors de la requête POST vers le dataservice");
                System.out.println(e);
            }
            return u;
        } else {
            throw new RuntimeException("User not found for id : " + id);
        }
    }

    public void sendMsg(UserDTO userDTO) {
        System.out.println("[BUSSERVICE] SEND String MSG=["+userDTO+"]");
        jmsTemplate.convertAndSend("PENDING_USERS",userDTO);
    }

    public void sendMsg(UserDTO userDTO, String busName) {
        System.out.println("[BUSSERVICE] SEND String MSG=["+userDTO+"] to Bus=["+busName+"]");
        jmsTemplate.convertAndSend(busName,userDTO);
    }


    public UserDTO addUser(UserDTO user) {
        UserModel u = new UserModel(user);

        // Préparez les en-têtes de la requête
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Créez le corps de la requête
        String requestBody = "{\"image_base64\": \"" + u.getImg() + "\"}";

        // Effectuez la requête POST
        HttpEntity<String> requestEntity = new HttpEntity<>(requestBody, headers);

        int userAttack = 1;
        int userHp = 1;

        try {
            ResponseEntity<String> responseEntity = restTemplate.exchange("http://localhost/dataservice/predict", HttpMethod.POST, requestEntity, String.class);

            // Récupérez la réponse
            String responseBody = responseEntity.getBody();

            // Utilisez JSONObject pour extraire les valeurs
            JSONObject jsonObject = new JSONObject(responseBody);
            userAttack = jsonObject.getInt("userAttack");
            userHp = jsonObject.getInt("userHp");
        } catch (Exception e) {
            System.out.println("Erreur lors de la requête POST vers le dataservice - default values set for userAttack and userHp ");
            System.out.println(e);
        }


        System.out.println("[USERSERVICE] Caractéristiques attribuées : [userAttack: " + userAttack + "; userHp: " + userHp + "]");

        u.setAttack(userAttack);
        u.setHp(userHp);
        u.setEndurance(100);
        u.setLevel(1);
        u.setXp(0);

        UserModel uBd = userRepository.save(u);
        System.out.println("[USERSERVICE] : " + uBd.getId() + " a été créé !");

        return DTOMapper.fromUserModelToUserDTO(uBd);
    }


    public UserDTO updateUser(String id, int xp) {
        Optional<UserModel> uOpt = userRepository.findById(id);
        if (uOpt.isPresent()) {
            UserModel u = uOpt.get();
            u.setXp(u.getXp() + xp);
            UserModel uBd =userRepository.save(u);
            return DTOMapper.fromUserModelToUserDTO(uBd);
        } else {
            throw new RuntimeException("User not found for id : " + id);
        }
    }

    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }

    public List<UserModel> getUserByLoginPwd(String login, String pwd) {
        List<UserModel> ulist = null;
        ulist = userRepository.findByLoginAndPwd(login, pwd);
        return ulist;
    }

    public List<UserModel> getUserByLogin(String login) {
        List<UserModel> ulist = null;
        ulist = userRepository.findByLogin(login);
        return ulist;
    }

    public List<UserModel> getLeaderboard() {
        List<UserModel> ulist = null;
        ulist = userRepository.findTop10ByOrderByXpDesc();
        System.out.println("[USERSERVICE] [LEADERBOARD] ulist=["+ulist+"]");
        return ulist;
    }
}