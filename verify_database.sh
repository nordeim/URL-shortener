#!/bin/bash
# ============================================================================
# DATABASE VERIFICATION SCRIPT
# ============================================================================
# This script verifies that your local PostgreSQL database is properly set up
# for the URL Shortener application.
#
# Usage: ./verify_database.sh [database_name]
# Default database name: url_shortener_dev
# ============================================================================

# Configuration
DB_NAME="${1:-url_shortener_dev}"
EXIT_CODE=0

echo "🔍 Verifying URL Shortener Database Setup..."
echo "📋 Database: $DB_NAME"
echo "=========================================="

# Function to print success/error messages
print_status() {
    if [ $? -eq 0 ]; then
        echo "✅ $1"
    else
        echo "❌ $1"
        EXIT_CODE=1
    fi
}

# Function to check if database exists
check_database() {
    echo ""
    echo "1️⃣ Checking if database exists..."
    psql -lqt | cut -d \| -f 1 | grep -qw "$DB_NAME"
    print_status "Database '$DB_NAME' exists"
}

# Function to check tables
check_tables() {
    echo ""
    echo "2️⃣ Verifying table structure..."
    
    # Check each required table
    tables=("links" "urls" "url_analytics" "user_profiles")
    
    for table in "${tables[@]}"; do
        echo "  📋 Checking table: $table"
        table_exists=$(psql -d "$DB_NAME" -t -c "\\dt public.$table" 2>/dev/null | wc -l)
        if [ "$table_exists" -gt 0 ]; then
            echo "    ✅ Table '$table' exists"
            
            # Check row count
            count=$(psql -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM public.$table;" 2>/dev/null | tr -d ' ')
            echo "    📊 Row count: $count"
        else
            echo "    ❌ Table '$table' does NOT exist"
            EXIT_CODE=1
        fi
    done
}

# Function to check sequences
check_sequences() {
    echo ""
    echo "3️⃣ Verifying sequences..."
    
    sequences=("links_id_seq" "urls_id_seq" "url_analytics_id_seq")
    
    for seq in "${sequences[@]}"; do
        echo "  🔢 Checking sequence: $seq"
        psql -d "$DB_NAME" -c "\\ds public.$seq" >/dev/null 2>&1
        print_status "Sequence '$seq' exists"
    done
}

# Function to check indexes
check_indexes() {
    echo ""
    echo "4️⃣ Verifying indexes..."
    
    expected_indexes=(
        "links_pkey"
        "idx_links_short_id"
        "urls_pkey"
        "urls_url_code_key"
        "url_analytics_pkey"
        "user_profiles_pkey"
        "user_profiles_email_key"
    )
    
    for index in "${expected_indexes[@]}"; do
        echo "  🔍 Checking index: $index"
        psql -d "$DB_NAME" -c "\\di public.$index" >/dev/null 2>&1
        print_status "Index '$index' exists"
    done
}

# Function to check functions
check_functions() {
    echo ""
    echo "5️⃣ Verifying functions and triggers..."
    
    # Check function
    psql -d "$DB_NAME" -c "\\df public.update_updated_at_column" >/dev/null 2>&1
    print_status "Function 'update_updated_at_column' exists"
    
    # Check trigger
    trigger_exists=$(psql -d "$DB_NAME" -c "\\d+ public.user_profiles" | grep -c "update_user_profiles_updated_at" || echo "0")
    if [ "$trigger_exists" -gt 0 ]; then
        echo "    ✅ Trigger 'update_user_profiles_updated_at' exists"
    else
        echo "    ❌ Trigger 'update_user_profiles_updated_at' missing"
        EXIT_CODE=1
    fi
}

# Function to check views
check_views() {
    echo ""
    echo "6️⃣ Verifying views..."
    
    psql -d "$DB_NAME" -c "\\dv public.link_analytics_summary" >/dev/null 2>&1
    print_status "View 'link_analytics_summary' exists"
}

# Function to run test queries
test_queries() {
    echo ""
    echo "7️⃣ Testing sample queries..."
    
    # Test INSERT
    echo "  📝 Testing INSERT operation..."
    test_id=$(psql -d "$DB_NAME" -t -c "
        INSERT INTO public.links (short_id, original_url, metadata) 
        VALUES ('test_$(date +%s)', 'https://example.com', '{\"test\": true}'::jsonb) 
        RETURNING id;
    " 2>/dev/null | tr -d ' ')
    
    if [ -n "$test_id" ]; then
        echo "    ✅ INSERT successful, ID: $test_id"
        
        # Test SELECT
        echo "  📖 Testing SELECT operation..."
        result=$(psql -d "$DB_NAME" -t -c "SELECT short_id, original_url FROM public.links WHERE id = $test_id;" 2>/dev/null)
        if [ -n "$result" ]; then
            echo "    ✅ SELECT successful"
        else
            echo "    ❌ SELECT failed"
            EXIT_CODE=1
        fi
        
        # Test UPDATE
        echo "  🔄 Testing UPDATE operation..."
        psql -d "$DB_NAME" -c "UPDATE public.links SET click_count = 1 WHERE id = $test_id;" >/dev/null 2>&1
        print_status "UPDATE operation"
        
        # Test DELETE (cleanup)
        echo "  🗑️ Testing DELETE operation..."
        psql -d "$DB_NAME" -c "DELETE FROM public.links WHERE id = $test_id;" >/dev/null 2>&1
        print_status "DELETE operation"
        
    else
        echo "    ❌ INSERT failed"
        EXIT_CODE=1
    fi
}

# Function to check PostgreSQL version
check_postgresql() {
    echo ""
    echo "8️⃣ Checking PostgreSQL version..."
    
    version=$(psql --version | head -n 1)
    echo "  📌 $version"
    
    major_version=$(psql -d "$DB_NAME" -t -c "SHOW server_version;" | cut -d'.' -f1 | tr -d ' ')
    
    if [ "$major_version" -ge 13 ]; then
        echo "    ✅ PostgreSQL version compatible"
    else
        echo "    ⚠️ PostgreSQL version might be too old (recommended: 13+)"
    fi
}

# Function to show summary
show_summary() {
    echo ""
    echo "=========================================="
    echo "📊 VERIFICATION SUMMARY"
    echo "=========================================="
    
    if [ $EXIT_CODE -eq 0 ]; then
        echo "🎉 SUCCESS: Database setup is complete and working!"
        echo ""
        echo "Next steps:"
        echo "1. Update your .env.local file with the DATABASE_URL"
        echo "2. Test your application connection"
        echo "3. Run your application!"
        echo ""
        echo "Example DATABASE_URL for your .env.local:"
        echo "DATABASE_URL=postgresql://$(whoami)@localhost:5432/$DB_NAME"
    else
        echo "⚠️ ISSUES FOUND: Some components are missing or broken"
        echo ""
        echo "Troubleshooting steps:"
        echo "1. Re-run: psql -d $DB_NAME -f database_schema_backup.sql"
        echo "2. Check PostgreSQL logs: tail -f /var/log/postgresql/*.log"
        echo "3. Verify PostgreSQL is running: sudo systemctl status postgresql"
        echo "4. Check database permissions for user: $(whoami)"
    fi
}

# Main execution
main() {
    echo "Starting verification..."
    
    # Check if PostgreSQL is accessible
    if ! command -v psql &> /dev/null; then
        echo "❌ PostgreSQL client (psql) not found!"
        echo "Please install PostgreSQL client or ensure it's in your PATH"
        exit 1
    fi
    
    # Run all checks
    check_database
    check_tables
    check_sequences
    check_indexes
    check_functions
    check_views
    test_queries
    check_postgresql
    
    # Show summary
    show_summary
    
    exit $EXIT_CODE
}

# Run main function
main