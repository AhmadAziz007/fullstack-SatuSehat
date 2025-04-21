package in.azizahmad.SatuSehat.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import in.azizahmad.SatuSehat.io.CategoryRequest;
import in.azizahmad.SatuSehat.io.CategoryResponse;
import in.azizahmad.SatuSehat.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/categories")
@CrossOrigin("*")
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CategoryResponse addCategory(@RequestPart("category") String categoryString,
                                        @RequestPart("file")MultipartFile file) {
        ObjectMapper objectMapper = new ObjectMapper();
        CategoryRequest request = null;
        try {
            request = objectMapper.readValue(categoryString, CategoryRequest.class);
            return categoryService.add(request, file);
        } catch (JsonProcessingException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Exeception occred while parsing the json: " + ex.getMessage());
        }
    }

    @PutMapping("/{categoryId}")
    public CategoryResponse updateCategory(
            @PathVariable String categoryId,
            @RequestPart(value = "category", required = false) String categoryString,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            System.out.println("Received categoryString: " + categoryString);
            CategoryRequest request = null;
            if (categoryString != null) {
                request = objectMapper.readValue(categoryString, CategoryRequest.class);
            } else {
                request = new CategoryRequest();
            }
            return categoryService.update(categoryId, request, file);
        } catch (JsonProcessingException ex) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Exception occurred while parsing the json: " + ex.getMessage());
        }
    }

    @GetMapping
    public List<CategoryResponse> fetchCategories() {
        return categoryService.read();
    }

    @DeleteMapping("/{categoryId}")
    public void remove(@PathVariable String categoryId) {
        try {
            categoryService.delete(categoryId);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }
}
