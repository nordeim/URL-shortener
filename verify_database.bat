@echo off
REM ============================================================================
REM DATABASE VERIFICATION SCRIPT (Windows)
REM ============================================================================
REM This script verifies that your local PostgreSQL database is properly set up
REM for the URL Shortener application.
REM
REM Usage: verify_database.bat [database_name]
REM Default database name: url_shortener_dev
REM ============================================================================

set DB_NAME=%1
if "%DB_NAME%"=="" set DB_NAME=url_shortener_dev

echo 🔍 Verifying URL Shortener Database Setup...
echo 📋 Database: %DB_NAME%
echo ==========================================

setlocal enabledelayedexpansion

REM Check if database exists
echo.
echo 1️⃣ Checking if database exists...
for /f "delims=" %%a in ('psql -lqt ^| find /i "%DB_NAME%"') do set DB_EXISTS=%%a
if defined DB_EXISTS (
    echo ✅ Database '%DB_NAME%' exists
) else (
    echo ❌ Database '%DB_NAME%' does NOT exist
    goto :end
)

REM Check tables
echo.
echo 2️⃣ Verifying table structure...
for %%t in (links urls url_analytics user_profiles) do (
    echo   📋 Checking table: %%t
    psql -d %DB_NAME% -c "\dt public.%%t" >nul 2>&1
    if !errorlevel! equ 0 (
        echo     ✅ Table '%%t' exists
        for /f "tokens=*" %%i in ('psql -d %DB_NAME% -t -c "SELECT COUNT(*) FROM public.%%t;"') do set COUNT=%%i
        echo     📊 Row count: !COUNT!
    ) else (
        echo     ❌ Table '%%t' does NOT exist
    )
)

REM Check sequences
echo.
echo 3️⃣ Verifying sequences...
for %%s in (links_id_seq urls_id_seq url_analytics_id_seq) do (
    echo   🔢 Checking sequence: %%s
    psql -d %DB_NAME% -c "\ds public.%%s" >nul 2>&1
    if !errorlevel! equ 0 (
        echo     ✅ Sequence '%%s' exists
    ) else (
        echo     ❌ Sequence '%%s' missing
    )
)

REM Check indexes
echo.
echo 4️⃣ Verifying indexes...
for %%i in (links_pkey idx_links_short_id urls_pkey urls_url_code_key url_analytics_pkey user_profiles_pkey user_profiles_email_key) do (
    echo   🔍 Checking index: %%i
    psql -d %DB_NAME% -c "\di public.%%i" >nul 2>&1
    if !errorlevel! equ 0 (
        echo     ✅ Index '%%i' exists
    ) else (
        echo     ❌ Index '%%i' missing
    )
)

REM Test sample query
echo.
echo 5️⃣ Testing sample query...
psql -d %DB_NAME% -c "SELECT 1 as test;" >nul 2>&1
if !errorlevel! equ 0 (
    echo ✅ Sample query successful
) else (
    echo ❌ Sample query failed
)

REM Check PostgreSQL version
echo.
echo 6️⃣ Checking PostgreSQL version...
for /f "tokens=*" %%i in ('psql --version') do echo   📌 %%i

:end
echo.
echo ==========================================
echo 📊 VERIFICATION COMPLETE
echo ==========================================
if %ERRORLEVEL% equ 0 (
    echo 🎉 Database setup verification completed!
    echo.
    echo Next steps:
    echo 1. Update your .env.local file with DATABASE_URL
    echo 2. Test your application connection
    echo 3. Run your application!
) else (
    echo ⚠️ Some issues found. Check the output above.
    echo.
    echo Troubleshooting:
    echo 1. Re-run: psql -d %DB_NAME% -f database_schema_backup.sql
    echo 2. Check PostgreSQL service is running
    echo 3. Verify database permissions
)

pause