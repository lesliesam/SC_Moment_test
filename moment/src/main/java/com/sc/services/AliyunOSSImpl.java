package com.sc.services;

import com.aliyun.oss.OSSClient;
import com.aliyun.oss.model.PutObjectResult;

import javax.inject.Singleton;
import java.io.IOException;
import java.io.InputStream;

/**
 * @author <a href="mailto:lesliesam@hotmail.com"> Sam Yu </a>
 */

@Singleton
public class AliyunOSSImpl {

    private OSSClient mClient = null;

    private static final String endpoint = "http://oss-cn-shanghai.aliyuncs.com";
    private static final String accessKeyId = "LTAI47G9lzEvpJIw";
    private static final String accessKeySecret = "UM0SfnPbdsygH28OoK5I2fL49GPbbM";
    private static final String bucketName = "moment-images-test";

    private synchronized OSSClient getClient() {
        if (mClient == null) {
            mClient = new OSSClient(endpoint, accessKeyId, accessKeySecret);
        }
        return mClient;
    }

    public String uploadFile(String fileName, InputStream fileInput) {
        // Create a new OSSClient instance
        OSSClient client = getClient();

        PutObjectResult result = client.putObject(bucketName, fileName, fileInput);

        // Shutdown the instance to release any allocated resources
        client.shutdown();

        return result.getETag();
    }
}
