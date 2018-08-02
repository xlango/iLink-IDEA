package com.ilink.controller;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.net.URLEncoder;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.ilink.utils.CompressFileUtils;
import com.ilink.utils.DesUtil;
import com.ilink.utils.FileUtil;
import com.ilink.utils.RuntimeUtils;
import io.swagger.annotations.ApiOperation;
import org.apache.log4j.Logger;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import io.swagger.annotations.Api;

@RestController // @RestController =@Controller+@ResponseBody
@RequestMapping("/file")
@Api(value = "文件管理接口", tags = {"文件管理接口"})
public class FileUploadController {

    private static Logger logger = Logger.getLogger(FileUploadController.class);

    @RequestMapping("/testView")
    @ApiOperation(value = "页面跳转", httpMethod = "GET", notes = "页面跳转")
    public ModelAndView rdTest() {
        ModelAndView mv = new ModelAndView("index");
        return mv;
    }

    @RequestMapping("/download")
    @ApiOperation(value = "跳转至下载页面", httpMethod = "GET", notes = "跳转至下载页面")
    public ModelAndView download() {
        ModelAndView mv = new ModelAndView("download");
        return mv;
    }

    /**
     * 上传文件自动解压，命令行执行相关文件
     *
     * @param request
     * @param description
     * @param file
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/upload", method = RequestMethod.POST)
    @ApiOperation(value = "上传单个文件", httpMethod = "POST", notes = "上传单个文件")
    public String upload(HttpServletRequest request,
                         @RequestParam("description") String description,
                         @RequestParam("file") MultipartFile file) throws Exception {
        logger.info(description);
        String path = request.getSession().getServletContext().getRealPath("/WEB-INF/uploadfiles/");
        String fileName = file.getOriginalFilename();

        //上传文件
        Boolean uploadTage = FileUtil.upload(file, path);

        if (uploadTage) {
            String a[] = fileName.split("\\.");
            String saveUnZipPath = a[0];

            //解密文件
            Boolean decryptTag = DesUtil.decrypt(path + fileName, path + "2." + a[1]);
            if (decryptTag) {

                //解压缩
                Boolean compressTage = false;
                if (a[1].toLowerCase().equals("zip")) {
                    compressTage = CompressFileUtils.unZipFiles(path + "2." + a[1], path);
                } else if (a[1].toLowerCase().equals("rar")) {
                    compressTage = CompressFileUtils.unRarFile(path + "2." + a[1], path);
                } else {
                    return "file type error";
                }

                //执行命令
                if (compressTage) {
                    Process process = null;
                /*String command = "sh " + path + saveUnZipPath + "/hello.sh";
                String command1 = "chmod 777 " + path + saveUnZipPath+"hello.sh";
                process = Runtime.getRuntime().exec(command1);
                process.waitFor();*/
                    String command = "cmd.exe /c start hello.bat";
                    process = RuntimeUtils.exec(command, (String) null, path + saveUnZipPath);
                    int i = process.waitFor();
                    logger.info(i);
                } else {
                    return "compress fail";
                }
            } else {
                return "decrypt fail";
            }

            return "success";
        } else {
            return "upload fail";
        }
    }


    /**
     * 文件下载功能
     *
     * @param request
     * @param response
     * @throws Exception
     */
    @RequestMapping(value = "/down", method = RequestMethod.GET)
    @ApiOperation(value = "下载文件", httpMethod = "GET", notes = "下载文件")
    public void down(HttpServletRequest request, HttpServletResponse response
            , @RequestParam("downfilename") String downfilename) throws Exception {
        logger.info("下载文件名：" + downfilename);
        //模拟文件，myfile.txt为需要下载的文件  
        String filePath = request.getSession().getServletContext().getRealPath("/WEB-INF/uploadfiles/") + downfilename;

        //文件下载
        FileUtil.download(response, filePath, downfilename);
    }


    //多文件上传
    @RequestMapping(value = "/filesUpload", method = RequestMethod.POST)
    @ApiOperation(value = "多个文件上传", httpMethod = "POST", notes = "多个文件上传")
    public String filesUpload(HttpServletRequest request,
                              @RequestParam("files") MultipartFile[] files) throws Exception {
        if (files != null && files.length > 0) {
            for (int i = 0; i < files.length; i++) {
                MultipartFile file = files[i];
                String path = request.getSession().getServletContext().getRealPath("/WEB-INF/uploadfiles/");
                logger.info(path);
                FileUtil.upload(file, path);
            }
        }

        return "success";

    }

    //上载FTP服务器
    /*@RequestMapping("/uploadFTP")
    public String save(HttpServletRequest request, @RequestParam("uploadFile") MultipartFile[] uploadFile) {
        StringBuffer sb = new StringBuffer();
        String basePath = request.getSession().getServletContext().getRealPath("/WEB-INF/uploadfiles/");//设置服务器中文件保存的根目录
        Date now = new Date();
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd");
        String filePath = dateFormat.format(now); //根据当前时间设置文件保存的子目录
        if (uploadFile != null && uploadFile.length > 0) {
            if (!ftp.uploadFile(uploadFile, basePath, filePath)) {
                return "error";
            }
            for (int i = 0; i < uploadFile.length; i++) {
                String fileName;
                fileName = new String(uploadFile[i].getOriginalFilename());
                if (i != 0) {
                    sb.append(",");
                }
                sb.append(fileName);//用逗号连接文件名存入数据库
            }

        }
        *//**...*//*//存入数据库处理
        return "error";
    }*/
}
