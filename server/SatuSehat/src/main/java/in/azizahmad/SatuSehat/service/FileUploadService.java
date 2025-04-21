package in.azizahmad.SatuSehat.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.multipart.MultipartFile;

public interface FileUploadService {

    byte[] getFileImage(String imgUrl);

    String uploadFile(MultipartFile file);

    boolean deleteFile(String imgUrl);
}
