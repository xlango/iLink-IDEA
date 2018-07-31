package com.ilink.utils;

import org.apache.commons.lang.StringUtils;

import java.io.File;
import java.io.IOException;

public class RuntimeUtils {
    /**
     *
     * @Title: exec
     * @Description: 简化执行命令行
     * @param  command 命令行
     * @param  envp 环境变量
     * @param  dir  路径
     * @return Process    返回类型
     * @throws IOException
     */
    public static Process exec(String command, String envp, String dir)
            throws IOException {
        String regex = "\\s+";
        String args[] = null;
        String envps[] = null;
        if (!StringUtils.isEmpty(command)) {
            args = command.split(regex);
        }

        if (!StringUtils.isEmpty(envp)) {
            envps = envp.split(regex);
        }

        return Runtime.getRuntime().exec(args, envps, new File(dir));

    }
}
