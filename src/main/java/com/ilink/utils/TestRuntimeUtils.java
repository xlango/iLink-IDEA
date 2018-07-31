package com.ilink.utils;

import org.junit.Test;

public class TestRuntimeUtils {
    /**
     *
     * @Title: testStartTomcat
     * @Description: windows 下启动tomcat
     * @throws Exception
     * @return void 返回类型
     * @throws
     */
    @Test
    public void testStartTomcat() throws Exception {
        String command = "cmd.exe /c start hello.bat";
        String dir = "D:\\Intellij IDEA\\Project\\iLink\\target\\iLink\\WEB-INF\\uploadfiles\\1\\";
        Process process = RuntimeUtils.exec(command, null, dir);
        int i = process.waitFor();
        System.exit(i);
    }

    /**
     *
     * @Title: testStopTomcat
     * @Description: windows 下关闭tomcat
     * @throws Exception
     *             设定文件
     * @return void 返回类型
     * @throws
     *//*
    @Test
    public void testStopTomcat() throws Exception {

        String command = "cmd.exe /c start  shutdown.bat";
        String dir = "D:\\ehcache\\apache-tomcat-6.0.35\\bin";
        Process process = RuntimeUtils.exec(command, null, dir);
        int i = process.waitFor();
        System.exit(i);
    }

    *//**
     *
     * @Title: testStartWas
     * @Description: linux 下 启动was服务
     * @throws Exception    设定文件
     * @return void    返回类型
     * @throws
     */
    @Test
    public void testStartWas() throws Exception{

        String dir = "D:\\Intellij IDEA\\Project\\iLink\\target\\iLink\\WEB-INF\\uploadfiles\\1\\";   //程序路径

        Process process =null;

        String command1 = "chmod 777 " + dir+"hello.sh";
        process = Runtime.getRuntime().exec(command1);
        process.waitFor();
        String command = "sh hello.sh";

        process = RuntimeUtils.exec(command, null, dir);
        int i = process.waitFor();
        System.exit(i);

    }

    /**
     *
     * @Title: testStopWas
     * @Description: linux 下停止was服务
     * @throws Exception    设定文件
     * @return void    返回类型
     * @throws
     *//*
    @Test
    public void testStopWas()throws Exception{
        String command = "sh stopServer.sh server1 -username admin password";
        String dir = "/usr/IBM/WebSphere/AppServer/profiles/AppSrv01/bin";
        Process process = RuntimeUtils.exec(command, null, dir);
        int i = process.waitFor();
        System.exit(i);
    }*/

}
