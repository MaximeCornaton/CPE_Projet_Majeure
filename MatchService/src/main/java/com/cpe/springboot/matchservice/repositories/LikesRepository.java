package com.cpe.springboot.matchservice.repositories;

import com.cpe.springboot.matchservice.models.LikeModel;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface LikesRepository extends CrudRepository<LikeModel, String> {

        LikeModel findByUserLikingAndUserLiked(String userLiking, String userLiked);

        List<LikeModel> findByUserLiking(String userLiking);

        List<LikeModel> findByUserLiked(String userLiked);
}
