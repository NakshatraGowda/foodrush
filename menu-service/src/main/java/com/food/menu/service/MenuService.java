package com.food.menu.service;

import com.food.menu.dto.MenuItemDTO;
import com.food.menu.entity.MenuItem;
import com.food.menu.exception.ResourceNotFoundException;
import com.food.menu.repository.MenuRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MenuService {

    private final MenuRepository menuRepository;

    public List<MenuItemDTO> getAllAvailableItems() {
        log.info("Fetching all available menu items");
        return menuRepository.findByAvailableTrue()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<MenuItemDTO> getAllItems() {
        log.info("Fetching all menu items");
        return menuRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public MenuItemDTO getItemById(Long id) {
        log.info("Fetching menu item with id: {}", id);
        MenuItem item = menuRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with id: " + id));
        return toDTO(item);
    }

    public List<MenuItemDTO> getItemsByCategory(String category) {
        log.info("Fetching menu items for category: {}", category);
        return menuRepository.findByAvailableTrueAndCategoryIgnoreCase(category)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public MenuItemDTO createItem(MenuItemDTO dto) {
        log.info("Creating menu item: {}", dto.getName());
        MenuItem item = toEntity(dto);
        MenuItem saved = menuRepository.save(item);
        log.info("Created menu item with id: {}", saved.getId());
        return toDTO(saved);
    }

    @Transactional
    public MenuItemDTO updateItem(Long id, MenuItemDTO dto) {
        log.info("Updating menu item with id: {}", id);
        MenuItem existing = menuRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with id: " + id));
        existing.setName(dto.getName());
        existing.setDescription(dto.getDescription());
        existing.setPrice(dto.getPrice());
        existing.setCategory(dto.getCategory());
        existing.setAvailable(dto.getAvailable() != null ? dto.getAvailable() : existing.getAvailable());
        existing.setImageUrl(dto.getImageUrl());
        return toDTO(menuRepository.save(existing));
    }

    @Transactional
    public void deleteItem(Long id) {
        log.info("Deleting menu item with id: {}", id);
        if (!menuRepository.existsById(id)) {
            throw new ResourceNotFoundException("Menu item not found with id: " + id);
        }
        menuRepository.deleteById(id);
    }

    private MenuItemDTO toDTO(MenuItem item) {
        return MenuItemDTO.builder()
                .id(item.getId())
                .name(item.getName())
                .description(item.getDescription())
                .price(item.getPrice())
                .category(item.getCategory())
                .available(item.getAvailable())
                .imageUrl(item.getImageUrl())
                .build();
    }

    private MenuItem toEntity(MenuItemDTO dto) {
        return MenuItem.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .category(dto.getCategory())
                .available(dto.getAvailable() != null ? dto.getAvailable() : true)
                .imageUrl(dto.getImageUrl())
                .build();
    }
}