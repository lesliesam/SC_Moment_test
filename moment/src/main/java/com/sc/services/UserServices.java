package com.sc.services;

import com.sc.entity.*;

import java.util.List;

/**
 * @author <a href="mailto:lesliesam@hotmail.com"> Sam Yu </a>
 */
public interface UserServices {
    List<UserEntity> getUser(int userId);
    List<UserEntity> getUser(String userName);
    List<UserEntity> getUserWithAuthSession(String authSession);
    UserEntity userSignupWithDevice(String deviceName, String deviceId);
    UserEntity updateUserSession(UserEntity user);
    UserEntity updateUserName(UserEntity user, String displayName);
    UserEntity updateProfileImage(UserEntity user, String imageURL);
}
