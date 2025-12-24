# MySQL Connection Guide for VS Code

## ✅ Successfully Converted PostgreSQL → MySQL!

### Changes Made:
- ✅ Docker: MySQL 8.0 (port 3306)
- ✅ Driver: MySQL Connector/J
- ✅ Dialect: MySQLDialect
- ✅ Credentials: carboncalc / carboncalc123

---

## 🔌 Connect MySQL to VS Code

### Option 1: Using MySQL Extension (Recommended)

1. **Install MySQL Extension**
   - Press `Ctrl+Shift+X`
   - Search for "MySQL" by Jun Han
   - Click "Install"

2. **Connect to Database**
   - Press `Ctrl+Shift+P`
   - Type "MySQL: Add Connection"
   - Enter connection details:
     ```
     Host: localhost
     Port: 3306
     Username: carboncalc
     Password: carboncalc123
     Database: carboncalc
     ```

3. **Browse Database**
   - Click MySQL icon in sidebar
   - Expand connection to see tables
   - Right-click to run queries

---

### Option 2: Using Database Client Extension

1. **Install Database Client**
   - Press `Ctrl+Shift+X`
   - Search for "Database Client" by Weijan Chen
   - Click "Install"

2. **Add Connection**
   - Click Database icon in sidebar
   - Click "+" to add connection
   - Select "MySQL"
   - Enter:
     ```
     Host: localhost
     Port: 3306
     Username: carboncalc
     Password: carboncalc123
     Database: carboncalc
     ```

---

### Option 3: Using SQLTools Extension

1. **Install SQLTools**
   - Press `Ctrl+Shift+X`
   - Search for "SQLTools"
   - Install both:
     - SQLTools (by Matheus Teixeira)
     - SQLTools MySQL/MariaDB

2. **Create Connection**
   - Press `Ctrl+Shift+P`
   - Type "SQLTools: Add New Connection"
   - Select "MySQL"
   - Configure:
     ```
     Connection Name: Carbon Calc MySQL
     Server: localhost
     Port: 3306
     Database: carboncalc
     Username: carboncalc
     Password: carboncalc123
     ```

---

## 🚀 Start Your Application

### 1. Start Docker Services
```powershell
cd "d:\infosys Project\carbon-calc"
docker-compose up -d mysql redis kafka
```

### 2. Verify MySQL is Running
```powershell
docker ps | Select-String mysql
```

### 3. Connect to MySQL CLI (Optional)
```powershell
docker exec -it carbon-calc-db mysql -ucarboncalc -pcarboncalc123 carboncalc
```

### 4. Start Backend
```powershell
cd backend
mvn spring-boot:run
```

### 5. Start Frontend
```powershell
cd frontend
npm run dev
```

---

## 📊 Database Credentials

| Setting | Value |
|---------|-------|
| Host | localhost |
| Port | 3306 |
| Database | carboncalc |
| Username | carboncalc |
| Password | carboncalc123 |
| Root Password | root123 |

---

## 🔍 Troubleshooting

### Cannot Connect?
1. Check Docker is running: `docker ps`
2. Check MySQL logs: `docker logs carbon-calc-db`
3. Restart MySQL: `docker-compose restart mysql`

### Port Already in Use?
```powershell
# Find process using port 3306
netstat -ano | findstr :3306
# Kill the process
taskkill /PID <PID> /F
```

### Reset Database?
```powershell
docker-compose down -v
docker-compose up -d mysql
```

---

## 📝 Sample Queries

```sql
-- Show all tables
SHOW TABLES;

-- Show users
SELECT * FROM users;

-- Show marketplace items
SELECT * FROM marketplace_items;

-- Show cart items
SELECT * FROM cart_items;

-- Check database size
SELECT 
    table_name AS 'Table',
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.TABLES
WHERE table_schema = 'carboncalc';
```
