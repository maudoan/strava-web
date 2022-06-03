package vn.vnpt.stc.enterprise.jpa.agri.endpoints;

import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletResponse;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping("/api/file")
public class FileEndpoint {
    public static final Integer BYTE = 1024;

    @RequestMapping(path = "/download", method = RequestMethod.GET)
    public void download(HttpServletResponse response, @RequestParam("filePath") String filePath) throws IOException {
        String baseDir = System.getProperty("user.dir");
        InputStream input = new FileInputStream(baseDir + filePath);
        File file = new File(baseDir + filePath);
        String name = "attachment;filename=" + file.getName();
        response.addHeader("Content-disposition", name);
        response.setContentType("application/ms-excel");
        IOUtils.copy(input, response.getOutputStream());
        response.flushBuffer();
    }

    @RequestMapping(path = "/template", method = RequestMethod.GET)
    public void getTemplate(HttpServletResponse response, @RequestParam("fileName") String fileName) throws IOException{
        ClassLoader classLoader = getClass().getClassLoader();
        InputStream template = classLoader.getResourceAsStream("/template/" + fileName);
        String name = "attachment;filename=" + fileName;
        response.addHeader("Content-disposition", name);
        response.setContentType("application/ms-excel");
        IOUtils.copy(template, response.getOutputStream());
        response.flushBuffer();
    }

    @RequestMapping(path = "/upload", method = RequestMethod.POST, produces = "application/json")
    @ResponseBody
    public Map<String, String> uploadFileHandler(@RequestParam("file") MultipartFile file, @RequestParam("type") Integer type) {
        // type: 1 image, 2 other
        Map<String, String> result = new HashMap<>();

        String fileName = file.getOriginalFilename();
        int pos = fileName.lastIndexOf('.');
        String nameFile = fileName.substring(0, pos);
        String extension = fileName.substring(pos+1);
        String timeStamp = getCurrentDateTime();
        String baseDir = System.getProperty("user.dir");
        String resource = baseDir + "/attachment/";

        try {
            createDirectory(resource);
            // upload excel ra folder riêng
            if(type != null && type == 1){
                resource += "images/";
            } else resource += "uploads/";

            createDirectory(resource);

            fileName = nameFile + "_" + timeStamp + "." + extension;
            File convFile = new File(resource + fileName);

            while(convFile.exists()) {
                timeStamp = getCurrentDateTime();
                fileName = nameFile + "_" + timeStamp + "." + extension;
                convFile = new File(resource + fileName);
                break;
            }

            file.transferTo(convFile);
            // resize image đối với file lớn hơn 500kb
            boolean checkResize = (float) convFile.length() / (BYTE * BYTE) >= 0.5;
            if(extension.toLowerCase().matches("jpg|jpeg|png|gif") && checkResize){
                // là ảnh thì resize
                fileName = renameAndSizeImage(resource, fileName);
                // xooá ảnh cũ
                convFile.delete();
            }

        } catch (IOException e){
            e.printStackTrace();
        }

        result.put("fileName", fileName);
        return result;
    }

    private String renameAndSizeImage(String resource, String fileName){
        try {
            BufferedImage originalImage = ImageIO.read(new File(resource + fileName));//change path to where file is located
            int type = BufferedImage.TYPE_INT_RGB; // type để resize
            float scaleX = (float) 650 / originalImage.getWidth();
            float scaleY = (float) 650 / originalImage.getHeight();
            float scale = Math.min(scaleX, scaleY);
            int w = Math.round(originalImage.getWidth() * scale);
            int h = Math.round(originalImage.getHeight() * scale);

            BufferedImage resizeImageJpg = resizeImage(originalImage, type, w, h);
            fileName = "resize_" + fileName;
            ImageIO.write(resizeImageJpg, "jpg", new File(resource + fileName));
        } catch (IOException e) {
            System.out.println(e.getMessage());
        }

        return fileName;
    }

    private static BufferedImage resizeImage(BufferedImage originalImage, int type, int IMG_WIDTH, int IMG_HEIGHT) {
        BufferedImage resizedImage = new BufferedImage(IMG_WIDTH, IMG_HEIGHT, type);
        Graphics2D g = resizedImage.createGraphics();
        g.drawImage(originalImage, 0, 0, IMG_WIDTH, IMG_HEIGHT, null);
        g.dispose();

        return resizedImage;
    }

    @RequestMapping(path = "/deleteFileUploaded", method = RequestMethod.DELETE)
    public Map<String, String> deleteFileUploaded(@RequestParam("fileName") String fileName) {
        Map<String, String> result = new HashMap<>();
        String baseDir = System.getProperty("user.dir");
        String resource = baseDir + "/attachment/images/";
        File file = new File(resource + fileName);

        if(!file.exists()) return null;

        try {
            file.delete();
        } catch (Exception e) {
            return null;
        }

        result.put("fileName", fileName);
        return result;
    }

    @RequestMapping(path = "/sample", method = RequestMethod.GET)
    public void getSample(HttpServletResponse response, @RequestParam("fileName") String fileName) throws IOException{
        ClassLoader classLoader = getClass().getClassLoader();
        InputStream template = classLoader.getResourceAsStream("template/export/" + fileName);
        String name = "attachment;filename=" + fileName;
        response.addHeader("Content-disposition", name);
        response.setContentType("application/ms-excel");
        IOUtils.copy(template, response.getOutputStream());
        response.flushBuffer();
    }

    private static String getCurrentDateTime(){
        return  new SimpleDateFormat("ddMMyyyyHHmmss").format(Calendar.getInstance(TimeZone.getTimeZone("Asia/Ho_Chi_Minh")).getTime());
    }

    private static void createDirectory(String path){
        File theDir = new File(path);
        if (!theDir.exists()) {
            try{
                theDir.mkdir();
            }
            catch(SecurityException se){
                se.printStackTrace();
            }
        }
    }

    @RequestMapping(path = "/checkExists", method = RequestMethod.GET)
    public String checkExists(@RequestParam("fileNames") Set<String> fileNames) {
        String baseDir = System.getProperty("user.dir");
        String resource = baseDir + "/attachment/uploads";
        String fileExists = null;

        if(fileNames == null || fileNames.isEmpty()) return fileExists;
        for (String fileName : fileNames){
            File convFile = new File(resource + fileName);

            if(convFile.exists()){
                fileExists = fileName;
                break;
            }
        }

        return fileExists;
    }
}
