# Postman Testing Guide

- Auth Module
- Admin Module
- Seller Module
- Manufacturer Module
- Category Module
- Medicine Module
- Cart Module
- Order Module
- Review Module
- Stats Module

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
- `medicineId`: `<set-after-create>`
- `orderId`: `<set-after-order-create>`
- `orderItemId`: `<set-after-order-create>`
- `reviewId`: `<set-after-review-create>`

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

### 3.1 Get All Users (Admin only)

- Method: `GET`
- URL: `{{baseUrl}}/admin/users`
- Auth: admin cookies
- Query examples:

```text
?searchTerm=rahim&role=CUSTOMER&status=ACTIVE&page=1&limit=10&sortBy=createdAt&sortOrder=desc
```

### 3.2 Ban or Activate User

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

## 7. Medicine APIs

### 7.1 Create Medicine

- Method: `POST`
- URL: `{{baseUrl}}/medicine`
- Auth: seller cookies
- Body: `form-data`
- Key `file`: optional medicine image
- Key `data`: JSON string

```json
{
  "name": "Paracetamol 500mg",
  "description": "Pain relief and fever reducer",
  "price": 25,
  "stock": 100,
  "dosageForm": "Tablet",
  "strength": "500mg",
  "categoryId": "<category-uuid>",
  "manufacturerId": "<manufacturer-uuid>",
  "isAvailable": true,
  "isFeatured": false
}
```

Success response example:

```json
{
  "success": true,
  "message": "Medicine created successfully",
  "data": {
    "id": "medicine-id"
  }
}
```

Error response example (invalid seller):

```json
{
  "success": false,
  "message": "Seller profile not found"
}
```

### 7.2 Get All Medicines

- Method: `GET`
- URL: `{{baseUrl}}/medicine`
- Public API

Query examples:

```text
?searchTerm=para&categoryId=<category-uuid>&manufacturerId=<manufacturer-uuid>&price[gte]=10&price[lte]=50&sortBy=price&sortOrder=asc&page=1&limit=10
```

Success response example:

```json
{
  "success": true,
  "message": "Medicines fetched successfully",
  "data": {
    "data": [],
    "meta": {
      "page": 1,
      "limit": 10,
      "total": 0,
      "totalPages": 0
    }
  }
}
```

### 7.3 Get Medicine By Id

- Method: `GET`
- URL: `{{baseUrl}}/medicine/:id`
- Public API

Success response example:

```json
{
  "success": true,
  "message": "Medicine fetched successfully",
  "data": {
    "id": "medicine-id",
    "name": "Paracetamol 500mg"
  }
}
```

### 7.4 Get Medicines By Seller

- Method: `GET`
- URL: `{{baseUrl}}/medicine/seller`
- Auth: seller cookies
- Query examples:

```text
?searchTerm=para&isAvailable=true&isFeatured=false&sortBy=createdAt&sortOrder=desc&page=1&limit=10
```

### 7.5 Update Medicine

- Method: `PATCH`
- URL: `{{baseUrl}}/medicine/:id`
- Auth: seller cookies
- Body: `form-data` or `raw JSON`

```json
{
  "name": "Paracetamol 650mg",
  "price": 30,
  "stock": 80,
  "isFeatured": true
}
```

Success response example:

```json
{
  "success": true,
  "message": "Medicine updated successfully",
  "data": {
    "id": "medicine-id",
    "name": "Paracetamol 650mg"
  }
}
```

### 7.6 Delete Medicine (Soft Delete)

- Method: `DELETE`
- URL: `{{baseUrl}}/medicine/:id`
- Auth: seller cookies

Behavior:

- Medicine is not removed from the database.
- `isAvailable` becomes `false`.
- `stock` becomes `0`.
- `price` becomes `0`.
- `isFeatured` becomes `false`.

## 8. Cart APIs

### 8.1 Add To Cart (Customer only)

- Method: `POST`
- URL: `{{baseUrl}}/cart`
- Auth: customer cookies
- Body:

```json
{
  "medicineId": "{{medicineId}}",
  "quantity": 2
}
```

Notes:

- If cart does not exist, it will be created.
- If same medicine exists, quantity is incremented.
- Stock and availability are validated before update.

### 8.2 Get Cart (Customer only)

- Method: `GET`
- URL: `{{baseUrl}}/cart`

### 8.3 Update Cart Item Quantity (Customer only)

- Method: `PATCH`
- URL: `{{baseUrl}}/cart`
- Body with direct set:

```json
{
  "medicineId": "{{medicineId}}",
  "quantity": 3
}
```

- Body with incremental/decremental update:

```json
{
  "medicineId": "{{medicineId}}",
  "quantityChange": -1
}
```

Note: if resulting quantity is `0` or below, the cart item is removed.

