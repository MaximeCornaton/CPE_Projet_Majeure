package com.cpe.springboot.userservice.models;

public class DTOMapper {
    public static UserDTO fromUserModelToUserDTO(UserModel uM) {
        UserDTO uDto =new UserDTO(uM);
        return uDto;
    }

}