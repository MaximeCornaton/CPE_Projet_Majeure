package com.cpe.springboot.userservice.models;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

public class UserDTO implements Serializable {
    @JsonProperty("userId")
    private String id;
    @JsonProperty("userLogin")
    private String login;
    @JsonProperty("userPwd")
    private String pwd;
    @JsonProperty("userAttack")
    private int attack;
    @JsonProperty("userHp")
    private int hp;
    @JsonProperty("userEndurance")
    private int endurance;
    @JsonProperty("userXp")
    private int xp;
    @JsonProperty("userLevel")
    private int level;
    @JsonProperty("userEmail")
    private String email;
    @JsonProperty("userImg")
    private String img;
    @JsonProperty("userLocation")
    private LocationModel location;

    public UserDTO() {
    }

    public UserDTO(UserModel user) {
        this.id = user.getId();
        this.login = user.getLogin();
        this.pwd = user.getPwd();
        this.email = user.getEmail();
        this.attack = user.getAttack();
        this.hp = user.getHp();
        this.endurance = user.getEndurance();
        this.img = user.getImg();
        this.level = user.getLevel();
        this.xp = user.getXp();
        this.location = user.getLocation();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getPwd() {
        return pwd;
    }

    public void setPwd(String pwd) {
        this.pwd = pwd;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public int getAttack() {
        return attack;
    }

    public void setAttack(int attack) {
        this.attack = attack;
    }

    public int getHp() {
        return hp;
    }

    public void setHp(int hp) {
        this.hp = hp;
    }

    public int getEndurance() {
        return endurance;
    }

    public void setEndurance(int endurance) {
        this.endurance = endurance;
    }

    public int getXp() {
        return xp;
    }

    public void setXp(int xp) {
        this.xp = xp;
    }

    public int getLevel() {
        return level;
    }

    public void setLevel(int level) {
        this.level = level;
    }

    public String getImg() {
        return img;
    }

    public void setImg(String img) {
        this.img = img;
    }
    public LocationModel getLocation() {
        return location;
    }

    @Override
    public String toString() {
        return "UserDTO{" +
                "id='" + id + '\'' +
                ", login='" + login + '\'' +
                ", pwd='" + pwd + '\'' +
                ", attack=" + attack +
                ", hp=" + hp +
                ", endurance=" + endurance +
                ", email='" + email + '\'' +
                ", loc='" + location + '\'' +
                '}';
    }
}
