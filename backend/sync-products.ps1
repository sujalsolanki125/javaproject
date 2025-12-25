# PowerShell script to create sample products and sync to marketplace

$baseUrl = "http://localhost:8080"

# Sample products to create
$products = @(
    @{
        productDisplayName = "Solar Panel Kit - 200W"
        productDetailedDescription = "Complete solar panel kit for home energy generation. Includes all mounting hardware and cables."
        productSellingPrice = 299.99
        productCategoryType = "eco-products"
        productImagePath = "/images/solar-panel.jpg"
        availableInventoryCount = 50
        featuredProductFlag = $true
        catalogStatus = "ACTIVE"
        co2EmissionOffset = "-2kg CO2/month"
        productVendorName = "EcoTech Solutions"
    },
    @{
        productDisplayName = "Plant 10 Trees"
        productDetailedDescription = "Support reforestation efforts by planting 10 native trees in deforested areas"
        productSellingPrice = 49.99
        productCategoryType = "tree-planting"
        productImagePath = "/images/tree-planting.jpg"
        availableInventoryCount = 1000
        featuredProductFlag = $true
        catalogStatus = "ACTIVE"
        co2EmissionOffset = "-500kg CO2/year"
        productVendorName = "GreenEarth Foundation"
    },
    @{
        productDisplayName = "Carbon Credits - 1 Ton"
        productDetailedDescription = "Certified carbon offset credits from verified projects"
        productSellingPrice = 25.00
        productCategoryType = "carbon-credits"
        productImagePath = "/images/carbon-credits.jpg"
        availableInventoryCount = 500
        featuredProductFlag = $false
        catalogStatus = "ACTIVE"
        co2EmissionOffset = "-1000kg CO2"
        productVendorName = "CarbonZero Inc"
    },
    @{
        productDisplayName = "Bamboo Toothbrush Set"
        productDetailedDescription = "Eco-friendly bamboo toothbrushes, pack of 4"
        productSellingPrice = 12.99
        productCategoryType = "eco-products"
        productImagePath = "/images/bamboo-toothbrush.jpg"
        availableInventoryCount = 200
        featuredProductFlag = $false
        catalogStatus = "ACTIVE"
        co2EmissionOffset = "-0.5kg CO2"
        productVendorName = "Sustainable Living Co"
    },
    @{
        productDisplayName = "Reusable Water Bottle"
        productDetailedDescription = "Stainless steel insulated water bottle, 750ml"
        productSellingPrice = 24.99
        productCategoryType = "eco-products"
        productImagePath = "/images/water-bottle.jpg"
        availableInventoryCount = 150
        featuredProductFlag = $false
        catalogStatus = "ACTIVE"
        co2EmissionOffset = "-1.2kg CO2/year"
        productVendorName = "EcoWare"
    },
    @{
        productDisplayName = "Ocean Cleanup Donation"
        productDetailedDescription = "Support ocean plastic removal initiatives"
        productSellingPrice = 50.00
        productCategoryType = "donations"
        productImagePath = "/images/ocean-cleanup.jpg"
        availableInventoryCount = 999
        featuredProductFlag = $true
        catalogStatus = "ACTIVE"
        co2EmissionOffset = "-10kg plastic waste"
        productVendorName = "Ocean Conservation Fund"
    }
)

Write-Host "Creating sample products in admin catalog..." -ForegroundColor Green

foreach ($product in $products) {
    try {
        $json = $product | ConvertTo-Json -Depth 5
        Write-Host "`nCreating: $($product.productDisplayName)" -ForegroundColor Cyan
        
        $response = Invoke-RestMethod -Method POST `
            -Uri "$baseUrl/api/admin/products" `
            -ContentType "application/json" `
            -Body $json
        
        Write-Host "✓ Created successfully (ID: $($response.catalogProductId))" -ForegroundColor Green
    }
    catch {
        Write-Host "✗ Failed to create: $_" -ForegroundColor Red
    }
}

Write-Host "`n========================================" -ForegroundColor Yellow
Write-Host "Syncing all products to marketplace..." -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Yellow

try {
    Invoke-RestMethod -Method POST -Uri "$baseUrl/api/admin/products/sync-marketplace"
    Write-Host "✓ Products synced to marketplace successfully!" -ForegroundColor Green
}
catch {
    Write-Host "✗ Failed to sync: $_" -ForegroundColor Red
}

Write-Host "`nChecking marketplace products..." -ForegroundColor Green
try {
    $marketplaceProducts = Invoke-RestMethod -Method GET -Uri "$baseUrl/api/marketplace/products"
    Write-Host "✓ Found $($marketplaceProducts.Count) products in marketplace" -ForegroundColor Green
    
    if ($marketplaceProducts.Count -gt 0) {
        Write-Host "`nMarketplace Products:" -ForegroundColor Cyan
        foreach ($p in $marketplaceProducts) {
            Write-Host "  - $($p.name) ($$($p.price))" -ForegroundColor White
        }
    }
}
catch {
    Write-Host "✗ Failed to get marketplace products: $_" -ForegroundColor Red
}

Write-Host "`n✓ Done! Refresh your marketplace page to see products." -ForegroundColor Green
