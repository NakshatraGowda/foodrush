package com.food.menu;

import com.food.menu.entity.MenuItem;
import com.food.menu.repository.MenuRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements ApplicationRunner {  // ← changed from CommandLineRunner

    private final MenuRepository menuRepository;

    @Override
    public void run(ApplicationArguments args) {             // ← changed signature
        try {
            if (menuRepository.count() == 0) {
                log.info("Seeding menu data...");
                menuRepository.saveAll(List.of(
                        MenuItem.builder().name("Margherita Pizza").description("Classic tomato sauce with fresh mozzarella").price(new BigDecimal("12.99")).category("Pizza").available(true).imageUrl("🍕").build(),
                        MenuItem.builder().name("Pepperoni Pizza").description("Spicy pepperoni with melted cheese").price(new BigDecimal("14.99")).category("Pizza").available(true).imageUrl("🍕").build(),
                        MenuItem.builder().name("BBQ Burger").description("Juicy beef patty with smoky BBQ sauce").price(new BigDecimal("11.49")).category("Burger").available(true).imageUrl("🍔").build(),
                        MenuItem.builder().name("Veggie Burger").description("Plant-based patty with fresh garden veggies").price(new BigDecimal("10.49")).category("Burger").available(true).imageUrl("🍔").build(),
                        MenuItem.builder().name("Caesar Salad").description("Romaine lettuce, croutons, parmesan, caesar dressing").price(new BigDecimal("8.99")).category("Salad").available(true).imageUrl("🥗").build(),
                        MenuItem.builder().name("Chicken Wings").description("Crispy wings with choice of buffalo or BBQ sauce").price(new BigDecimal("13.99")).category("Starters").available(true).imageUrl("🍗").build(),
                        MenuItem.builder().name("Garlic Bread").description("Toasted bread with herb garlic butter").price(new BigDecimal("4.99")).category("Starters").available(true).imageUrl("🥖").build(),
                        MenuItem.builder().name("Chocolate Lava Cake").description("Warm chocolate cake with molten center").price(new BigDecimal("6.99")).category("Dessert").available(true).imageUrl("🍰").build(),
                        MenuItem.builder().name("Cola").description("Ice cold cola 500ml").price(new BigDecimal("2.49")).category("Drinks").available(true).imageUrl("🥤").build(),
                        MenuItem.builder().name("Fresh Lemonade").description("Fresh-squeezed lemonade with mint").price(new BigDecimal("3.49")).category("Drinks").available(true).imageUrl("🍋").build()
                ));
                log.info("Menu seeded with 10 items.");
            } else {
                log.info("Menu already has data, skipping seed.");
            }
        } catch (Exception e) {
            log.error("Failed to seed menu data: {}", e.getMessage());
        }
    }
}