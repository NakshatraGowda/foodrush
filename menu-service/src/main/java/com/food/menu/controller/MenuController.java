package com.food.menu.controller;

import com.food.menu.dto.MenuItemDTO;
import com.food.menu.service.MenuService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
@RequiredArgsConstructor
@Slf4j
public class MenuController {

    private final MenuService menuService;

    @GetMapping
    public ResponseEntity<List<MenuItemDTO>> getAllAvailableItems() {
        return ResponseEntity.ok(menuService.getAllAvailableItems());
    }

    @GetMapping("/all")
    public ResponseEntity<List<MenuItemDTO>> getAllItems() {
        return ResponseEntity.ok(menuService.getAllItems());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MenuItemDTO> getItemById(@PathVariable Long id) {
        return ResponseEntity.ok(menuService.getItemById(id));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<MenuItemDTO>> getItemsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(menuService.getItemsByCategory(category));
    }

    @PostMapping
    public ResponseEntity<MenuItemDTO> createItem(@Valid @RequestBody MenuItemDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(menuService.createItem(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MenuItemDTO> updateItem(@PathVariable Long id,
                                                  @Valid @RequestBody MenuItemDTO dto) {
        return ResponseEntity.ok(menuService.updateItem(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        menuService.deleteItem(id);
        return ResponseEntity.noContent().build();
    }
}