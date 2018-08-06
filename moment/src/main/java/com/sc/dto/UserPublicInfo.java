package com.sc.dto;

import com.sc.entity.UserEntity;

/**
 * @author <a href="mailto:lesliesam@hotmail.com"> Sam Yu </a>
 */
public class UserPublicInfo {
    public int id;
    public String userName;

    public UserPublicInfo(UserEntity userEntity) {
        id = userEntity.getId();
        userName = userEntity.getUserName();
    }
}
