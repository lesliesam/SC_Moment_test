package com.sc;

/**
 * @author <a href="mailto:lesliesam@hotmail.com"> Sam Yu </a>
 */


import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Entity;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

public class UserServiceTest {

    private WebTarget target;

    @Before
    public void setUp() throws Exception {


        Client c = ClientBuilder.newClient();

        target = c.target("127.0.0.1:8080/Moment/");

    }

    @Test
    public void signupWithDeviceTokenTest() throws Exception {

        Entity<ToDo> entity = Entity.entity(todo, MediaType.APPLICATION_FORM_URLENCODED);

        Response response = target.path("user/signupWithDeviceId").request().buildPost(entity)
                .invoke();


        Assert.assertNotNull(user);
    }
}
