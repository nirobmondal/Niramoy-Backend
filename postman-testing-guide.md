# Postman Testing Guide

This guide covers all APIs currently implemented in this backend:

- Auth Module
- Admin Module
- Seller Module
- Manufacturer Module
- Category Module

## 1. Environment Setup

Create a Postman environment with these variables:

- `baseUrl`: `http://localhost:5000/api/v1`
- `customerEmail`: `customer1@example.com`
- `customerPassword`: `Pass@1234`
- `customerNewPassword`: `NewPass@1234`
- `adminEmail`: `admin@example.com`
- `adminPassword`: `Admin@1234`
- `sellerEmail`: `seller1@example.com`
- `sellerPassword`: `Seller@1234`
- `userIdToBan`: `<set-after-user-created>`
- `manufacturerId`: `<set-after-create>`
- `categoryId`: `<set-after-create>`

Important:

- Keep cookies enabled in Postman.
- This API uses cookie auth (`accessToken`, `refreshToken`, `better-auth.session_token`).
- For endpoints protected by `checkAuth`, login first from the same Postman collection/environment.

## 2. Auth APIs

### 2.1 Register Customer

- Method: `POST`
- URL: `{{baseUrl}}/auth/register/customer`
- Body: `form-data`
- Key `file`: optional image file
- Key `data`: JSON string

```json
{
  "name": "Customer One",
  "email": "{{customerEmail}}",
  "password": "{{customerPassword}}",
  "phone": "+8801712345678"
}
```

Success response example:

```json
{
  "success": true,
  "message": "Customer registered successfully",
  "data": {
    "accessToken": "...",
    "refreshToken": "...",
    "user": {
      "id": "usr_...",
      "email": "customer1@example.com"
    }
  }
}
```

Error response example (duplicate email):

```json
{
  "success": false,
  "message": "User already exists with this email",
  "errorSources": [
    {
      "path": "",
      "message": "User already exists with this email"
    }
  ]
}
```

### 2.2 Verify Email

- Method: `POST`
- URL: `{{baseUrl}}/auth/verify-email`
- Body: `raw JSON`

```json
{
  "email": "{{customerEmail}}",
  "otp": "123456"
}
```

### 2.3 Login

- Method: `POST`
- URL: `{{baseUrl}}/auth/login`
- Body: `raw JSON`

```json
{
  "email": "{{customerEmail}}",
  "password": "{{customerPassword}}"
}
```

Success response example:

```json
{
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

Error response example (wrong password):

```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

### 2.4 Get Me

- Method: `GET`
- URL: `{{baseUrl}}/auth/me`
- Auth: cookie from login

### 2.5 Update Me

- Method: `PATCH`
- URL: `{{baseUrl}}/auth/me`
- Body: either `raw JSON` or `form-data` (`file` + `data`)

```json
{
  "name": "Customer One Updated",
  "phone": "+8801812345678"
}
```

Seller update shape (seller only):

```json
{
  "name": "Seller Updated",
  "sellerProfile": {
    "shopName": "Good Health Store",
    "shopAddress": "Dhaka",
    "shopPhone": "+8801912345678"
  }
}
```

### 2.6 Refresh Token

- Method: `POST`
- URL: `{{baseUrl}}/auth/refresh-token`
- Body: `{}`

### 2.7 Change Password

- Method: `POST`
- URL: `{{baseUrl}}/auth/change-password`
- Body: `raw JSON`

```json
{
  "currentPassword": "{{customerPassword}}",
  "newPassword": "{{customerNewPassword}}"
}
```

### 2.8 Forgot Password

- Method: `POST`
- URL: `{{baseUrl}}/auth/forgot-password`
- Body:

```json
{
  "email": "{{customerEmail}}"
}
```

### 2.9 Reset Password

- Method: `POST`
- URL: `{{baseUrl}}/auth/reset-password`
- Body:

```json
{
  "email": "{{customerEmail}}",
  "otp": "123456",
  "newPassword": "{{customerNewPassword}}"
}
```

### 2.10 Logout

- Method: `POST`
- URL: `{{baseUrl}}/auth/logout`

### 2.11 Google OAuth

- `GET {{baseUrl}}/auth/login/google`
- `GET {{baseUrl}}/auth/google/success`
- `GET {{baseUrl}}/auth/google/error`

