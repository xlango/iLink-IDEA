package com.ilink.utils;


import org.apache.commons.vfs2.FilesCache;
import org.apache.log4j.Logger;
import org.springframework.util.ResourceUtils;

import java.io.*;
import java.net.URL;
import java.security.Key;
import java.security.SecureRandom;

import javax.crypto.*;
import javax.crypto.spec.DESKeySpec;
import javax.crypto.spec.SecretKeySpec;

public class DesUtil  {
    private static Logger logger = Logger.getLogger(DesUtil.class);
    private static String keyfileName = "DesKey.txt";
    /**
     * <p> DES解密文件
     * @param file 需要解密的文件
     * @param dest 解密后的文件
     * @throws Exception
     */
    public static Boolean decrypt(String file, String dest){
        try {
            Cipher cipher = Cipher.getInstance("DES");
            cipher.init(Cipher.DECRYPT_MODE, getKey());
            InputStream is = new FileInputStream(file);
            OutputStream out = new FileOutputStream(dest);
            CipherOutputStream cos = new CipherOutputStream(out, cipher);
            byte[] buffer = new byte[1024];
            int r;
            while ((r = is.read(buffer)) >= 0) {
                cos.write(buffer, 0, r);
            }
            cos.close();
            out.close();
            is.close();
            return true;
        }catch (Exception e){
          return false;
        }
    }
    /**
     * <p>DES加密文件
     * @param file 源文件
     * @param destFile 加密后的文件
     * @throws Exception
     */
    public static void encrypt(String file, String destFile) throws Exception {
        Cipher cipher = Cipher.getInstance("DES");
        cipher.init(Cipher.ENCRYPT_MODE, getKey());
        InputStream is = new FileInputStream(file);
        OutputStream out = new FileOutputStream(destFile);
        CipherInputStream cis = new CipherInputStream(is, cipher);
        byte[] buffer = new byte[1024];
        int r;
        while ((r = cis.read(buffer)) > 0) {
            out.write(buffer, 0, r);
        }
        cis.close();
        is.close();
        out.close();
    }

    /**
     * 配置文件中读取数组转换为Key
     * @return
     */
    private static Key getKey() {
        Key kp = null;
        byte[] keyByte=null;
        String strByte=null;
        try {
            logger.info("密钥文件："+DesUtil.class.getClassLoader().getResource("DesKey.txt").toURI().getPath());
            String fileName =DesUtil.class.getClassLoader().getResource("DesKey.txt").toURI().getPath();
            InputStreamReader isr = new InputStreamReader(new FileInputStream(fileName), "utf-8");
            BufferedReader br = new BufferedReader(isr);
            strByte=br.readLine();
            keyByte=strByte.getBytes();//将String变成byte[]

            kp=autoDesKey(keyByte);
            br.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return kp;
    }

    /**
     * <p> 随机生成KEY，并保存
     */
    public static void saveDesKey(){
        try {
            SecureRandom sr = new SecureRandom();
            //为我们选择的DES算法生成一个KeyGenerator对象
            KeyGenerator kg = KeyGenerator.getInstance ("DES");
            kg.init(sr);//56 key size
            FileOutputStream fos = new FileOutputStream(keyfileName);
            ObjectOutputStream oos = new ObjectOutputStream(fos);
            //生成密钥
            Key key = kg.generateKey();
            byte[] byteKey=key.getEncoded();
            for (int i=0;i<byteKey.length;i++) {
                logger.info(i+":" +byteKey[i]);
            }

            oos.writeObject(key);
            oos.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    /**
     * 将数组写入配置文件
     */
    public static void saveByte(byte[] keyByte){
        try {
            FileOutputStream fos = new FileOutputStream(keyfileName);
            ObjectOutputStream oos = new ObjectOutputStream(fos);

            oos.writeObject(keyByte);
            oos.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 根据数组生成Key
     * @param keyByte
     */
    public static Key autoDesKey(byte[] keyByte){
        try {
            //数组转换为Key对象
            DESKeySpec desKeySpec=new DESKeySpec(keyByte);
            SecretKeyFactory factory=SecretKeyFactory.getInstance("DES");
            Key key=factory.generateSecret(desKeySpec);
           return key;
        } catch (Exception e) {
            return  null;
        }
    }

    /*public static void main(String[] args) throws Exception {
        //DesUtil.saveDesKey();
        //DesUtil.encrypt("D:\\tmp\\1.zip", "D:\\tmp\\2.zip");
        //DesUtil.decrypt("D:\\tmp\\2.zip","D:\\tmp\\3.zip");
        //desinput.txt 经过加密和解密后生成的 desinput2.txt 应该与源文件一样


        byte[] a={-1,20,-13,40,70,50,-111,39};
        //DesUtil.saveByte(a);
        //DesUtil.encrypt("D:\\tmp\\3.zip", "D:\\tmp\\1.zip");
        DesUtil.decrypt("D:\\tmp\\1.zip","D:\\tmp\\4.zip");


    }*/

   /* public static void main(String[] args) throws FileNotFoundException, UnsupportedEncodingException {

        String path = DesUtil.class.getClassLoader().getResource("DesKey.txt").getFile();
        System.out.println(new String(path.getBytes(),"utf8"));

        File file = new File(path);

        BufferedInputStream bufferedInputStream = new BufferedInputStream(new FileInputStream(file));



    }*/


}
