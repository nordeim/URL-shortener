# URL Shortener - Local Development Setup Guide

## Overview
This guide helps you set up a local PostgreSQL database for the URL Shortener application using the provided schema backup.

## Prerequisites
- PostgreSQL 13+ installed locally
- Command line access to PostgreSQL
- Basic knowledge of PostgreSQL administration

## Quick Setup

### 1. Create Database
```bash
# Create a new database
createdb url_shortener_dev

# Or using SQL
psql -c "CREATE DATABASE url_shortener_dev;"
```

### 2. Import Schema
```bash
# Import the complete schema
psql -d url_shortener_dev -f database_schema_backup.sql

# Or import directly via psql
psql -d url_shortener_dev
\i database_schema_backup.sql
```

### 3. Verify Installation
```bash
# Connect to your database
psql -d url_shortener_dev

# List all tables
\dt

# Check sequences
\ds

# View table structure
\d+ public.links
\d+ public.urls
\d+ public.url_analytics
\d+ public.user_profiles
```

## Database Schema Overview

### Tables Created

1. **links** - Enhanced URL shortening table
   - `id` - Primary key (bigint)
   - `short_id` - Unique short code
   - `original_url` - Target URL
   - `click_count` - Total clicks
   - `created_at` - Creation timestamp
   - `last_accessed` - Last click timestamp
   - `custom_alias` - Whether using custom alias
   - `metadata` - JSONB for additional data

2. **urls** - Legacy URL table
   - `id` - Primary key (integer)
   - `url_code` - Unique short code
   - `original_url` - Target URL
   - `click_count` - Total clicks
   - `created_at` - Creation timestamp
   - `user_id` - Associated user (UUID)
   - `is_active` - Active status

3. **url_analytics** - Click tracking table
   - `id` - Primary key (integer)
   - `url_code` - Reference to short code
   - `clicked_at` - Click timestamp
   - `ip_address` - Visitor IP
   - `user_agent` - Browser info
   - `referrer` - Referring page
   - `country` - Visitor country
   - `city` - Visitor city

4. **user_profiles** - User management
   - `id` - Primary key (UUID)
   - `email` - User email (unique)
   - `created_at` - Registration timestamp
   - `updated_at` - Last update timestamp
   - `subscription_plan` - User plan type

### Sequences Created
- `links_id_seq` - For links table (bigint)
- `urls_id_seq` - For urls table (integer)
- `url_analytics_id_seq` - For analytics table (integer)

### Indexes Created
- Unique indexes on primary keys and unique constraints
- Performance indexes on frequently queried columns:
  - `short_id` in links table
  - `url_code` in urls and url_analytics tables
  - `created_at`, `click_count`, `last_accessed` for analytics

### Views Created
- `link_analytics_summary` - Aggregated analytics view combining links and url_analytics data

### Triggers Created
- `update_user_profiles_updated_at` - Automatically updates `updated_at` timestamp

## Integration with Application

### Environment Variables
Set these in your `.env.local` file:

```bash
# PostgreSQL connection (local)
DATABASE_URL=postgresql://username:password@localhost:5432/url_shortener_dev

# Supabase connection (production)
SUPABASE_URL=https://cgeyueqpzazsgtlzfvmx.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Connection Examples

#### Node.js/Python (Direct PostgreSQL)
```javascript
// Using pg library
const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Direct queries
const result = await pool.query('SELECT * FROM public.links LIMIT 5');
console.log(result.rows);
```

#### Supabase Client (Production)
```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
);

// Query data
const { data, error } = await supabase
    .from('links')
    .select('*')
    .limit(5);
```

## Sample Queries

### Basic Operations
```sql
-- Create a new shortened URL
INSERT INTO public.links (short_id, original_url) 
VALUES ('abc123', 'https://example.com');

-- Get analytics for a link
SELECT * FROM public.url_analytics 
WHERE url_code = 'abc123';

-- Get link summary with analytics
SELECT * FROM public.link_analytics_summary 
WHERE short_id = 'abc123';
```

### Analytics Queries
```sql
-- Top performing links
SELECT short_id, original_url, click_count, created_at 
FROM public.links 
ORDER BY click_count DESC 
LIMIT 10;

-- Recent clicks with geo data
SELECT url_code, clicked_at, country, city, ip_address
FROM public.url_analytics 
WHERE clicked_at > NOW() - INTERVAL '24 hours'
ORDER BY clicked_at DESC;
```

## Development Tips

### 1. Sample Data
The schema includes commented sample data. Uncomment and modify as needed:

```sql
-- Add sample links
INSERT INTO public.links (short_id, original_url, custom_alias, metadata) VALUES 
    ('demo', 'https://www.example.com', false, '{"title": "Demo Link"}'::jsonb),
    ('github', 'https://github.com', true, '{"title": "GitHub", "type": "social"}'::jsonb);
```

### 2. Reset Database
To start fresh:
```bash
# Drop and recreate database
dropdb url_shortener_dev
createdb url_shortener_dev
psql -d url_shortener_dev -f database_schema_backup.sql
```

### 3. Backup Current Local DB
To backup your current database:
```bash
pg_dump url_shortener_dev > backup_$(date +%Y%m%d_%H%M%S).sql
```

## Troubleshooting

### Common Issues

1. **Permission Denied**
   ```bash
   # Fix PostgreSQL permissions
   sudo chown -R postgres:postgres /var/lib/postgresql/data
   sudo systemctl restart postgresql
   ```

2. **Port Already in Use**
   ```bash
   # Check what's using port 5432
   lsof -i :5432
   # Kill process if needed
   kill -9 <PID>
   ```

3. **Extension Missing**
   ```sql
   -- Ensure pgcrypto extension is available
   CREATE EXTENSION IF NOT EXISTS "pgcrypto";
   ```

### Reset and Reinstall
If something goes wrong, this complete reset will fix most issues:

```bash
# Stop PostgreSQL
sudo systemctl stop postgresql

# Remove database files (WARNING: This deletes ALL data)
sudo rm -rf /var/lib/postgresql/*

# Start PostgreSQL
sudo systemctl start postgresql

# Recreate database
createdb url_shortener_dev
psql -d url_shortener_dev -f database_schema_backup.sql
```

## Performance Considerations

### For Development
- The current schema is optimized for development and testing
- All necessary indexes are included for good performance
- JSONB columns allow flexible metadata storage

### For Production
Consider these additions:
```sql
-- Partition analytics table by month
CREATE TABLE public.url_analytics_2025_01 PARTITION OF public.url_analytics
FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

-- Add more specific indexes for high-traffic scenarios
CREATE INDEX idx_analytics_date_country ON public.url_analytics (clicked_at, country);
```

## Support

If you encounter issues:
1. Check PostgreSQL logs: `tail -f /var/log/postgresql/postgresql-*.log`
2. Verify database connection: `psql -d url_shortener_dev -c "SELECT 1;"`
3. Ensure all tables exist: `\dt` in psql
4. Check sequence values: `SELECT * FROM public.links_id_seq;`

---
**Generated by MiniMax Agent** | **Database Version**: 1.0 | **Date**: 2025-11-06