# Contributing to ISO Certificate Management System

Thank you for your interest in contributing to the ISO Certificate Management System! This document provides guidelines and information for contributors.

## 🚀 Quick Start for Contributors

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/iso-certificate-management.git
   cd iso-certificate-management
   ```

2. **Setup development environment**
   ```bash
   ./setup.sh  # Linux/Mac
   # or
   setup.bat   # Windows
   ```

3. **Start development**
   ```bash
   npm run dev
   ```

## 📋 Development Guidelines

### Code Style

- **Backend**: Follow Node.js best practices
- **Frontend**: Use React functional components with hooks
- **Styling**: Use Tailwind CSS utilities
- **Database**: SQLite with proper indexing

### Commit Convention

Use conventional commits:
```
feat: add new client export feature
fix: resolve certificate date calculation bug
docs: update API documentation
style: format code with prettier
refactor: improve notification service
test: add unit tests for date helpers
```

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring

## 🧪 Testing

Before submitting a pull request:

1. **Test the application**
   ```bash
   npm run dev
   # Test all major features
   ```

2. **Check Docker build**
   ```bash
   cd docker
   docker-compose up --build
   ```

3. **Verify no errors in console**

## 📝 Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the coding standards
   - Add comments for complex logic
   - Update documentation if needed

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

4. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Submit pull request**
   - Provide clear description
   - Include screenshots if UI changes
   - Reference any related issues

## 🐛 Bug Reports

When reporting bugs, please include:

- **Environment**: OS, Node.js version, browser
- **Steps to reproduce**: Clear steps to reproduce the issue
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happens
- **Screenshots**: If applicable
- **Error logs**: Console errors or server logs

## 💡 Feature Requests

For new features:

- **Use case**: Describe the problem you're trying to solve
- **Proposed solution**: How you envision the feature working
- **Alternatives**: Other solutions you've considered
- **Additional context**: Screenshots, mockups, examples

## 🏗️ Architecture Overview

### Backend Structure
```
backend/
├── config/          # Database configuration
├── controllers/     # Route handlers
├── routes/         # API endpoints
├── services/       # Business logic
├── utils/          # Helper functions
└── server.js       # Entry point
```

### Frontend Structure
```
frontend/src/
├── components/     # React components
│   ├── common/     # Reusable components
│   ├── Layout/     # Layout components
│   └── [Feature]/  # Feature-specific components
├── services/       # API calls
├── utils/          # Helper functions
└── App.jsx         # Main app component
```

## 📊 Database Schema

### Main Tables
- **clients**: Client information and certificate details
- **notifications**: In-app notifications
- **system_logs**: System activity logs

### Key Fields
- `certificate_expiry_date`: Certificate expiration date
- `days_remaining`: Calculated field for status
- `status`: Active/Expired status

## 🎨 UI/UX Guidelines

### Color Scheme
- **Success**: Green (#059669) - Active certificates
- **Warning**: Yellow (#d97706) - <45 days remaining
- **Danger**: Red (#dc2626) - <30 days remaining
- **Expired**: Black (#000000) - Expired certificates

### Component Standards
- Use consistent spacing (Tailwind classes)
- Include loading states
- Add proper error handling
- Ensure responsive design

## 🔒 Security Considerations

- **Input validation**: Validate all user inputs
- **SQL injection**: Use parameterized queries
- **XSS protection**: Sanitize output
- **CORS**: Configure properly for production
- **Environment variables**: Keep secrets in .env files

## 📈 Performance Guidelines

- **Database**: Index frequently queried fields
- **Frontend**: Use React.memo for expensive components
- **Images**: Optimize and compress images
- **Bundle size**: Keep dependencies minimal
- **API**: Implement pagination for large datasets

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production
```bash
# Docker (recommended)
cd docker
docker-compose up -d

# Manual
npm run build
npm start
```

## 📞 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For questions and general discussion
- **Email**: [your-email] for security issues

## 🏆 Recognition

Contributors will be acknowledged in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing! 🎉