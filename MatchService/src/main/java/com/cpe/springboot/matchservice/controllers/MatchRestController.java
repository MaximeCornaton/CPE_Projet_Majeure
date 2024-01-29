package com.cpe.springboot.matchservice.controllers;

import com.cpe.springboot.matchservice.models.LikeModel;
import com.cpe.springboot.matchservice.services.MatchService;
import com.cpe.springboot.matchservice.models.UserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

//ONLY FOR TEST NEED ALSO TO ALLOW CROOS ORIGIN ON WEB BROWSER SIDE
@CrossOrigin
@RestController
public class MatchRestController {

    private final MatchService matchService;

    public MatchRestController(MatchService matchService) {
        this.matchService = matchService;
    }

    @RequestMapping(method = RequestMethod.POST, value = "/getRecommendation")
    public UserDTO recommendProfile(@RequestBody String userId) {
        System.out.println("[MATCHRESTCONTROLLER] Recherche de recommandation pour le user " + userId + "...");
        UserDTO userDTOreco = matchService.recommendProfiles(userId);
        System.out.println("[MATCHRESTCONTROLLER] Recommandation trouvée !");
        return userDTOreco;
    }

    @RequestMapping(method = RequestMethod.POST, value = "/isMatch")
    public boolean isMatch(@RequestBody LikeModel likeModel) {
        System.out.println("[MATCHRESTCONTROLLER] : " + likeModel.getUserLiking() + " a liké " + likeModel.getUserLiked());
        return matchService.isMatch(likeModel);
    }

    @RequestMapping(method = RequestMethod.POST, value = "/getMatches")
    public List<UserDTO> getMatches(@RequestBody String userId) {
        System.out.println("[MATCHRESTCONTROLLER] Recherche des matchs pour le user id " + userId + "...");
        List<UserDTO> userDTOreco = matchService.getMatches(userId);
        System.out.println("[MATCHRESTCONTROLLER] Matchs trouvés : " + userDTOreco.size());
        return userDTOreco;
    }
}