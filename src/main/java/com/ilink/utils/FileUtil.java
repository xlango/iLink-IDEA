package com.ilink.utils;

import com.ilink.controller.FileUploadController;
import org.apache.log4j.Logger;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.URLEncoder;

public class FileUtil {

    private static Logger logger = Logger.getLogger(FileUploadController.class);

    /**
     * 上传单个文件
     * @param file
     * @param path
     * @return 上传成功返回true，上传失败返回false
     */
    public static Boolean  upload(MultipartFile file,String path) {
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

    public static  Boolean download(HttpServletResponse response, String filePath, String fileName) {
        try {
            //获取输入流
            InputStream bis = new BufferedInputStream(new FileInputStream(new File(filePath)));
            //假如以中文名下载的话
            String filename = fileName;
            //转码，免得文件名中文乱码
            filename = URLEncoder.encode(filename, "UTF-8");
            //设置文件下载头
            response.addHeader("Content-Disposition", "attachment;filename=" + filename);
            //1.设置文件ContentType类型，这样设置，会自动判断下载文件类型
            response.setContentType("multipart/form-data");
            BufferedOutputStream out = new BufferedOutputStream(response.getOutputStream());
            int len = 0;
            while ((len = bis.read()) != -1) {
                out.write(len);
                out.flush();
            }
            out.close();
            return true;
        }catch (Exception e){
            return false;
        }
    }
}
