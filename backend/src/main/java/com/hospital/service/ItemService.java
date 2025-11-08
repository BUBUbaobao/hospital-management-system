package com.hospital.service;

import com.hospital.dto.response.ItemResponse;
import com.hospital.entity.Item;
import com.hospital.enums.ItemType;
import com.hospital.repository.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ItemService {

    @Autowired
    private ItemRepository itemRepository;

    public List<ItemResponse> getItems(ItemType type) {
        List<Item> items;
        if (type != null) {
            items = itemRepository.findByTypeAndEnabledTrue(type);
        } else {
            items = itemRepository.findByEnabledTrue();
        }

        return items.stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    private ItemResponse convertToResponse(Item item) {
        ItemResponse response = new ItemResponse();
        response.setId(item.getId());
        response.setName(item.getName());
        response.setType(item.getType());
        response.setPrice(item.getPrice());
        response.setUnit(item.getUnit());
        return response;
    }
}
