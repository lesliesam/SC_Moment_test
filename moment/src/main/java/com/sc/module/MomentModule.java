package com.sc.module;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.sc.GuiceInstance;
import com.sc.entity.MomentEntity;
import com.sc.entity.UserEntity;
import com.sc.error.ServerErrorAuthFailed;
import com.sc.error.ServerErrorParamEmpty;
import com.sc.error.ServerErrorParamInvalid;
import com.sc.services.MomentServices;
import com.sc.services.UserServices;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

/**
 * @author <a href="mailto:lesliesam@hotmail.com"> Sam Yu </a>
 */

@Api(value = "User service")
@Path("/moment")
public class MomentModule {

    @POST
    @Path("/post")
    @ApiOperation(value = "post new moment", notes = "")
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.APPLICATION_JSON)
    public Response postMoment(@HeaderParam("session") String session,
                                       @FormParam("text") String text, @FormParam("images") String images) {
        Gson gson = new GsonBuilder().create();

        if (text == null || text.length() == 0) {
            return Response.status(Response.Status.BAD_REQUEST).entity(gson.toJson(new ServerErrorParamEmpty("moment text"))).build();
        }

        // TODO replace by JWT session info check.
        UserServices services = GuiceInstance.getGuiceInjector().getInstance(UserServices.class);
        List<UserEntity> list = services.getUserWithAuthSession(session);
        if (list.size() == 0) {
            return Response.status(Response.Status.UNAUTHORIZED).entity(gson.toJson(new ServerErrorAuthFailed())).build();
        }

        UserEntity user = list.get(0);

        MomentServices momentServices = GuiceInstance.getGuiceInjector().getInstance(MomentServices.class);
        MomentEntity momentEntity = momentServices.postMoment(user, text, images);

        return Response.status(Response.Status.OK).entity(gson.toJson(momentEntity)).build();
    }

    @GET
    @Path("/get")
    public Response getMoments(@HeaderParam("session") String session,
                               @QueryParam("page") @DefaultValue("0") Integer page,
                               @QueryParam("size") @DefaultValue("10") Integer size) {
        Gson gson = new GsonBuilder().create();

        // TODO replace by JWT session info check.
        UserServices services = GuiceInstance.getGuiceInjector().getInstance(UserServices.class);
        List<UserEntity> list = services.getUserWithAuthSession(session);
        if (list.size() == 0) {
            return Response.status(Response.Status.UNAUTHORIZED).entity(gson.toJson(new ServerErrorAuthFailed())).build();
        }

        UserEntity user = list.get(0);

        MomentServices momentServices = GuiceInstance.getGuiceInjector().getInstance(MomentServices.class);
        List<MomentEntity> moments = momentServices.getMoments(user, page, size);

        return Response.status(Response.Status.OK).entity(gson.toJson(moments)).build();
    }
}
