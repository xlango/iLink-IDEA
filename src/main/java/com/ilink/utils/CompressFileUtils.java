package com.ilink.utils;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Enumeration;
import org.apache.tools.zip.ZipEntry;
import org.apache.tools.zip.ZipFile;

import com.github.junrar.Archive;
import com.github.junrar.rarfile.FileHeader;

public class CompressFileUtils {
    /**
     * 解压到指定目录
     * @param zipPath
     * @param descDir
     * @author xyl
     * */
    public static Boolean unZipFiles(String zipPath,String descDir){
        return unZipFiles(new File(zipPath), descDir);
    }
    /**
     * 解压文件到指定目录
     * @param zipFile
     * @param descDir
     * @author xyl
     */
    @SuppressWarnings("rawtypes")
    public static Boolean unZipFiles(File zipFile,String descDir){
        try {
            File pathFile = new File(descDir);
            if(!pathFile.exists()){
                pathFile.mkdirs();
            }
            ZipFile zip = new ZipFile(zipFile);
            for(Enumeration entries = zip.getEntries();entries.hasMoreElements();){
                ZipEntry entry = (ZipEntry)entries.nextElement();
                String zipEntryName = entry.getName();
                InputStream in = zip.getInputStream(entry);
                String outPath = (descDir+zipEntryName).replaceAll("\\*", "/");;
                //判断路径是否存在,不存在则创建文件路径
                File file = new File(outPath.substring(0, outPath.lastIndexOf('/')));
                if(!file.exists()){
                    file.mkdirs();
                }
                //判断文件全路径是否为文件夹,如果是上面已经上传,不需要解压
                if(new File(outPath).isDirectory()){
                    continue;
                }
                //输出文件路径信息
                System.out.println(outPath);

                OutputStream out = new FileOutputStream(outPath);
                byte[] buf1 = new byte[1024];
                int len;
                while((len=in.read(buf1))>0){
                    out.write(buf1,0,len);
                }
                in.close();
                out.close();
            }
            System.out.println("******************解压完毕********************");
            return true;
        }catch (Exception e){
            return false;
        }

    }

    /**
     * 根据原始rar路径，解压到指定文件夹下.
     * @param srcRarPath 原始rar路径
     * @param dstDirectoryPath 解压到的文件夹
     */
    public static Boolean unRarFile(String srcRarPath, String dstDirectoryPath) {
        if (!srcRarPath.toLowerCase().endsWith(".rar")) {
            System.out.println("非rar文件！");
            return false;
        }
        File dstDiretory = new File(dstDirectoryPath);
        if (!dstDiretory.exists()) {// 目标目录不存在时，创建该文件夹
            dstDiretory.mkdirs();
        }
        Archive a = null;
        try {
            a = new Archive(new File(srcRarPath));
            if (a != null) {
                a.getMainHeader().print(); // 打印文件信息.
                FileHeader fh = a.nextFileHeader();
                while (fh != null) {
                    if (fh.isDirectory()) { // 文件夹
                        File fol = new File(dstDirectoryPath + File.separator
                                + fh.getFileNameString());
                        fol.mkdirs();
                    } else { // 文件
                        File out = new File(dstDirectoryPath + File.separator
                                + fh.getFileNameString().trim());
                        //System.out.println(out.getAbsolutePath());
                        try {// 之所以这么写try，是因为万一这里面有了异常，不影响继续解压.
                            if (!out.exists()) {
                                if (!out.getParentFile().exists()) {// 相对路径可能多级，可能需要创建父目录.
                                    out.getParentFile().mkdirs();
                                }
                                out.createNewFile();
                            }
                            FileOutputStream os = new FileOutputStream(out);
                            a.extractFile(fh, os);
                            os.close();
                        } catch (Exception ex) {
                            ex.printStackTrace();
                        }
                    }
                    fh = a.nextFileHeader();
                }
                a.close();
            }
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}

