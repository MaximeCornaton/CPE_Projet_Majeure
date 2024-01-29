package com.cpe.springboot.userservice.models;

import com.fasterxml.jackson.annotation.JsonProperty;

public class AuthDTO {
    @JsonProperty("userLogin")
    private String username;
    @JsonProperty("userPwd")
    private String password;

    public AuthDTO() {
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public String toString() {
        return "AuthDTO{" +
                "username='" + username + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
}
