package DACNTT.garage.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class CloudinaryService {

    private final Cloudinary cloudinary;

    @Value("${cloudinary.upload-folder:web_garage}")
    private String uploadFolder;

    public String uploadImage(MultipartFile file, String maPT) throws IOException {
        // Validate input
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File không được để trống");
        }

        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("File phải là ảnh (jpg, png, gif, webp)");
        }

        // Validate file size (max 5MB)
        long maxSize = 5 * 1024 * 1024; // 5MB
        if (file.getSize() > maxSize) {
            throw new IllegalArgumentException("Kích thước ảnh không được vượt quá 5MB");
        }

        try {
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", uploadFolder,
                            "public_id", maPT,
                            "overwrite", true,
                            "resource_type", "image",
                            "transformation", new com.cloudinary.Transformation()
                                    .width(800).height(600).crop("limit")
                                    .quality("auto")
                                    .fetchFormat("auto")
                    )
            );

            String imageUrl = (String) uploadResult.get("secure_url");
            log.info("Image uploaded successfully - URL: {}", imageUrl);
            return imageUrl;

        } catch (IOException e) {
            log.error("Error uploading image to Cloudinary: {}", e.getMessage(), e);
            throw new IOException("Lỗi khi upload ảnh lên Cloudinary: " + e.getMessage());
        }
    }

    public void deleteImage(String maPT) throws IOException {
        try {
            String publicId = uploadFolder + "/" + maPT;
            log.info("Deleting image from Cloudinary - publicId: {}", publicId);

            Map result = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            String resultStatus = (String) result.get("result");

            if ("ok".equals(resultStatus)) {
                log.info("Image deleted successfully - maPT: {}", maPT);
            } else if ("not found".equals(resultStatus)) {
                log.warn("Image not found in Cloudinary - maPT: {}", maPT);
            } else {
                log.warn("Unexpected result when deleting image - maPT: {}, result: {}", maPT, resultStatus);
            }

        } catch (IOException e) {
            log.error("Error deleting image from Cloudinary: {}", e.getMessage(), e);
            throw new IOException("Lỗi khi xóa ảnh từ Cloudinary: " + e.getMessage());
        }
    }

    public String updateImage(MultipartFile file, String maPT) throws IOException {
        return uploadImage(file, maPT);
    }
}