package com.cpe.springboot.userservice.repositories;

import com.cpe.springboot.userservice.models.UserModel;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface UserRepository extends CrudRepository<UserModel, String> {

    List<UserModel> findByLoginAndPwd(String login, String pwd);
    List<UserModel> findByLogin(String login);
    List<UserModel> findTop10ByOrderByXpDesc();
}