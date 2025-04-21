package in.azizahmad.SatuSehat.service;

import in.azizahmad.SatuSehat.io.CategoryRequest;
import in.azizahmad.SatuSehat.io.CategoryResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface CategoryService {
    CategoryResponse add(CategoryRequest request, MultipartFile file);

    List<CategoryResponse> read();

    void delete(String categoryId);

    CategoryResponse update(String categoryId, CategoryRequest request, MultipartFile file);

}
