# SC_Moment_test

This is the answer project to "SC's Program test - Moment".

The [moment](https://github.com/lesliesam/SC_Moment_test/tree/master/moment) folder contains the server part while the [moment_client](https://github.com/lesliesam/SC_Moment_test/tree/master/moment_client) contains the client part.

# Moment

It is a maven java project. All the dependencies and setup are defined in the pom.xml.

To launch the project container, please run the docker-compose.xml file under the docker folder which will set up the micro services listed below:

- userService: a tomcat based webapp which serves user APIs, user signup, login, update name etc.
- imageService: a tomcat based webapp which servers image uploading APIs. Note, the image is stored on Aliyun CS.
- momentService: a tomcat based webapp which servers moment uploading & listing APIs
- db: mysql database, the dump files can be used to restore the db structure and data
- mongodb: ideally, it can be used to store user images. But it is not implemented in this project since Aliyun CS is used instead
- memcahed: the cache service used globally to store user sessions.
- jenkins: the CI system for setting up server builds and developemnt.


# Moment Client

It is a React Native based project which can run on both iOS and Android devices. In detail, it is based on Redux which is a state container and MVC framework.

To launch the project on iOS, please run.
```
cd moment_client
react-native run-ios
```

The following functions are implemented:
- Users auto registration with device ID and the mapping of device ID and user will be created. Later on, users can auto login with that account. This is more like a guest access feature, we can add email/phone login later.
- Users can change their user name
- Users can enter their moment page and see all the posts. Currently, there is no friend relationship being created, thus users can see all the posts.
- Users can view the post images in fullscreen mode by click the post.
- Users can upload new post by adding content and upload images.
