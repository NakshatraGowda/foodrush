package com.food.menu.repository;

import com.food.menu.entity.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MenuRepository extends JpaRepository<MenuItem, Long> {
    List<MenuItem> findByAvailableTrue();
    List<MenuItem> findByCategoryIgnoreCase(String category);
    List<MenuItem> findByAvailableTrueAndCategoryIgnoreCase(String category);
}