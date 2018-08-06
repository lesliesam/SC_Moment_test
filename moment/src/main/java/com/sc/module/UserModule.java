package com.sc.module;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.sc.GuiceInstance;
import com.sc.dto.UserPublicInfo;
import com.sc.entity.*;
import com.sc.error.*;
import com.sc.services.UserServices;
import io.swagger.annotations.*;
import org.apache.commons.codec.digest.DigestUtils;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

/**
 * @author <a href="mailto:lesliesam@hotmail.com"> Sam Yu </a>
 */
@Api(value = "User service")
@Path("/user")
public class UserModule {

    @POST
    @Path("/signupWithDeviceId")
    @ApiOperation(value = "Sign up user or login user with device id", notes = "")
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.APPLICATION_JSON)
    public Response signupWithDeviceId(@FormParam("deviceName") String deviceName, @FormParam("deviceId") String deviceId) {
        Gson gson = new GsonBuilder().create();

        if (deviceName == null || deviceName.length() == 0) {
            return Response.status(Response.Status.BAD_REQUEST).entity(gson.toJson(new ServerErrorParamEmpty("deviceName"))).build();
        }

        if (deviceId == null || deviceId.length() == 0) {
            return Response.status(Response.Status.BAD_REQUEST).entity(gson.toJson(new ServerErrorParamEmpty("deviceId"))).build();
        }

        if (!deviceName.equals("ios") && !deviceName.equals("android")) {
            return Response.status(Response.Status.BAD_REQUEST).entity(gson.toJson(new ServerErrorParamInvalid("deviceName",
                    "ios or android"))).build();
        }

        UserServices services = GuiceInstance.getGuiceInjector().getInstance(UserServices.class);
        UserEntity user = services.userSignupWithDevice(deviceName, deviceId);

        return Response.status(Response.Status.OK).entity(gson.toJson(user)).build();
    }

    @POST
    @Path("/updateUserName")
    @ApiOperation(value ="Update user name", notes = "")
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateUserName(@HeaderParam("session") String session, @FormParam("userName") String userName) {
        Gson gson = new GsonBuilder().create();
        UserServices services = GuiceInstance.getGuiceInjector().getInstance(UserServices.class);
        List<UserEntity> list = services.getUserWithAuthSession(session);
        if (list.size() == 0) {
            return Response.status(Response.Status.UNAUTHORIZED).entity(gson.toJson(new ServerErrorAuthFailed())).build();
        }

        UserEntity user = list.get(0);
        services.updateUserName(user, userName);
        user.setUserName(userName);


        return Response.status(Response.Status.OK).entity(gson.toJson(user)).build();
    }
}
