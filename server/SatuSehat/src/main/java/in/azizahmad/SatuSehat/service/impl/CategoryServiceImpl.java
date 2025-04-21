package in.azizahmad.SatuSehat.service.impl;

import in.azizahmad.SatuSehat.entity.CategoryEntity;
import in.azizahmad.SatuSehat.io.CategoryRequest;
import in.azizahmad.SatuSehat.io.CategoryResponse;
import in.azizahmad.SatuSehat.repository.CategoryRepository;
import in.azizahmad.SatuSehat.repository.ItemRepository;
import in.azizahmad.SatuSehat.service.CategoryService;
import in.azizahmad.SatuSehat.service.FileUploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    private final FileUploadService fileUploadService;

    private final ItemRepository itemRepository;

    @Override
    public CategoryResponse add(CategoryRequest request, MultipartFile file) {
        String imgUrl = fileUploadService.uploadFile(file);
        CategoryEntity newCategory = convertToEntity(request);
        newCategory.setImgUrl(imgUrl);
        newCategory = categoryRepository.save(newCategory);
        return convertToResponse(newCategory);
    }

    @Override
    public CategoryResponse update(String categoryId, CategoryRequest request, MultipartFile file) {
        CategoryEntity existingCategory = categoryRepository.findByCategoryId(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found: " + categoryId));
        String oldImgUrl = existingCategory.getImgUrl();
        if (request.getName() != null && !request.getName().isEmpty()) {
            existingCategory.setName(request.getName());
        }
        if (request.getDescription() != null && !request.getDescription().isEmpty()) {
            existingCategory.setDescription(request.getDescription());
        }
        if (request.getBgColor() != null && !request.getBgColor().isEmpty()) {
            existingCategory.setBgColor(request.getBgColor());
        }
        if (file != null && !file.isEmpty()) {
            String newImgUrl = fileUploadService.uploadFile(file);
            existingCategory.setImgUrl(newImgUrl);
            if (oldImgUrl != null && !oldImgUrl.isEmpty()) {
                fileUploadService.deleteFile(oldImgUrl);
            }
        }
        CategoryEntity updatedCategory = categoryRepository.save(existingCategory);
        return convertToResponse(updatedCategory);
    }

    @Override
    public List<CategoryResponse> read() {
        return categoryRepository.findAll()
                .stream()
                .map(categoryEntity -> convertToResponse(categoryEntity))
                .collect(Collectors.toList());
    }

    @Override
    public void delete(String categoryId) {
        CategoryEntity existingCategory = categoryRepository.findByCategoryId(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found: " +categoryId));
        fileUploadService.deleteFile(existingCategory.getImgUrl());
        categoryRepository.delete(existingCategory);
    }

    private CategoryResponse convertToResponse(CategoryEntity newCategory) {
        Integer itemsCount = itemRepository.countByCategoryId(newCategory.getId());
        return CategoryResponse.builder()
                .categoryId(newCategory.getCategoryId())
                .name(newCategory.getName())
                .description(newCategory.getDescription())
                .bgColor(newCategory.getBgColor())
                .imgUrl(fileUploadService.getFileImage(newCategory.getImgUrl()))
                .createdAt(newCategory.getCreatedAt())
                .updatedAt(newCategory.getUpdatedAt())
                .items(itemsCount)
                .build();
    }

    private CategoryEntity convertToEntity(CategoryRequest request) {
        return CategoryEntity.builder().categoryId(UUID.randomUUID().toString())
                .name(request.getName())
                .description(request.getDescription())
                .bgColor(request.getBgColor()).build();
    }
}
