# URL Shortener Runbook

This runbook provides operational guidance for deploying, monitoring, and troubleshooting the URL Shortener application.

## Table of Contents

1. [Deployment](#deployment)
2. [Monitoring](#monitoring)
3. [Troubleshooting](#troubleshooting)
4. [Database Operations](#database-operations)
5. [Performance Optimization](#performance-optimization)
6. [Security](#security)
7. [Backup and Recovery](#backup-and-recovery)

## Deployment

### Prerequisites

- Supabase project with database schema applied
- Environment variables configured
- Node.js 18+ installed

### Production Deployment Checklist

- [ ] Database schema applied (`scripts/db-init.sql`)
- [ ] Environment variables set in production
- [ ] Rate limiting configured appropriately
- [ ] CORS settings verified
- [ ] Security headers configured
- [ ] SSL/TLS enabled
- [ ] Error logging configured
- [ ] Database backups enabled

### Deployment Steps

#### Vercel Deployment

1. Connect GitHub repository to Vercel
2. Configure environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_BASE_URL`
3. Deploy from main branch

#### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Environment Configuration

Production environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_BASE_URL=https://your-domain.com
RATE_LIMIT_MAX_REQUESTS=10
RATE_LIMIT_WINDOW_MS=60000
```

## Monitoring

### Key Metrics to Monitor

1. **Application Metrics**
   - Request rate
   - Response time
   - Error rate
   - Rate limit hits

2. **Database Metrics**
   - Connection pool usage
   - Query performance
   - Storage usage
   - Active connections

3. **Business Metrics**
   - Total links created
   - Total clicks
   - Average clicks per link
   - Custom alias usage rate

### Logging

Application logs include:
- API request/response
- Database errors
- Rate limiting events
- Validation errors

Access logs:
```bash
# Vercel
vercel logs

# PM2
pm2 logs url-shortener
```

### Health Checks

Create a health check endpoint to monitor:
- Database connectivity
- API responsiveness

```bash
curl https://your-domain.com/api/analytics
```

## Troubleshooting

### Common Issues

#### Issue: Rate Limit Too Restrictive

**Symptoms**: Legitimate users getting rate limited

**Solution**:
1. Increase `RATE_LIMIT_MAX_REQUESTS`
2. Increase `RATE_LIMIT_WINDOW_MS`
3. Consider implementing user authentication for higher limits

```env
RATE_LIMIT_MAX_REQUESTS=20
RATE_LIMIT_WINDOW_MS=60000
```

#### Issue: Database Connection Errors

**Symptoms**: 500 errors, "Failed to connect to database"

**Solution**:
1. Check Supabase project status
2. Verify environment variables
3. Check connection pool settings
4. Review Supabase logs

```bash
# Verify connection
curl -X GET 'https://your-project.supabase.co/rest/v1/' \
  -H "apikey: your-anon-key"
```

#### Issue: Slow Query Performance

**Symptoms**: API responses taking > 1 second

**Solution**:
1. Check database indexes
2. Review query plans
3. Consider adding caching
4. Optimize Supabase queries

```sql
-- Check index usage
EXPLAIN ANALYZE SELECT * FROM links WHERE short_id = 'abc123';
```

#### Issue: Short ID Collisions

**Symptoms**: "Alias already exists" for random IDs

**Solution**:
1. Increase `SHORT_ID_LENGTH` in constants
2. Check collision rate in logs
3. Verify random generation is working

#### Issue: QR Code Generation Fails

**Symptoms**: Short links created without QR codes

**Solution**:
1. Check QRCode library installation
2. Verify data URL generation
3. Review error logs
4. Test QR code generation separately

### Error Codes

| Code | Description | Action |
|------|-------------|--------|
| 400 | Bad Request | Check request validation |
| 404 | Link Not Found | Verify short ID exists |
| 409 | Alias Exists | Choose different alias |
| 429 | Rate Limited | Wait or increase limits |
| 500 | Server Error | Check logs and database |

## Database Operations

### Database Maintenance

#### View Table Statistics

```sql
SELECT 
  COUNT(*) as total_links,
  SUM(click_count) as total_clicks,
  AVG(click_count) as avg_clicks
FROM links;
```

#### Clean Up Old Links (Optional)

```sql
-- Delete links older than 1 year with 0 clicks
DELETE FROM links 
WHERE created_at < NOW() - INTERVAL '1 year' 
AND click_count = 0;
```

#### Rebuild Indexes

```sql
REINDEX TABLE links;
```

### Schema Migrations

To modify the schema:

1. Create migration file
2. Test in development
3. Apply to production during maintenance window
4. Verify with SELECT queries

### Performance Queries

```sql
-- Top 10 most clicked links
SELECT short_id, original_url, click_count
FROM links
ORDER BY click_count DESC
LIMIT 10;

-- Links created today
SELECT COUNT(*)
FROM links
WHERE created_at >= CURRENT_DATE;

-- Average clicks by custom vs generated
SELECT 
  custom_alias,
  AVG(click_count) as avg_clicks
FROM links
GROUP BY custom_alias;
```

## Performance Optimization

### Database Optimization

1. **Indexes**: Ensure all indexes are created
2. **Connection Pooling**: Configure Supabase pooler
3. **Query Optimization**: Use parameterized queries
4. **Vacuuming**: Let Supabase handle auto-vacuum

### Application Optimization

1. **Caching**: Consider Redis for frequent queries
2. **CDN**: Use CDN for static assets
3. **Compression**: Enable gzip/brotli
4. **Image Optimization**: QR codes are already optimized

### Monitoring Performance

```bash
# Check build size
npm run build

# Analyze bundle
npx @next/bundle-analyzer
```

## Security

### Security Checklist

- [ ] Environment variables secured
- [ ] Row Level Security enabled
- [ ] Rate limiting active
- [ ] Input validation with Zod
- [ ] Parameterized queries only
- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] Dependencies updated

### Security Monitoring

Monitor for:
- Unusual rate limit hits
- Invalid URL attempts
- SQL injection attempts
- XSS attempts

### Updating Dependencies

```bash
# Check for vulnerabilities
npm audit

# Update dependencies
npm update

# Fix vulnerabilities
npm audit fix
```

### API Key Rotation

1. Generate new Supabase keys
2. Update environment variables
3. Test application
4. Revoke old keys

## Backup and Recovery

### Database Backups

Supabase provides automatic backups:
- Daily backups retained for 7 days (free tier)
- Point-in-time recovery (paid tier)

### Manual Backup

```bash
# Export data
curl 'https://your-project.supabase.co/rest/v1/links?select=*' \
  -H "apikey: your-service-role-key" \
  > backup.json
```

### Recovery Procedures

#### Restore from Backup

1. Access Supabase dashboard
2. Navigate to Database > Backups
3. Select backup to restore
4. Confirm restoration

#### Data Recovery

```sql
-- Restore deleted link (if using soft deletes)
UPDATE links 
SET deleted_at = NULL 
WHERE short_id = 'abc123';
```

### Disaster Recovery Plan

1. **Database Failure**: Restore from Supabase backup
2. **Application Failure**: Redeploy from GitHub
3. **Data Corruption**: Restore from last known good backup
4. **Security Breach**: Rotate all keys, audit logs, restore clean backup

## Maintenance Windows

### Recommended Maintenance Tasks

**Weekly:**
- Review error logs
- Check performance metrics
- Verify backup success

**Monthly:**
- Update dependencies
- Review security advisories
- Analyze usage patterns
- Clean up old data (optional)

**Quarterly:**
- Full security audit
- Performance optimization review
- Capacity planning

## Contact and Escalation

### Support Levels

**Level 1**: Application errors
- Check logs
- Verify environment variables
- Restart application

**Level 2**: Database issues
- Check Supabase status
- Review query performance
- Contact Supabase support

**Level 3**: Critical outages
- Implement disaster recovery
- Escalate to senior engineers
- Communicate with stakeholders

## Appendix

### Useful Commands

```bash
# Check application health
curl https://your-domain.com/api/analytics

# Test rate limiting
for i in {1..10}; do curl -X POST https://your-domain.com/api/shorten; done

# View database size
# Run in Supabase SQL Editor
SELECT pg_size_pretty(pg_database_size('postgres'));

# Monitor active connections
SELECT count(*) FROM pg_stat_activity;
```

### Configuration Templates

See `.env.local.example` for environment variable template.

### External Resources

- Next.js Documentation: https://nextjs.org/docs
- Supabase Documentation: https://supabase.com/docs
- Vercel Deployment: https://vercel.com/docs
