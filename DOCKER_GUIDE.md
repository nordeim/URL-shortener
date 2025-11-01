# Docker Deployment Guide

## Quick Start

1. **Copy environment template:**
   ```bash
   cp .env.docker .env.docker.local
   ```

2. **Edit environment variables:**
   ```bash
   nano .env.docker.local
   ```
   
   Update the following variables:
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your actual Supabase anonymous key
   - `POSTGRES_PASSWORD`: Strong password for the database (use 'postgres' for local development)

3. **Start the application:**
   ```bash
   docker-compose --env-file .env.docker.local up --build
   ```

4. **Access the application:**
   - URL Shortener: http://localhost:3000
   - Database Adminer (optional): http://localhost:8080 (uncomment in docker-compose.yml)

## Commands

### Development
```bash
# Start services
docker-compose --env-file .env.docker.local up

# Start with logs
docker-compose --env-file .env.docker.local up --build

# View logs
docker-compose logs -f app
docker-compose logs -f database

# Execute commands in running container
docker-compose exec app sh
docker-compose exec database psql -U postgres -d postgres
```

### Production
```bash
# Start in detached mode
docker-compose --env-file .env.docker.local up -d --build

# Scale services (if needed)
docker-compose up -d --scale app=2

# Stop services
docker-compose down

# Stop and remove volumes (careful - this deletes all data)
docker-compose down -v
```

## Environment Variables

### Required
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `POSTGRES_PASSWORD`: Database password

### Optional
- `APP_PORT`: Application port (default: 3000)
- `DB_PORT`: Database port (default: 5432)
- `NODE_ENV`: Environment (default: production)

## Data Persistence

The following directories are created for data persistence:
- `./data/postgres`: Database files
- `./logs/postgres`: PostgreSQL logs
- `./logs/app`: Application logs

## Health Checks

Both services include health checks:
- **App**: Checks http://localhost:3000/api/health
- **Database**: Checks PostgreSQL connectivity

## Troubleshooting

### Common Issues

1. **Port already in use:**
   ```bash
   # Check what's using the port
   lsof -i :3000
   lsof -i :5432
   
   # Or use different ports in .env.docker.local
   APP_PORT=3001
   DB_PORT=5433
   ```

2. **Database connection failed:**
   - Check database logs: `docker-compose logs database`
   - Verify environment variables
   - Ensure database is healthy: `docker-compose ps`

3. **Build fails:**
   ```bash
   # Clean build
   docker-compose build --no-cache
   
   # Or prune Docker
   docker system prune -a
   ```

4. **Permission issues:**
   ```bash
   # Fix volume permissions
   sudo chown -R $USER:$USER data/ logs/
   ```

### Monitoring

```bash
# Check service status
docker-compose ps

# Monitor resource usage
docker stats

# View service logs
docker-compose logs --tail=100 app
docker-compose logs --tail=100 database
```

## Security Notes

1. **Never commit actual credentials** to version control
2. **Use strong passwords** in production
3. **Enable SSL/TLS** for database connections in production
4. **Regularly rotate** API keys and passwords
5. **Use secrets management** (like Docker Swarm secrets or external vault) for production

## Backup and Recovery

### Backup Database
```bash
docker-compose exec database pg_dump -U postgres -d postgres > backup.sql
```

### Restore Database
```bash
docker-compose exec -T database psql -U postgres -d postgres < backup.sql
```