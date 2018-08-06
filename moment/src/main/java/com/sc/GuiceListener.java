package com.sc;

import com.google.inject.Guice;
import com.google.inject.Injector;
import com.google.inject.Singleton;
import com.google.inject.matcher.Matchers;
import com.google.inject.servlet.GuiceServletContextListener;
import com.google.inject.servlet.ServletModule;
import com.sc.annotation.CacheEnabled;
import com.sc.annotation.UserSession;
import com.sc.interceptor.UserSessionCacheInterceptor;
import com.sc.services.*;
import com.sc.services.AliyunOSSImpl;

/**
 * @author <a href="mailto:lesliesam@hotmail.com"> Sam Yu </a>
 */
public class GuiceListener extends GuiceServletContextListener {

    @Override
    protected Injector getInjector() {
        Injector injector = Guice.createInjector(new ServletModule() {
            // Configure your IOC
            @Override
            protected void configureServlets() {
                bind(UserServices.class).to(UserServicesImpl.class);
                bind(MomentServices.class).to(MomentServicesImpl.class);

                bind(CacheClientImpl.class).in(Singleton.class);
                bind(AliyunOSSImpl.class).in(Singleton.class);

                bindInterceptor(Matchers.any(),
                        Matchers.annotatedWith(CacheEnabled.class).and(Matchers.annotatedWith(UserSession.class)),
                        new UserSessionCacheInterceptor());
            }
        });
        GuiceInstance.setGuiceInjector(injector);
        return injector;
    }
}
