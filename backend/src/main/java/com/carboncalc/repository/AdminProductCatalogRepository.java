package com.carboncalc.repository;

import com.carboncalc.entity.AdminProductCatalog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdminProductCatalogRepository extends JpaRepository<AdminProductCatalog, Long> {

    List<AdminProductCatalog> findByCatalogStatus(AdminProductCatalog.ProductCatalogStatus catalogStatus);

    List<AdminProductCatalog> findByProductCategoryType(String productCategoryType);

    List<AdminProductCatalog> findByProductCategoryTypeAndCatalogStatus(
            String productCategoryType,
            AdminProductCatalog.ProductCatalogStatus catalogStatus);

    @Query("SELECT p FROM AdminProductCatalog p WHERE " +
            "LOWER(p.productDisplayName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(p.productDetailedDescription) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<AdminProductCatalog> searchByNameOrDescription(@Param("searchTerm") String searchTerm);

    List<AdminProductCatalog> findByFeaturedProductFlag(Boolean featuredProductFlag);

    List<AdminProductCatalog> findByAvailableInventoryCountLessThanEqual(Integer threshold);

    @Query("SELECT p FROM AdminProductCatalog p WHERE p.productSellingPrice BETWEEN :minPrice AND :maxPrice")
    List<AdminProductCatalog> findByPriceRange(@Param("minPrice") Double minPrice, @Param("maxPrice") Double maxPrice);

    @Query("SELECT p FROM AdminProductCatalog p ORDER BY p.catalogCreatedTimestamp DESC")
    List<AdminProductCatalog> findAllOrderByCreatedDesc();

    @Query("SELECT p FROM AdminProductCatalog p ORDER BY p.productSellingPrice ASC")
    List<AdminProductCatalog> findAllOrderByPriceAsc();

    @Query("SELECT p FROM AdminProductCatalog p ORDER BY p.productSellingPrice DESC")
    List<AdminProductCatalog> findAllOrderByPriceDesc();
}