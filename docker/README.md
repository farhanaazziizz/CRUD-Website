# Docker Setup for ISO Certificate Management System

This Docker setup provides a complete containerized environment for the ISO Certificate Management System.

## Quick Start

1. **Prerequisites**
   - Docker and Docker Compose installed
   - Ports 80 and 443 available on your host machine

2. **Run the application**
   ```bash
   cd docker
   docker-compose up -d
   ```

3. **Access the application**
   - Web Interface: http://your-server-ip:80
   - Backend API: http://your-server-ip:80/api

## Services

### Frontend (Nginx + React)
- **Port**: 80 (HTTP), 443 (HTTPS ready)
- **Technology**: React with Vite, served by Nginx
- **Features**:
  - Production-optimized build
  - Gzip compression
  - Security headers
  - SPA routing support
  - API proxy to backend

### Backend (Node.js)
- **Port**: 5000 (internal)
- **Technology**: Node.js with Express
- **Database**: SQLite (persistent volume)
- **Features**:
  - Health checks
  - Automatic database initialization
  - Certificate monitoring scheduler

## Docker Commands

### Start services
```bash
docker-compose up -d
```

### Stop services
```bash
docker-compose down
```

### View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f frontend
docker-compose logs -f backend
```

### Rebuild and restart
```bash
docker-compose down
docker-compose up --build -d
```

### Check service status
```bash
docker-compose ps
```

## Data Persistence

- Database data is stored in a Docker volume `backend_data`
- Data persists between container restarts
- To reset database: `docker-compose down -v` (removes volumes)

## Network Configuration

- Custom bridge network: `iso-management-network`
- Subnet: 172.20.0.0/16
- Services communicate internally via container names

## Health Checks

Both services include health checks:
- **Frontend**: HTTP check on port 80
- **Backend**: API health endpoint check

## Troubleshooting

1. **Port conflicts**
   ```bash
   # Check what's using port 80
   netstat -tulpn | grep :80

   # Stop conflicting services
   sudo systemctl stop apache2  # or nginx
   ```

2. **Permission issues**
   ```bash
   # Ensure Docker daemon is running
   sudo systemctl start docker

   # Add user to docker group
   sudo usermod -aG docker $USER
   ```

3. **Build issues**
   ```bash
   # Clean rebuild
   docker-compose down
   docker system prune -a
   docker-compose up --build
   ```

## Production Considerations

1. **SSL/HTTPS**: Add SSL certificates to nginx configuration
2. **Environment Variables**: Use .env file for production secrets
3. **Backup**: Regular backup of `backend_data` volume
4. **Monitoring**: Consider adding container monitoring
5. **Updates**: Plan for zero-downtime deployments