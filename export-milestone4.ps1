# Milestone 4 File Export Script
$source = "d:\infosys Project\carbon-calc"
$target = "d:\milestone4-export"

Write-Host "=== Milestone 4 File Export ===" -ForegroundColor Cyan
Write-Host "Source: $source"
Write-Host "Target: $target"
Write-Host ""

if (Test-Path $target) {
    Remove-Item -Path $target -Recurse -Force
}
New-Item -ItemType Directory -Force -Path $target | Out-Null

$files = @(
    "frontend/src/components/marketplace/CartModal.jsx",
    "frontend/src/components/marketplace/CheckoutModal.jsx",
    "frontend/src/components/marketplace/FilterSidebar.jsx",
    "frontend/src/components/marketplace/ProductCard.jsx",
    "frontend/src/components/marketplace/ProductDetailsModal.jsx",
    "frontend/src/components/marketplace/SearchBar.jsx",
    "frontend/src/components/marketplace/WishlistButton.jsx",
    "frontend/src/components/marketplace/index.js",
    "frontend/src/pages/Marketplace/Marketplace.jsx",
    "frontend/src/pages/Orders/OrderHistory.jsx",
    "frontend/src/pages/Wishlist/Wishlist.jsx",
    "frontend/src/pages/Notifications/Notifications.jsx",
    "frontend/src/services/marketplace.service.js",
    "frontend/src/services/api.js",
    "frontend/MARKETPLACE_BUILD_SUMMARY.md",
    "frontend/MARKETPLACE_COMPLETE_GUIDE.md",
    "frontend/MARKETPLACE_QUICK_REFERENCE.md",
    "docs/MARKETPLACE_FEATURE.md",
    "backend/src/main/java/com/carboncalc/controller/AdminProductController.java",
    "backend/src/main/java/com/carboncalc/controller/AdminOrderController.java",
    "backend/src/main/java/com/carboncalc/service/AdminProductService.java",
    "backend/src/main/java/com/carboncalc/service/AdminOrderService.java",
    "backend/src/main/java/com/carboncalc/entity/AdminProductCatalog.java",
    "backend/src/main/java/com/carboncalc/entity/AdminCustomerOrder.java",
    "backend/src/main/java/com/carboncalc/entity/AdminOrderLineItem.java",
    "backend/src/main/java/com/carboncalc/repository/AdminProductCatalogRepository.java",
    "backend/src/main/java/com/carboncalc/repository/AdminCustomerOrderRepository.java",
    "backend/src/main/java/com/carboncalc/repository/AdminOrderLineItemRepository.java",
    "README.md"
)

$copiedCount = 0
$notFoundCount = 0

foreach ($file in $files) {
    $sourcePath = Join-Path $source $file
    $targetPath = Join-Path $target $file
    $targetDir = Split-Path -Parent $targetPath
    
    if (!(Test-Path $targetDir)) {
        New-Item -ItemType Directory -Force -Path $targetDir | Out-Null
    }
    
    if (Test-Path $sourcePath) {
        Copy-Item -Path $sourcePath -Destination $targetPath -Force
        Write-Host "[OK] $file" -ForegroundColor Green
        $copiedCount++
    } else {
        Write-Host "[MISS] $file" -ForegroundColor Red
        $notFoundCount++
    }
}

Write-Host ""
Write-Host "=== Summary ===" -ForegroundColor Cyan
Write-Host "Copied: $copiedCount files" -ForegroundColor Green
Write-Host "Missing: $notFoundCount files"
Write-Host ""
Write-Host "Files exported to: $target" -ForegroundColor Cyan
