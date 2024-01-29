package com.cpe.springboot.userservice.controllers;

import com.cpe.springboot.userservice.models.AuthDTO;
import com.cpe.springboot.userservice.models.DTOMapper;
import com.cpe.springboot.userservice.models.UserDTO;
import com.cpe.springboot.userservice.models.UserModel;
import com.cpe.springboot.userservice.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

//ONLY FOR TEST NEED ALSO TO ALLOW CROOS ORIGIN ON WEB BROWSER SIDE
@CrossOrigin
@RestController
public class UserRestController {

    @Autowired
    private final UserService userService;

    public UserRestController(UserService userService) {
        this.userService=userService;
    }

    @RequestMapping(method = RequestMethod.POST, value = "/sendmsg")
    public boolean sendInform(@RequestBody UserDTO msg) {
        System.out.println("[USERRESTCONTROLLER] [REGISTRATION] RECEIVED String MSG=["+msg+"]");
        userService.sendMsg(msg);
        return true;
    }

    @RequestMapping(method = RequestMethod.POST, value = "/sendmsg/{busName}")
    public boolean sendInform(@RequestBody UserDTO msg, @PathVariable String busName) {
        userService.sendMsg(msg,busName);
        return true;
    }


    @RequestMapping(method=RequestMethod.GET,value="/users")
    private List<UserDTO> getAllUsers() {
        List<UserDTO> uDTOList=new ArrayList<UserDTO>();
        for(UserModel uM: userService.getAllUsers()){
            uDTOList.add(DTOMapper.fromUserModelToUserDTO(uM));
        }
        return uDTOList;

    }

    @RequestMapping(method=RequestMethod.GET,value="/leaderboard")
    private List<UserDTO> getLeaderboard() {
        List<UserDTO> uDTOList=new ArrayList<UserDTO>();
        for(UserModel uM: userService.getLeaderboard()){
            uDTOList.add(DTOMapper.fromUserModelToUserDTO(uM));
        }
        return uDTOList;

    }

    @RequestMapping(method=RequestMethod.GET,value="/user/{id}")
    private UserDTO getUser(@PathVariable String id) {
        UserModel ruser;
        ruser= userService.getUser(id);
        if(ruser!=null){
            return DTOMapper.fromUserModelToUserDTO(ruser);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User Not Found",null);
        }
    }

    @RequestMapping(method=RequestMethod.POST,value="/user")
    public UserDTO addUser(@RequestBody UserDTO user) {
        return userService.addUser(user);
    }

    @RequestMapping(method=RequestMethod.DELETE,value="/user/{id}")
    public void deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
    }

    @RequestMapping(method=RequestMethod.PUT,value="/user/{id}")
    public UserDTO updateUser(@PathVariable("id") String userId, @RequestBody String userXp) {
        return userService.updateUser(userId, Integer.parseInt(userXp));
    }

    @RequestMapping(method=RequestMethod.POST,value="/auth")
    private String auth(@RequestBody AuthDTO authDto) {
        System.out.println("[USERRESTCONTROLLER] [AUTH] RECEIVED String MSG=["+authDto+"]");
        List<UserModel> uList = userService.getUserByLoginPwd(authDto.getUsername(),authDto.getPassword());
        if( uList.size() > 0) {
            System.out.println("[USERRESTCONTROLLER] [AUTH] User ["+uList.get(0).getId()+"] just logged in !");
            return uList.get(0).getId();
        }
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Authentification Failed",null);

    }


}