### 8.4 Remove Cart Item (Customer only)

- Method: `DELETE`
- URL: `{{baseUrl}}/cart/:medicineId`

### 8.5 Clear Cart (Customer only)

- Method: `DELETE`
- URL: `{{baseUrl}}/cart`

## 9. Order APIs

### 9.1 Create Order From Cart (Customer only)

- Method: `POST`
- URL: `{{baseUrl}}/order`
- Auth: customer cookies
- Body:

```json
{
  "shippingName": "Customer One",
  "shippingPhone": "+8801712345678",
  "shippingAddress": "House 10, Road 12",
  "shippingCity": "Dhaka",
  "note": "Deliver in evening"
}
```

Behavior:

- Validates all cart medicines for stock and availability.
- Creates one parent order with multiple seller orders.
- Creates order items for each seller group.
- Clears cart and resets cart subtotal.

### 9.2 Get Orders (Combined role-based endpoint)

- Method: `GET`
- URL: `{{baseUrl}}/order`
- Auth: admin/customer/seller cookies

Role behavior:

- Admin sees all orders.
- Customer sees own orders.
- Seller sees only orders containing seller items.

Query examples:

```text
?status=PLACED&paymentStatus=UNPAID&sellerOrders.seller.shopName=Good%20Health&page=1&limit=10
```

Seller-focused query example:

```text
?customer.name=Customer%20One&status=PROCESSING&page=1&limit=10
```

### 9.3 Get Order By Id (Customer or Admin)

- Method: `GET`
- URL: `{{baseUrl}}/order/:id`

### 9.4 Cancel Order (Customer only)

- Method: `PATCH`
- URL: `{{baseUrl}}/order/:id/cancel`

Rule:

- Only `PLACED` orders can be cancelled by customer.

### 9.5 Update Order Status (Seller only)

- Method: `PATCH`
- URL: `{{baseUrl}}/order/:id/status`
- Body:

```json
{
  "status": "PROCESSING"
}
```

Allowed status transitions:

- `PLACED -> PROCESSING`
- `PROCESSING -> SHIPPED` or `PROCESSING -> CANCELLED`
- `SHIPPED -> DELIVERED`

## 10. Review APIs

### 10.1 Create Review (Customer only)

- Method: `POST`
- URL: `{{baseUrl}}/review`
- Body:

```json
{
  "orderItemId": "{{orderItemId}}",
  "rating": 5,
  "comment": "Great medicine"
}
```

Rules:

- Customer must own the order item.
- Related order status must be `DELIVERED`.
- One review per order item.

### 10.2 Get Reviews By Medicine Id (Public)

- Method: `GET`
- URL: `{{baseUrl}}/review/medicine/:medicineId`

### 10.3 Update Review (Customer own or Admin any)

- Method: `PATCH`
- URL: `{{baseUrl}}/review/:id`
- Auth: customer/admin cookies

### 10.4 Delete Review (Customer own or Admin any)

- Method: `DELETE`
- URL: `{{baseUrl}}/review/:id`
- Auth: customer/admin cookies

Note:

- After create/update/delete, medicine average rating and review count are recalculated.

## 11. Stats APIs

### 11.1 Get Dashboard Stats (Role based)

- Method: `GET`
- URL: `{{baseUrl}}/stats/dashboard`
- Auth: customer/seller/admin cookies

Role outputs:

- Customer: total order count, total amount spent, total medicine bought.
- Seller: total order count, total sales (delivered), total amount earned/revenue, total medicine sold.
- Admin: total users, role-wise user counts, total orders, platform amount earned.

## 12. Suggested Postman Test Flow

1. Register and verify one customer.
2. Login as admin and create manufacturer + category.
3. Create seller profile and login as seller.
4. Create medicine as seller and save `medicineId`.
5. Login as customer and add medicine to cart.
6. Place order from cart and save `orderId` and `orderItemId`.
7. Seller updates order status to `PROCESSING`, then `SHIPPED`, then `DELIVERED`.
8. Customer creates review for `orderItemId`.
9. Customer/admin updates and deletes review and verify medicine rating changes.
10. Verify role-based `/order` endpoint with admin, customer, seller cookies.
11. Verify `/stats/dashboard` for each role.
12. Test admin user moderation (`GET /admin/users`, `PATCH /admin/users/:userId/status`).

## 13. Validation and Security Notes

- Zod validation is enabled for create/update payloads across auth/admin/order/cart/review modules.
- Protected routes enforce role checks with `checkAuth(...)`.
- Cart and order flows validate medicine availability and stock.
- Order placement and cancellation operations are transaction-based to keep data consistent.
- Order status updates enforce strict transition flow.
- Review creation enforces verified purchase and delivered-order checks.
- Review create/update/delete keeps medicine `avgRating` and `reviewCount` synchronized.
