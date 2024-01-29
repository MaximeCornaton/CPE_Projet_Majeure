package com.cpe.springboot.userservice.models;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

@Entity
@JsonIdentityInfo(generator= ObjectIdGenerators.PropertyGenerator.class, property="id")
public class UserModel implements Serializable {

    private static final long serialVersionUID = 2733795832476568049L;

    @Id
    private String id;
    private String login;
    private String pwd;
    private String email;
    private int attack;
    private int hp;
    private int endurance;
    private int xp;
    private int level;
    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "latitude", column = @Column(name = "latitude")),
            @AttributeOverride(name = "longitude", column = @Column(name = "longitude"))
    })
    private LocationModel location;
    @Column(length = 1000000)
    private String img;


    public UserModel() {
        this.login = "";
        this.pwd = "";
        this.email="email_default";
    }

    public UserModel(String login, String pwd) {
        super();
        this.login = login;
        this.pwd = pwd;
        this.email="email_default";
    }

    public UserModel(UserDTO user) {
        this.id=user.getId();
        this.login=user.getLogin();
        this.pwd=user.getPwd();
        this.email=user.getEmail();
        this.attack=user.getAttack();
        this.hp=user.getHp();
        this.endurance=user.getEndurance();
        this.img=user.getImg();
        this.level=user.getLevel();
        this.xp=user.getXp();
        this.location=user.getLocation();
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
        levelUp(); // Call levelUp when XP is set
    }

    private void levelUp() {
        int requiredXpToLevelUp = (level+1) * 10;
        if (xp >= requiredXpToLevelUp) {
            level++;
            attack++;
            hp++;
            endurance += 10;
        }
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
}
