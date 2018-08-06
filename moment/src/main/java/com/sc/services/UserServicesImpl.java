package com.sc.services;

import com.sc.Constants;
import com.sc.HibernateUtil;
import com.sc.annotation.CacheEnabled;
import com.sc.annotation.UserSession;
import com.sc.entity.*;
import com.sc.interceptor.UserSessionCacheInterceptor;
import org.apache.commons.codec.digest.DigestUtils;
import org.hibernate.Session;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

/**
 * @author <a href="mailto:lesliesam@hotmail.com"> Sam Yu </a>
 */
public class UserServicesImpl implements UserServices {

    @Override
    public List<UserEntity> getUser(int userId) {
        Session session = HibernateUtil.getSessionFactory().openSession();

        String queryStr = "from UserEntity where id = :userId";
        List<UserEntity> list = session.createQuery(queryStr).
                setInteger("userId", userId).
                list();

        session.close();
        return list;
    }

    public List<UserEntity> getUser(String userName) {
        Session session = HibernateUtil.getSessionFactory().openSession();

        String queryStr = "from UserEntity where userName = :userName";
        List<UserEntity> list = session.createQuery(queryStr).
                setString("userName", userName).
                list();

        session.close();
        return list;
    }

    @UserSession(type = UserSessionCacheInterceptor.GET)
    @CacheEnabled
    public List<UserEntity> getUserWithAuthSession(String authSession) {
        Session session = HibernateUtil.getSessionFactory().openSession();

        String queryStr = "from UserEntity where session = :session";
        List<UserEntity> list = session.createQuery(queryStr).
                setString("session", authSession).
                list();

        session.close();
        return list;
    }


    public UserEntity userSignupWithDevice(String deviceName, String deviceId) {
        Session session = HibernateUtil.getSessionFactory().openSession();

        String queryStr = "from UserDeviceIdEntity where deviceName = :deviceName and deviceId = :deviceId";
        List<UserDeviceIdEntity> list = session.createQuery(queryStr).
                setString("deviceName", deviceName).
                setString("deviceId", deviceId)
                .list();
        UserEntity user;
        if (list.size() > 0) {
            // Device found.
            UserDeviceIdEntity deviceIdEntity = list.get(0);
            user = deviceIdEntity.getUser();
            session.beginTransaction();
            session.update(user);
            session.getTransaction().commit();
        } else {
            // Device not found.
            user = new UserEntity();
            user.setUserName(Constants.GUEST_NAME);
            user.setCreateTime(new Timestamp(System.currentTimeMillis()));
            user.setLastLogin(new Timestamp(System.currentTimeMillis()));
            user.setSession(generateUserSessionStr(user));

            UserDeviceIdEntity deviceIdEntity = new UserDeviceIdEntity();
            deviceIdEntity.setDeviceName(deviceName);
            deviceIdEntity.setDeviceId(deviceId);
            deviceIdEntity.setUser(user);

            session.beginTransaction();
            session.save(deviceIdEntity);
            session.getTransaction().commit();

            user = deviceIdEntity.getUser();
        }

        session.close();
        return user;
    }

    @UserSession(type = UserSessionCacheInterceptor.STORE)
    @CacheEnabled
    public UserEntity updateUserSession(UserEntity user) {
        Session session = HibernateUtil.getSessionFactory().openSession();

        user.setSession(generateUserSessionStr(user));
        session.beginTransaction();
        session.update(user);
        session.getTransaction().commit();

        session.close();

        return user;
    }


    @Override
    public UserEntity updateUserName(UserEntity user, String userName) {
        Session session = HibernateUtil.getSessionFactory().openSession();
        user.setUserName(userName);
        session.beginTransaction();
        session.update(user);
        session.getTransaction().commit();

        session.close();
        return user;
    }


    @Override
    public UserEntity updateProfileImage(UserEntity user, String imageURL) {
        Session session = HibernateUtil.getSessionFactory().openSession();
        user.setProfileImageUrl(imageURL);

        session.beginTransaction();
        session.update(user);
        session.getTransaction().commit();

        session.close();
        return user;
    }


    private String generateUserSessionStr(UserEntity user) {
        String sessionBeforeCrypt = String.valueOf(user.getId()) + System.currentTimeMillis();
        return DigestUtils.md5Hex(sessionBeforeCrypt);
    }
}
