package in.azizahmad.SatuSehat.service.impl;

import in.azizahmad.SatuSehat.entity.CategoryEntity;
import in.azizahmad.SatuSehat.entity.ItemEntity;
import in.azizahmad.SatuSehat.io.ItemRequest;
import in.azizahmad.SatuSehat.io.ItemResponse;
import in.azizahmad.SatuSehat.repository.CategoryRepository;
import in.azizahmad.SatuSehat.repository.ItemRepository;
import in.azizahmad.SatuSehat.service.FileUploadService;
import in.azizahmad.SatuSehat.service.ItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ItemServiceImpl implements ItemService {

    private final FileUploadService fileUploadService;
    private final CategoryRepository categoryRepository;
    private final ItemRepository itemRepository;

    @Override
    public ItemResponse add(ItemRequest request, MultipartFile file) {
        String imgUrl = fileUploadService.uploadFile(file);
        ItemEntity newItem = convertToEntity(request);
        CategoryEntity existingCategory = categoryRepository.findByCategoryId(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found: "+request.getCategoryId()));
        newItem.setCategory(existingCategory);
        newItem.setImgUrl(imgUrl);
        newItem = itemRepository.save(newItem);
        return convertToResponse(newItem);
    }

    private ItemResponse convertToResponse(ItemEntity newItem) {
        return ItemResponse.builder()
                .itemId(newItem.getItemId())
                .categoryId(newItem.getCategory().getCategoryId())
                .name(newItem.getName())
                .description(newItem.getDescription())
                .price(newItem.getPrice())
                .imgUrl(fileUploadService.getFileImage(newItem.getImgUrl()))
                .categoryName(newItem.getCategory().getName())
                .createdAt(newItem.getCreatedAt())
                .updatedAt(newItem.getUpdatedAt())
                .build();
    }

    private ItemEntity convertToEntity(ItemRequest request) {
        return ItemEntity.builder()
                .itemId(UUID.randomUUID().toString())
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .build();
    }

    @Override
    public List<ItemResponse> fetchItems() {
        return itemRepository.findAll()
                .stream()
                .map(itemEntity -> convertToResponse(itemEntity))
                .collect(Collectors.toList());
    }

    @Override
    public void deleteItem(String itemId) {
        ItemEntity existingItem = itemRepository.findByItemId(itemId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Item not found: "+ itemId));

        try {
            fileUploadService.deleteFile(existingItem.getImgUrl());
            itemRepository.delete(existingItem);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to delete item: " + e.getMessage());
        }
    }

    @Override
    public ItemResponse updateItem(String itemId, ItemRequest request, MultipartFile file) {
        ItemEntity existingItem = itemRepository.findByItemId(itemId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Item not found"));

        String newImgUrl = existingItem.getImgUrl();
        if (file != null && !file.isEmpty()) {
            fileUploadService.deleteFile(existingItem.getImgUrl());
            newImgUrl = fileUploadService.uploadFile(file);
        }

        CategoryEntity newCategory = existingItem.getCategory();
        if (!request.getCategoryId().equals(existingItem.getCategory().getCategoryId())) {
            newCategory = categoryRepository.findByCategoryId(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
        }
        ItemEntity updatedItem = ItemEntity.builder()
                .id(existingItem.getId())
                .itemId(existingItem.getItemId())
                .name(request.getName())
                .price(request.getPrice())
                .description(request.getDescription())
                .imgUrl(newImgUrl)
                .category(newCategory)
                .createdAt(existingItem.getCreatedAt())
                .build();

        updatedItem = itemRepository.save(updatedItem);
        return convertToResponse(updatedItem);
    }
}
