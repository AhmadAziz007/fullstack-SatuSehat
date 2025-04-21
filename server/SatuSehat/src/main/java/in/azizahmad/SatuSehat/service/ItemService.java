package in.azizahmad.SatuSehat.service;

import in.azizahmad.SatuSehat.io.ItemRequest;
import in.azizahmad.SatuSehat.io.ItemResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ItemService {
    ItemResponse add(ItemRequest request, MultipartFile file);

    List<ItemResponse> fetchItems();

    void deleteItem(String itemId);

    ItemResponse updateItem(String itemId, ItemRequest request, MultipartFile file);

}
