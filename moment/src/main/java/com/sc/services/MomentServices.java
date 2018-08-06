package com.sc.services;

import com.sc.entity.MomentEntity;
import com.sc.entity.UserEntity;

import java.util.List;

/**
 * @author <a href="mailto:lesliesam@hotmail.com"> Sam Yu </a>
 */
public interface MomentServices {
    MomentEntity postMoment(UserEntity user, String text, String images);
    List<MomentEntity> getMoments(UserEntity user, int step, int stepLength);

}
