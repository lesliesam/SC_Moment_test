package com.sc.interceptor;

import com.sc.GuiceInstance;
import com.sc.annotation.UserSession;
import com.sc.entity.UserEntity;
import com.sc.services.CacheClientImpl;
import org.aopalliance.intercept.MethodInterceptor;
import org.aopalliance.intercept.MethodInvocation;

import java.util.ArrayList;
import java.util.List;

/**
 * @author <a href="mailto:lesliesam@hotmail.com"> Sam Yu </a>
 */
public class UserSessionCacheInterceptor implements MethodInterceptor {
    public static final String STORE = "store";
    public static final String GET = "get";

    public UserSessionCacheInterceptor() {

    }

    public Object invoke(MethodInvocation invocation) throws Throwable {
        UserSession annotation = invocation.getMethod().getAnnotation(UserSession.class);
        CacheClientImpl cacheClient = GuiceInstance.getGuiceInjector().getInstance(CacheClientImpl.class);
        if (annotation.type().equals(GET)) {
            Object[] arguments = invocation.getArguments();
            String session = (String) arguments[0];

            UserEntity entity = cacheClient.getUserEntityWithSession(session);
            if (entity != null) {
                List<UserEntity> result = new ArrayList<UserEntity>();
                result.add(entity);
                return result;
            } else {
                return invocation.proceed();
            }
        } else if (annotation.type().equals(STORE)) {
            UserEntity entity = (UserEntity) invocation.proceed();
            cacheClient.storeUserEntityWithSession(entity.getSession(), entity);
            return entity;
        }

        return null;
    }
}
