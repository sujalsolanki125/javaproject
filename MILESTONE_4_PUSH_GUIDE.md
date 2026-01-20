# Milestone 4 Push Guide

## Milestone 4 Files to Push
**Repository:** https://github.com/adithisuresh2205/Personal-Carbon-Footprint-App  
**Branch:** Milestone-4

### Week 7 & 8: Marketplace & Alerts Features

---

## Frontend Files (Marketplace)

### Components - Marketplace
```
frontend/src/components/marketplace/
├── CartModal.jsx
├── CheckoutModal.jsx
├── FilterSidebar.jsx
├── ProductCard.jsx
├── ProductDetailsModal.jsx
├── SearchBar.jsx
├── WishlistButton.jsx
└── index.js
```

### Pages - Marketplace, Orders, Wishlist
```
frontend/src/pages/Marketplace/Marketplace.jsx
frontend/src/pages/Orders/OrderHistory.jsx
frontend/src/pages/Wishlist/Wishlist.jsx
frontend/src/pages/Notifications/Notifications.jsx
```

### Services
```
frontend/src/services/marketplace.service.js
```

### Documentation
```
frontend/MARKETPLACE_BUILD_SUMMARY.md
frontend/MARKETPLACE_COMPLETE_GUIDE.md
frontend/MARKETPLACE_QUICK_REFERENCE.md
docs/MARKETPLACE_FEATURE.md
```

---

## Backend Files (Marketplace & Orders)

### Controllers
```
backend/src/main/java/com/carboncalc/controller/AdminProductController.java
backend/src/main/java/com/carboncalc/controller/AdminOrderController.java
```

### Services
```
backend/src/main/java/com/carboncalc/service/AdminProductService.java
backend/src/main/java/com/carboncalc/service/AdminOrderService.java
```

### Entities
```
backend/src/main/java/com/carboncalc/entity/AdminProductCatalog.java
backend/src/main/java/com/carboncalc/entity/AdminCustomerOrder.java
backend/src/main/java/com/carboncalc/entity/AdminOrderLineItem.java
```

### Repositories
```
backend/src/main/java/com/carboncalc/repository/AdminProductCatalogRepository.java
backend/src/main/java/com/carboncalc/repository/AdminCustomerOrderRepository.java
backend/src/main/java/com/carboncalc/repository/AdminOrderLineItemRepository.java
```

---

## Step-by-Step Push Instructions

### Option 1: Using Subtree (Recommended)

1. **Create a new temporary directory with only Milestone 4 files:**
```bash
# Create a new directory
mkdir "d:\milestone4-only"
cd "d:\milestone4-only"

# Initialize git
git init
git checkout -b Milestone-4

# Copy only Milestone 4 files from original project
# (Copy the files listed above)
```

2. **Copy files manually:**
   - Copy all frontend marketplace files
   - Copy all backend marketplace/order files
   - Copy documentation files

3. **Add and commit:**
```bash
git add .
git commit -m "Milestone 4: Marketplace & Alerts implementation"
```

4. **Add remote and push:**
```bash
git remote add origin https://github.com/adithisuresh2205/Personal-Carbon-Footprint-App.git
git push -u origin Milestone-4
```

---

### Option 2: Using Filter-Branch (Advanced)

1. **Create a new branch from current project:**
```bash
cd "d:\infosys Project\carbon-calc"
git checkout -b milestone4-export
```

