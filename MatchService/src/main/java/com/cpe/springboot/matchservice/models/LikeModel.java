package com.cpe.springboot.matchservice.models;


import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class LikeModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String userLiking;
    private String userLiked;

    public LikeModel() {
    }

    public LikeModel(String userLiking, String userLiked) {
        this.userLiking = userLiking;
        this.userLiked = userLiked;
    }

    public String getUserLiking() {
        return userLiking;
    }

    public String getUserLiked() {
        return userLiked;
    }
}
