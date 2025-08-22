# Authentication Setup & Troubleshooting

## Overview
The Clicko Flow application uses JWT (JSON Web Token) authentication for securing API endpoints. During development, a demo token is automatically generated for testing purposes.

## Backend Configuration
- **JWT Secret**: `clicko-flow-secret-key-2025` (configured in `backend/.env`)
- **Port**: 5001 (configured in `backend/.env`)
- **Database**: MongoDB (configured in `backend/.env`)

## Frontend Configuration
- **API Base URL**: `http://localhost:5001/api`
- **Demo Token**: Automatically generated and stored in localStorage
- **Token Expiry**: 7 days from creation

## How It Works
1. When the frontend starts, it checks for an existing auth token in localStorage
2. If no token exists, it automatically creates a demo token
3. All API calls include the token in the Authorization header
4. The backend validates the token using the JWT secret

## Common Issues & Solutions

### 401 Unauthorized Error
**Symptoms**: API calls return 401 status with "Not authorized" message

**Causes**:
- Token has expired
- Token was created with wrong JWT secret
- Backend server is not running

**Solutions**:
1. **Refresh the page** - This will generate a new demo token
2. **Clear localStorage manually**:
   ```javascript
   localStorage.removeItem('authToken')
   ```
   Then refresh the page
3. **Check backend server** - Ensure it's running on port 5001
4. **Verify JWT secret** - Check that `backend/.env` has the correct `JWT_SECRET`

### Port Mismatch
**Symptoms**: Network errors or connection refused

**Solutions**:
1. Ensure backend is running on port 5001
2. Check `backend/.env` has `PORT=5001`
3. Verify frontend service uses `http://localhost:5001/api`

### Token Expiration
**Symptoms**: Suddenly getting 401 errors after working

**Solutions**:
1. Refresh the page to get a new token
2. Demo tokens expire after 7 days
3. In production, implement proper token refresh logic

## Development Commands

### Start Backend
```bash
cd backend
npm run dev
```

### Start Frontend
```bash
npm start
```

### Test Authentication
```bash
# Test health endpoint
curl http://localhost:5001/api/health

# Test authenticated endpoint
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5001/api/monthly-planning/August%202025
```

## Production Considerations
- Replace demo token with proper user authentication
- Implement secure token storage
- Add token refresh mechanism
- Use environment-specific JWT secrets
- Implement proper user registration and login

## Troubleshooting Tools
The application includes utility functions in `src/utils/tokenUtils.js`:
- `clearAuthToken()` - Remove current token
- `getCurrentToken()` - Get current token
- `validateToken()` - Test if token is valid
- `refreshDemoToken()` - Clear token and reload page

## Security Notes
⚠️ **Important**: The current setup uses a hardcoded JWT secret and demo token for development purposes only. This is NOT suitable for production use.

For production:
- Use strong, unique JWT secrets
- Implement proper user authentication
- Store tokens securely (httpOnly cookies, secure storage)
- Implement token rotation and expiration handling
- Add rate limiting and other security measures