2. **Create a script to copy only Milestone 4 files:**
Create `copy-milestone4.ps1`:
```powershell
# Create target directory
$target = "d:\milestone4-export"
New-Item -ItemType Directory -Force -Path $target

# Frontend - Marketplace Components
$files = @(
    "frontend/src/components/marketplace/CartModal.jsx",
    "frontend/src/components/marketplace/CheckoutModal.jsx",
    "frontend/src/components/marketplace/FilterSidebar.jsx",
    "frontend/src/components/marketplace/ProductCard.jsx",
    "frontend/src/components/marketplace/ProductDetailsModal.jsx",
    "frontend/src/components/marketplace/SearchBar.jsx",
    "frontend/src/components/marketplace/WishlistButton.jsx",
    "frontend/src/components/marketplace/index.js",
    
    # Pages
    "frontend/src/pages/Marketplace/Marketplace.jsx",
    "frontend/src/pages/Orders/OrderHistory.jsx",
    "frontend/src/pages/Wishlist/Wishlist.jsx",
    "frontend/src/pages/Notifications/Notifications.jsx",
    
    # Services
    "frontend/src/services/marketplace.service.js",
    
    # Documentation
    "frontend/MARKETPLACE_BUILD_SUMMARY.md",
    "frontend/MARKETPLACE_COMPLETE_GUIDE.md",
    "frontend/MARKETPLACE_QUICK_REFERENCE.md",
    "docs/MARKETPLACE_FEATURE.md",
    
    # Backend Controllers
    "backend/src/main/java/com/carboncalc/controller/AdminProductController.java",
    "backend/src/main/java/com/carboncalc/controller/AdminOrderController.java",
    
    # Backend Services
    "backend/src/main/java/com/carboncalc/service/AdminProductService.java",
    "backend/src/main/java/com/carboncalc/service/AdminOrderService.java",
    
    # Backend Entities
    "backend/src/main/java/com/carboncalc/entity/AdminProductCatalog.java",
    "backend/src/main/java/com/carboncalc/entity/AdminCustomerOrder.java",
    "backend/src/main/java/com/carboncalc/entity/AdminOrderLineItem.java",
    
    # Backend Repositories
    "backend/src/main/java/com/carboncalc/repository/AdminProductCatalogRepository.java",
    "backend/src/main/java/com/carboncalc/repository/AdminCustomerOrderRepository.java",
    "backend/src/main/java/com/carboncalc/repository/AdminOrderLineItemRepository.java"
)

foreach ($file in $files) {
    $sourcePath = "d:\infosys Project\carbon-calc\$file"
    $targetPath = "$target\$file"
    
    # Create directory if it doesn't exist
    $targetDir = Split-Path -Parent $targetPath
    New-Item -ItemType Directory -Force -Path $targetDir | Out-Null
    
    # Copy file
    if (Test-Path $sourcePath) {
        Copy-Item -Path $sourcePath -Destination $targetPath -Force
        Write-Host "Copied: $file" -ForegroundColor Green
    } else {
        Write-Host "Not found: $file" -ForegroundColor Yellow
    }
}

Write-Host "`nMilestone 4 files copied to: $target" -ForegroundColor Cyan
```

3. **Run the script:**
```bash
cd "d:\infosys Project\carbon-calc"
.\copy-milestone4.ps1
```

4. **Initialize new repository:**
```bash
cd d:\milestone4-export
git init
git checkout -b Milestone-4
git add .
git commit -m "Milestone 4: Marketplace & Alerts - Week 7 & 8 implementation"
git remote add origin https://github.com/adithisuresh2205/Personal-Carbon-Footprint-App.git
git push -u origin Milestone-4
```

---

## Features Included

### Week 7: Eco Marketplace & Transaction Flow
✅ Product catalog with search and filters  
✅ Shopping cart functionality  
✅ Checkout process  
✅ Order management  
✅ Wishlist feature  
✅ Product details modal  

### Week 8: Alerts for High Emissions
✅ Notification system  
✅ Alert triggers for high carbon footprint  
✅ User notification preferences  

---

## Quick Summary

**Total Files:** ~30 files
- **Frontend:** 16 files (components, pages, services, docs)
- **Backend:** 10 files (controllers, services, entities, repositories)
- **Documentation:** 4 files

**Technologies:**
- React components for marketplace UI
- Spring Boot REST APIs for backend
- JPA entities for database models
- Service layer for business logic