## 3. Admin APIs

### 3.1 Ban or Activate User

- Method: `PATCH`
- URL: `{{baseUrl}}/admin/users/:userId/status`
- Auth: admin cookies
- Body:

```json
{
  "status": "BANNED"
}
```

or

```json
{
  "status": "ACTIVE"
}
```

Success response example:

```json
{
  "success": true,
  "message": "User status updated successfully",
  "data": {
    "id": "user-id",
    "status": "BANNED"
  }
}
```

Error response example (not admin):

```json
{
  "success": false,
  "message": "Forbidden access! You do not have permission to access this resource."
}
```

Error response example (admin self-ban):

```json
{
  "success": false,
  "message": "Admin cannot change own status"
}
```

## 4. Seller APIs

### 4.1 Create Seller Profile (Application)

- Method: `POST`
- URL: `{{baseUrl}}/seller/create-profile`
- Auth: customer or seller cookies
- Body:

```json
{
  "shopName": "Good Health Pharmacy",
  "shopAddress": "Dhaka, Bangladesh",
  "shopPhone": "+8801911111111"
}
```

Behavior:

- Requires authenticated user.
- Fails for banned users.
- Creates seller profile and promotes user role to `SELLER`.

Error response example (already has seller profile):

```json
{
  "success": false,
  "message": "Seller profile already exists"
}
```

### 4.2 Seller Profile Update (Unified)

Seller profile update is handled through the unified user profile endpoint to reduce user confusion and avoid duplicated APIs.

- Method: `PATCH`
- URL: `{{baseUrl}}/auth/me`
- Auth: seller cookies
- Body:

```json
{
  "name": "Seller Updated",
  "sellerProfile": {
    "shopAddress": "Chattogram",
    "shopPhone": "+8801922222222"
  }
}
```

## 5. Manufacturer APIs

### 5.1 Create Manufacturer (Admin only)

- Method: `POST`
- URL: `{{baseUrl}}/manufacturer`
- Auth: admin cookies
- Body:

```json
{
  "name": "ACI Pharma",
  "country": "Bangladesh"
}
```

### 5.2 Get All Manufacturers (Public)

- Method: `GET`
- URL: `{{baseUrl}}/manufacturer`

### 5.3 Update Manufacturer (Admin only)

- Method: `PATCH`
- URL: `{{baseUrl}}/manufacturer/:id`
- Body:

```json
{
  "country": "India"
}
```

### 5.4 Delete Manufacturer (Admin only)

- Method: `DELETE`
- URL: `{{baseUrl}}/manufacturer/:id`

Error response example (medicine exists under this manufacturer):

```json
{
  "success": false,
  "message": "Manufacturer is associated with medicine. Cannot delete."
}
```

## 6. Category APIs

### 6.1 Create Category (Admin only)

- Method: `POST`
- URL: `{{baseUrl}}/category`
- Auth: admin cookies
- Body:

```json
{
  "name": "Pain Relief",
  "description": "Pain management medicines"
}
```

### 6.2 Get All Categories (Public)

- Method: `GET`
- URL: `{{baseUrl}}/category`

### 6.3 Update Category (Admin only)

- Method: `PATCH`
- URL: `{{baseUrl}}/category/:id`
- Body:

```json
{
  "description": "Updated category description"
}
```

### 6.4 Delete Category (Admin only)

- Method: `DELETE`
- URL: `{{baseUrl}}/category/:id`

Error response example (medicine exists under this category):

```json
{
  "success": false,
  "message": "Category is associated with a medicine. Cannot delete."
}
```

## 7. Suggested Postman Test Flow

1. Register customer
2. Verify customer email OTP
3. Login as customer
4. Create seller profile
5. Register/login as admin
6. Create manufacturer
7. Create category
8. Update manufacturer/category
9. Ban a normal user as admin
10. Try protected API using banned user and verify failure
11. Activate user again and verify login/access works

## 8. Validation and Security Notes

- Zod validation is enabled for all create/update payloads in admin/seller/manufacturer/category/auth modules.
- Protected routes use `checkAuth(...)` and role enforcement.
- Banned users are blocked at middleware level and in key service checks.
- Deletion safety checks prevent deleting category/manufacturer when medicines depend on them.
- Status update to `BANNED` removes all user sessions immediately.
