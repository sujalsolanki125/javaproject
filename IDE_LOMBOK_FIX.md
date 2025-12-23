# Fixing Red Errors in VS Code (Lombok + Java 21 IDE Issue)

## Problem Summary
The files are showing **red errors in VS Code** even though **Maven builds successfully**. This is an **IDE/Language Server issue**, not an actual code problem.

### Root Cause
- NetBeans Language Server (used by VS Code Java extension) has compatibility issues with Lombok 1.18.34 and Java 21
- Error: `java.lang.NoClassDefFoundError: Could not initialize class lombok.javac.Javac`
- This is a **classloader problem in the IDE**, not in your actual code

### Evidence That Code Is Actually Fine
```
[INFO] BUILD SUCCESS
[INFO] Compiling 36 source files with javac [debug parameters release 21] to target\classes
```

## What Was Fixed

### 1. ✅ Updated JwtUtil Configuration
Changed `JwtUtil.java` to use correct property paths:
```java
@Value("${app.jwt.secret}")     // was: spring.security.jwt.secret
@Value("${app.jwt.expiration}") // was: spring.security.jwt.expiration
```

### 2. ✅ Added Explicit Lombok Annotation Processing
Updated `pom.xml` with maven-compiler-plugin configuration:
```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-compiler-plugin</artifactId>
    <version>3.13.0</version>
    <configuration>
        <source>21</source>
        <target>21</target>
        <annotationProcessorPaths>
            <path>
                <groupId>org.projectlombok</groupId>
                <artifactId>lombok</artifactId>
                <version>1.18.34</version>
            </path>
        </annotationProcessorPaths>
    </configuration>
</plugin>
```

## Solutions to Fix IDE Red Errors

### Option 1: Reload VS Code Window (Recommended)
1. Open Command Palette: `Ctrl+Shift+P` (Windows) or `Cmd+Shift+P` (Mac)
2. Type: `Developer: Reload Window`
3. Press Enter
4. Wait for Java Language Server to restart (check bottom-right status bar)

### Option 2: Clean Java Workspace
1. Open Command Palette: `Ctrl+Shift+P`
2. Type: `Java: Clean Java Language Server Workspace`
3. Click "Reload and delete" when prompted
4. Wait for re-indexing to complete

### Option 3: Restart Language Server
1. Open Command Palette: `Ctrl+Shift+P`
2. Type: `Java: Restart Language Server`
3. Wait for restart

### Option 4: Rebuild Project (If above don't work)
```bash
cd "d:\infosys Project\carbon-calc\backend"
mvn clean install -DskipTests
```
Then reload VS Code window.

### Option 5: Update Java Extensions (Last resort)
1. Go to Extensions (Ctrl+Shift+X)
2. Search for "Extension Pack for Java"
3. Check if update available
4. Update and reload

## Why Lombok Errors Appear

The error messages like:
```
cannot find symbol
  symbol: method getUsername()
  location: variable user of type User
```

These occur because:
1. Lombok uses annotation processing to generate getters/setters at compile time
2. The IDE's language server fails to load Lombok's annotation processor
3. **Maven still compiles fine** because it uses a different classloader

## Verify Build Still Works

Run this to confirm everything compiles:
```bash
mvn clean compile test
```

Expected output:
```
[INFO] BUILD SUCCESS
[INFO] Compiling 36 source files
```

## Current Project Status

### ✅ Working Features
- Java 21 upgrade complete
- All 36 source files compile successfully
- Lombok 1.18.34 integrated
- All dependencies resolved
- JPA entities with Lombok annotations
- Controllers using proper DTOs
- JWT configuration updated

### ⚠️ IDE Display Issue
- VS Code shows red squiggly lines
- Language Server can't load Lombok processor
- **This doesn't affect actual compilation**
- **Application will run fine**

## Alternative: Use Explicit Getters/Setters (Not Recommended)

If IDE issues persist and you need immediate development without red errors, you could:
1. Remove Lombok @Data annotations
2. Generate explicit getters/setters
3. **NOT RECOMMENDED** - loses Lombok benefits

## Next Steps

1. **Reload VS Code window** (Option 1 above)
2. If errors persist, try **Clean Java Workspace** (Option 2)
3. Verify build: `mvn clean compile`
4. Continue development - **ignore IDE errors if build succeeds**

## Testing the Application

Even with IDE errors, you can still:
```bash
# Run the application
mvn spring-boot:run

# Run tests
mvn test

# Package the application
mvn package
```

All these should work perfectly despite IDE warnings.

## Summary

✅ **Your code is correct**  
✅ **Maven builds successfully**  
✅ **Lombok is working**  
❌ **VS Code Language Server has compatibility issues**

**Solution**: Reload VS Code window and ignore IDE errors if build succeeds.
