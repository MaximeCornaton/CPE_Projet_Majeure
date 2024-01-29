package com.cpe.springboot.userservice.services;

import com.cpe.springboot.userservice.models.UserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Component;

@Component
public class BusListener {

    @Autowired
    JmsTemplate jmsTemplate;

    @Autowired
    private UserService userService;


    @JmsListener(destination = "PENDING_USERS", containerFactory = "connectionFactory")
    public void receiveMessageResult(UserDTO userDTO) {

        System.out.println("[BUSLISTENER] [CHANNEL PENDING_USERS] RECEIVED String MSG=["+userDTO+"]");
        userService.addUser(userDTO);

    }
}
