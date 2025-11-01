# URL Shortener Operations Runbook

This document provides operational procedures and troubleshooting guide for the URL Shortener application.

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Common Operations](#common-operations)
- [Troubleshooting](#troubleshooting)
- [Monitoring & Alerts](#monitoring--alerts)
- [Backup & Recovery](#backup--recovery)
- [Performance Optimization](#performance-optimization)
- [Security](#security)
- [Scaling](#scaling)

## 🚀 Getting Started

### Initial Setup Checklist

- [ ] Environment variables configured
- [ ] Database schema created
- [ ] Dependencies installed
- [ ] Application builds successfully
- [ ] Tests passing
- [ ] Rate limiting configured

### Verify Installation

```bash
# 1. Check environment variables
cat .env.local

# 2. Test database connection
npm run typecheck
npm run test

# 3. Start development server
npm run dev

# 4. Test API endpoints
curl -X POST http://localhost:3000/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
```

## 🔧 Common Operations

### Database Management

#### Connect to Database
```bash
# Via Supabase CLI (recommended)
npx supabase db connect

# Or use SQL Editor in Supabase dashboard
# https://app.supabase.com/project/YOUR_PROJECT_ID/sql-editor
```

#### Check Database Health
```sql
-- Check table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'links'
ORDER BY ordinal_position;

-- Check index performance
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'links';

-- Check recent inserts
SELECT COUNT(*) as total_links, 
       MAX(created_at) as latest_link 
FROM links;

-- Check table size
SELECT 
  pg_size_pretty(pg_total_relation_size('links')) as size,
  pg_size_pretty(pg_relation_size('links')) as table_size,
  pg_size_pretty(pg_total_relation_size('links') - pg_relation_size('links')) as index_size;
```

#### Monitor Query Performance
```sql
-- Enable query statistics (requires admin access)
LOAD 'pg_stat_statements';

-- Find slow queries
SELECT query, calls, total_time, mean_time, rows
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Check for missing indexes
SELECT schemaname, tablename, seq_scan, seq_tup_read, idx_scan, idx_tup_fetch
FROM pg_stat_user_tables
WHERE seq_scan > 1000
ORDER BY seq_scan DESC;
```

### Application Management

#### View Logs
```bash
# Development logs
npm run dev

# Production logs (Vercel example)
vercel logs

# Browser console (for frontend errors)
# Open Developer Tools > Console
```

#### Restart Application
```bash
# Development
Ctrl+C and run npm run dev

# Production (Vercel)
vercel --prod

# Docker
docker-compose restart
```

#### Check Application Health
```bash
# Test API health
curl -f http://localhost:3000/api/analytics

# Test database connectivity
npm run typecheck

# Run test suite
npm run test:run
```

### User Activity Monitoring

#### Track Link Usage
```sql
-- Most popular links
SELECT short_id, click_count, original_url
FROM links
ORDER BY click_count DESC
LIMIT 10;

-- Recent activity
SELECT short_id, last_accessed, click_count
FROM links
WHERE last_accessed > NOW() - INTERVAL '24 hours'
ORDER BY last_accessed DESC;

-- Links with zero clicks
SELECT short_id, original_url, created_at
FROM links
WHERE click_count = 0
ORDER BY created_at DESC;
```

## 🐛 Troubleshooting

### Common Error Messages

#### "Database connection failed"
**Symptoms:**
- Application shows "Failed to fetch" errors
- API requests return 500 errors
- Logs show connection errors

**Solutions:**
1. Check Supabase credentials in environment variables
2. Verify Supabase project is active
3. Check network connectivity
4. Ensure service role key has correct permissions

```bash
# Test connection
node -e "
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
supabase.from('links').select('count').limit(1)
  .then(() => console.log('✅ Database connected'))
  .catch(err => console.error('❌ Database error:', err.message));
"
```

#### "Rate limit exceeded"
**Symptoms:**
- Users get 429 errors
- "Too many requests" messages

**Solutions:**
1. Check rate limit configuration
2. Increase `RATE_LIMIT_PER_MINUTE` if needed
3. Investigate potential abuse

```javascript
// Check current rate limit
console.log('Rate limit:', process.env.RATE_LIMIT_PER_MINUTE);

// Test rate limiting
for (let i = 0; i < 10; i++) {
  fetch('/api/shorten', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: `https://example${i}.com` })
  }).then(r => console.log(`${i}: ${r.status}`));
}
```

#### "Invalid URL" errors
**Symptoms:**
- Valid URLs being rejected
- Validation errors on legitimate inputs

**Solutions:**
1. Check URL validation logic in `lib/utils.ts`
2. Verify URL normalization
3. Test with problematic URLs

```javascript
// Test URL validation
const { isValidUrl, normalizeUrl } = require('./lib/utils');
console.log('Valid:', isValidUrl('https://example.com'));
console.log('Normalized:', normalizeUrl('example.com'));
```

#### "QR code generation failed"
**Symptoms:**
- Links created but no QR codes
- Console errors about QR generation

**Solutions:**
1. Check `qrcode` dependency is installed
2. Verify memory/CPU resources
3. Implement fallback behavior

```bash
# Check qrcode package
npm list qrcode
npm install qrcode@latest
```

### Performance Issues

#### Slow API Response Times
**Diagnosis:**
```bash
# Time API requests
time curl -X POST http://localhost:3000/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'

# Check database query times
# Add EXPLAIN ANALYZE to slow queries
```

**Solutions:**
1. Add database indexes
2. Implement query optimization
3. Add Redis caching for frequent queries
4. Optimize bundle size

#### High Memory Usage
**Diagnosis:**
```bash
# Monitor memory usage
top -p $(pgrep -f "next.*dev")

# Check for memory leaks in browser dev tools
# Profile memory usage in Chrome DevTools
```

**Solutions:**
1. Clear test data regularly
2. Implement pagination for large datasets
3. Use React.memo for expensive components
4. Implement proper cleanup in useEffect hooks

### Build & Deployment Issues

#### Build Failures
**Common Causes:**
- TypeScript errors
- Missing dependencies
- Environment variable issues

**Solutions:**
```bash
# Clear cache and reinstall
rm -rf .next node_modules package-lock.json
npm install

# Check TypeScript issues
npm run typecheck

# Fix linting issues
npm run lint:fix
```

#### Deployment Issues
```bash
# Vercel specific
vercel --prod
vercel logs
vercel env ls

# Docker specific
docker build -t url-shortener .
docker run -p 3000:3000 url-shortener
```

## 📊 Monitoring & Alerts

### Key Metrics to Monitor

#### Database Metrics
```sql
-- Daily link creation rate
SELECT 
  DATE(created_at) as date,
  COUNT(*) as links_created
FROM links
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date;

-- Click performance
SELECT 
  DATE(last_accessed) as date,
  SUM(click_count) as total_clicks
FROM links
WHERE last_accessed >= NOW() - INTERVAL '30 days'
GROUP BY DATE(last_accessed)
ORDER BY date;
```

#### Application Metrics
- Response times for API endpoints
- Error rates (4xx, 5xx responses)
- Active connections
- Memory and CPU usage
- Database query performance

#### User Experience Metrics
- Link creation success rate
- Average links per session
- QR code generation success rate
- Page load times

### Setting Up Alerts

#### Database Alerts
```sql
-- Alert on excessive table growth
CREATE OR REPLACE FUNCTION check_table_growth()
RETURNS trigger AS $$
BEGIN
  IF (SELECT COUNT(*) FROM links) > 1000000 THEN
    RAISE NOTICE 'WARNING: Links table has over 1 million records!';
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER table_growth_check
AFTER INSERT ON links
FOR EACH STATEMENT
EXECUTE FUNCTION check_table_growth();
```

#### Application Monitoring
```javascript
// Add to your monitoring service
const metrics = {
  apiResponseTime: 'api_response_time_seconds',
  errorRate: 'http_requests_total{status=~"4..|5.."}',
  activeUsers: 'concurrent_users',
  databaseConnections: 'supabase_connections_active'
};
```

## 💾 Backup & Recovery

### Database Backup

#### Manual Backup
```bash
# Using Supabase CLI
npx supabase db dump --linked > backup_$(date +%Y%m%d_%H%M%S).sql

# Using pg_dump (if you have direct access)
pg_dump "postgresql://user:password@host:port/database" > backup.sql
```

#### Automated Backup (Supabase)
1. Go to Database > Backups in Supabase dashboard
2. Set up automatic daily backups
3. Test restore procedure

### Recovery Procedures

#### Database Recovery
```bash
# From Supabase backup
# 1. Create new database
# 2. Restore from backup
psql "postgresql://user:password@host:port/database" < backup.sql

# 3. Verify data integrity
SELECT COUNT(*) FROM links;
SELECT MIN(created_at), MAX(created_at) FROM links;
```

#### Application Recovery
```bash
# From git repository
git reset --hard HEAD
git clean -fd
npm install
npm run build
```

### Disaster Recovery Plan

1. **Immediate Response** (< 5 minutes)
   - Assess the extent of the issue
   - Notify stakeholders
   - Implement temporary fixes

2. **Short-term Recovery** (< 1 hour)
   - Restore from backups if needed
   - Fix immediate technical issues
   - Test critical functionality

3. **Long-term Recovery** (< 24 hours)
   - Full system restoration
   - Performance optimization
   - Post-incident review

## ⚡ Performance Optimization

### Database Optimization

#### Query Optimization
```sql
-- Add missing indexes
CREATE INDEX CONCURRENTLY idx_links_custom_alias ON links(custom_alias);
CREATE INDEX CONCURRENTLY idx_links_short_id_hash ON links USING hash(short_id);

-- Analyze query performance
EXPLAIN ANALYZE 
SELECT short_id, click_count 
FROM links 
WHERE created_at >= NOW() - INTERVAL '1 day' 
ORDER BY click_count DESC 
LIMIT 10;
```

#### Cleanup Old Data
```sql
-- Archive old links (optional)
CREATE TABLE links_archive AS 
SELECT * FROM links 
WHERE created_at < NOW() - INTERVAL '1 year';

-- Delete old links
DELETE FROM links 
WHERE created_at < NOW() - INTERVAL '1 year';

-- Vacuum and analyze
VACUUM ANALYZE links;
```

### Application Optimization

#### Caching Strategy
```javascript
// Implement Redis caching for analytics
const redis = require('redis');
const client = redis.createClient();

async function getAnalytics() {
  const cached = await client.get('analytics');
  if (cached) return JSON.parse(cached);
  
  const analytics = await fetchAnalytics();
  await client.setex('analytics', 300, JSON.stringify(analytics)); // 5 min cache
  return analytics;
}
```

#### Bundle Optimization
```bash
# Analyze bundle size
npm run build
npx @next/bundle-analyzer

# Code splitting
# Already implemented with Next.js dynamic imports
```

## 🔒 Security

### Security Monitoring

#### Monitor for Suspicious Activity
```sql
-- Multiple requests from same IP
SELECT ip_address, COUNT(*) as request_count
FROM (
  SELECT jsonb_extract_path_text(metadata, 'ip_address') as ip_address
  FROM links
) t
GROUP BY ip_address
HAVING COUNT(*) > 100
ORDER BY request_count DESC;

-- Unusual custom alias patterns
SELECT short_id, COUNT(*) as usage_count
FROM links
WHERE custom_alias = true
GROUP BY short_id
HAVING COUNT(*) > 1;
```

#### Rate Limiting Adjustments
```javascript
// Dynamic rate limiting based on IP reputation
const rateLimiter = new InMemoryRateLimiter(
  suspiciousIP ? 1 : RATE_LIMIT.DEFAULT_REQUESTS_PER_MINUTE
);
```

### Security Incident Response

1. **Immediate Actions**
   - Block malicious IPs
   - Increase rate limits
   - Enable additional monitoring

2. **Investigation**
   - Analyze logs and metrics
   - Identify attack vectors
   - Document findings

3. **Remediation**
   - Implement fixes
   - Update security policies
   - Monitor for recurring issues

## 📈 Scaling

### Horizontal Scaling

#### Database Scaling
```sql
-- Read replicas for analytics queries
-- Configure in Supabase dashboard
-- Use read replicas for analytics endpoints
```

#### Application Scaling
```javascript
// Load balancing with multiple instances
// Already handled by Vercel/other platforms
// Implement sticky sessions if needed
```

### Vertical Scaling

#### Resource Allocation
```bash
# Monitor resource usage
docker stats

# Scale up resources as needed
# Supabase automatically handles this
```

### Performance Monitoring

#### Key Performance Indicators
- Response time < 200ms (95th percentile)
- Uptime > 99.9%
- Error rate < 0.1%
- Database query time < 100ms

#### Scaling Triggers
- Response time consistently > 500ms
- Database connection pool exhaustion
- Memory usage > 80%
- CPU usage > 80%

## 🆘 Emergency Contacts

### Internal Team
- **DevOps Engineer**: [contact info]
- **Database Admin**: [contact info]
- **Security Team**: [contact info]

### External Services
- **Supabase Support**: [support contact]
- **Hosting Provider**: [support contact]
- **Domain Registrar**: [support contact]

### Escalation Process

1. **Level 1**: Self-service using this runbook
2. **Level 2**: Contact internal team
3. **Level 3**: Contact external service providers
4. **Level 4**: Escalate to management

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Monitoring Tools](https://github.com/topics/monitoring)

## 🔄 Version History

- **v1.0.0** (2024-01-01): Initial release
- Update this section when making significant changes

---

**Document Version**: 1.0  
**Last Updated**: 2024-01-01  
**Next Review**: 2024-04-01