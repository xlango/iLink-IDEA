package com.ilink.utils;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;

public class RuntimeUtils {
    private static Logger logger = Logger.getLogger(RuntimeUtils.class);

    public RuntimeUtils() {
    }

    /**
     * java执行命令行方法，并显示运行结果
     * @param command
     * @param envp
     * @param dir
     * @return
     * @throws IOException
     */
    public static Process exec(String command, String envp, String dir) throws IOException {
        logger.info("开始执行命令行：" + command);
        String regex = "\\s+";
        String[] args = null;
        String[] envps = null;
        if (!StringUtils.isEmpty(command)) {
            args = command.split(regex);
        }

        if (!StringUtils.isEmpty(envp)) {
            envps = envp.split(regex);
        }

        Process process = Runtime.getRuntime().exec(args, envps, new File(dir));
        try{
            BufferedReader br = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuffer sb = new StringBuffer();

            String line;
            while((line = br.readLine()) != null) {
                sb.append(line).append("\n");
            }

            String result = sb.toString();
            logger.info("执行结果打印："+result);
        }catch (Exception e){
            e.printStackTrace();
        }

        return process;
    }
}
