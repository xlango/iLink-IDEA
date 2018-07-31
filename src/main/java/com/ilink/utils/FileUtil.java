package com.ilink.utils;

import com.ilink.controller.FileUploadController;
import org.apache.log4j.Logger;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;

public class FileUtil {

    private static Logger logger = Logger.getLogger(FileUploadController.class);

    /**
     * 上传单个文件
     * @param request
     * @param file
     * @param path
     * @return 上传成功返回true，上传失败返回false
     */
    public static Boolean  uploadOne(HttpServletRequest request,MultipartFile file,String path) {
       try {
           logger.info("上传路径："+path);
           String fileName = file.getOriginalFilename();
           File dir = new File(path, fileName);
           if (!dir.exists()) {
               dir.mkdirs(); //mkdirs()建立多级文件目录，mkdir()只能建立一级文件目录
           }
           //MultipartFile自带的解析方法
           file.transferTo(dir);
           return true;
       }catch (Exception e){
           return false;
       }

    }

/*    public static  Boolean download() {

    }*/
}
