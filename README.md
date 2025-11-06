# 🚀 SkyEats - Modern Grocery Delivery Platform

<div align="center">
  <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=400&fit=crop" alt="SkyEats Banner" width="800" height="400" style="border-radius: 10px;">
  
  [![React](https://img.shields.io/badge/React-18.0+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
  [![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.0+-6DB33F?style=for-the-badge&logo=spring&logoColor=white)](https://spring.io/projects/spring-boot)
  [![MongoDB](https://img.shields.io/badge/MongoDB-4.4+-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
  [![Firebase](https://img.shields.io/badge/Firebase-9.0+-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0+-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
</div>

## 📋 Table of Contents

- [🌟 Overview](#-overview)
- [✨ Key Features](#-key-features)
- [🔧 Additional Features](#-additional-features)
- [🏗️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
- [🔑 Environment Setup](#-environment-setup)
- [📱 API Documentation](#-api-documentation)
- [🎨 UI/UX Features](#-uiux-features)
- [🔒 Security Features](#-security-features)
- [📊 Performance Optimizations](#-performance-optimizations)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## 🌟 Overview

**SkyEats** is a modern, full-stack grocery delivery platform built with cutting-edge technologies. It provides a seamless shopping experience with real-time inventory management, secure authentication, and beautiful UI/UX design.

### 🎯 Mission
To revolutionize grocery shopping by providing fresh products with lightning-fast delivery, competitive pricing, and exceptional user experience.

## ✨ Key Features

### 🛒 **E-Commerce Core**
- **Product Catalog** - Browse thousands of fresh products across multiple categories
- **Smart Search** - Advanced search with filters and real-time suggestions
- **Shopping Cart** - Persistent cart with real-time stock validation
- **Secure Checkout** - Multiple payment options with detailed address collection
- **Order Management** - Complete order lifecycle from placement to delivery

### 🔐 **Authentication & Security**
- **Firebase Authentication** - Secure login/signup with email verification
- **JWT Token Management** - Stateless authentication with automatic token refresh
- **Protected Routes** - Role-based access control for sensitive operations
- **Input Validation** - Comprehensive server-side and client-side validation

### 📦 **Inventory Management**
- **Real-time Stock Tracking** - Live inventory updates across all operations
- **Category Management** - Organized product categorization with dynamic filtering
- **Stock Reservation** - Automatic stock reservation during checkout process
- **Low Stock Alerts** - Visual indicators for limited availability items

### 💳 **Payment & Pricing**
- **Dynamic Pricing** - Real-time price calculations with taxes and fees
- **Delivery Fee Logic** - Free delivery above ₹100, ₹30 fee below
- **GST Integration** - Automatic tax calculations (5% GST)
- **Platform Fees** - Transparent fee structure (₹5 handling charge)
- **Savings Display** - Clear breakdown of discounts and savings

### 🚚 **Order Processing**
- **Detailed Address Collection** - Comprehensive delivery address forms
- **Order Tracking** - Real-time order status updates
- **Order History** - Complete purchase history with detailed breakdowns
- **Status Management** - Multi-stage order processing workflow

## 🔧 Additional Features

### 🖼️ **Dynamic Image Management**
- **Smart Image Caching** - Intelligent caching to minimize API calls
- **Fallback System** - Two-tier image fallback (Database → Category defaults)
- **Category-Specific Images** - Optimized search queries for relevant product photos

### 🎨 **Advanced UI/UX**
- **Responsive Design** - Mobile-first approach with seamless desktop experience
- **Dark/Light Theme Support** - Automatic theme detection and manual toggle
- **Smooth Animations** - CSS transitions and micro-interactions
- **Loading States** - Skeleton screens and loading indicators
- **Toast Notifications** - Real-time feedback with custom positioning

### 📊 **Enhanced Shopping Experience**
- **Featured Products** - Daily deals with countdown timers and discounts
- **Category Showcase** - Visual category browsing with subcategory previews
- **Stock Progress Bars** - Visual stock level indicators
- **Quick Add Functionality** - One-click add to cart from product grids
- **Quantity Controls** - Intuitive increment/decrement controls

### 🔍 **Smart Features**
- **Auto-complete Search** - Intelligent search suggestions
- **Category Navigation** - Seamless navigation between categories and products
- **Stock Validation** - Real-time stock checking during cart operations
- **Price Calculations** - Dynamic pricing with delivery and tax calculations

### 📱 **Performance Features**
- **Code Splitting** - Optimized bundle sizes with lazy loading
- **Image Optimization** - Responsive images with proper sizing
- **API Caching** - Strategic caching for improved performance
- **Error Boundaries** - Graceful error handling and recovery

## 🏗️ Tech Stack

### **Frontend**
```javascript
{
  "framework": "React 18.2+",
  "styling": "Tailwind CSS 3.3+",
  "routing": "React Router DOM 6.8+",
  "state": "Context API + Hooks",
  "http": "Axios 1.3+",
  "icons": "Lucide React 0.263+",
  "notifications": "React Hot Toast 2.4+",
  "build": "Vite 4.3+"
}
```

### **Backend**
```java
{
  "framework": "Spring Boot 3.1+",
  "language": "Java 17+",
  "security": "Spring Security 6.0+",
  "database": "MongoDB 6.0+",
  "authentication": "Firebase Admin SDK",
  "validation": "Spring Boot Validation",
  "web": "Spring Web MVC"
}
```

### **Database & Storage**
```json
{
  "primary": "MongoDB Atlas",
  "authentication": "Firebase Auth",
  "storage": "Firebase Storage",
  "caching": "In-Memory Caching",
}
```

### **External APIs**
```json
{
  "authentication": "Firebase Auth",
  "payments": "Ready for integration",
  "notifications": "Firebase Cloud Messaging (Ready)"
}
```

## 📁 Project Structure

```
skyeats/
├── 📁 backend/                          # Spring Boot Backend
│   ├── 📁 src/main/java/com/skyeats/
│   │   ├── 📁 config/                   # Configuration classes
│   │   │   ├── 🔧 FirebaseConfig.java   # Firebase setup
│   │   │   └── 🔒 SecurityConfig.java   # Security configuration
│   │   ├── 📁 controller/               # REST Controllers
│   │   │   ├── 🛒 CartController.java   # Cart operations
│   │   │   ├── 📦 InventoryController.java # Product management
│   │   │   └── 📋 OrderController.java  # Order processing
│   │   ├── 📁 dto/                      # Data Transfer Objects
│   │   │   ├── 📄 CartItemDto.java      # Cart item structure
│   │   │   └── 📄 OrderDto.java         # Order structure
│   │   ├── 📁 model/                    # Entity models
│   │   │   └── 📦 InventoryItem.java    # Product model
│   │   ├── 📁 repository/               # Data repositories
│   │   │   └── 🗃️ InventoryRepository.java # Product data access
│   │   ├── 📁 security/                 # Security components
│   │   │   └── 🔐 FirebaseAuthenticationFilter.java
│   │   ├── 📁 service/                  # Business logic
│   │   │   ├── 🔥 FirestoreService.java # Database operations
│   │   │   └── 📦 InventoryService.java # Product logic
│   │   └── 🚀 SkyEatsApplication.java   # Main application
│   └── 📁 src/main/resources/
│       └── ⚙️ application.properties    # App configuration
├── 📁 frontend/                         # React Frontend
│   ├── 📁 public/                       # Static assets
│   │   └── 🌐 index.html               # HTML template
│   ├── 📁 src/
│   │   ├── 📁 components/               # Reusable components
│   │   │   ├── 🏪 CategoryShowcase.jsx  # Category grid
│   │   │   ├── ⭐ FeaturedProducts.jsx  # Daily deals
│   │   │   ├── 🎠 HeroSlideshow.jsx    # Hero carousel
│   │   │   ├── 🧭 Navbar.jsx           # Navigation bar
│   │   │   ├── 🔒 ProtectedRoute.jsx   # Route protection
│   │   │   └── 💀 ProductSkeleton.jsx  # Loading states
│   │   ├── 📁 contexts/                 # React contexts
│   │   │   ├── 🔐 AuthContext.jsx      # Authentication state
│   │   │   └── 🛒 CartContext.jsx      # Cart state management
│   │   ├── 📁 pages/                    # Main pages
│   │   │   ├── 🛒 Cart.jsx             # Shopping cart
│   │   │   ├── 💳 Checkout.jsx         # Checkout process
│   │   │   ├── 🏠 Home.jsx             # Homepage
│   │   │   ├── 🔑 Login.jsx            # User login
│   │   │   ├── 📋 Orders.jsx           # Order history
│   │   │   └── 📝 Register.jsx         # User registration
│   │   ├── 📁 services/                 # API services
│   │   │   └── 🌐 api.js               # HTTP client
│   │   ├── 📁 utils/                    # Utility functions
│   │   │   └── 🛠️ helpers.js           # Helper functions
│   │   ├── 🎨 index.css                # Global styles
│   │   └── 🚀 main.jsx                 # App entry point
│   ├── ⚙️ package.json                 # Dependencies
│   ├── 🎨 tailwind.config.js           # Tailwind configuration
│   └── ⚡ vite.config.js               # Vite configuration
├── 📁 docs/                            # Documentation
│   └── 🚀 DEPLOYMENT.md               # Deployment guide
├── 📄 README.md                        # This file
├── 📊 PROJECT_SUMMARY.md              # Project overview
└── 🔧 .env.example                    # Environment template
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18.0+ and npm/yarn
- **Java** 17+ and Maven
- **MongoDB** 6.0+ (local or Atlas)
- **Firebase** project setup

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/skyeats.git
cd skyeats
```

### 2. Backend Setup
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Environment Configuration
Create `.env` files in both frontend and backend directories (see Environment Setup section).

## 🔑 Environment Setup

### Backend Environment (`backend/src/main/resources/application.properties`)
```properties
# MongoDB Configuration
spring.data.mongodb.uri=mongodb://localhost:27017/skyeats
spring.data.mongodb.database=skyeats

# Firebase Configuration
firebase.config.path=path/to/firebase-service-account.json

# Server Configuration
server.port=8080
server.servlet.context-path=/api

# CORS Configuration
cors.allowed.origins=http://localhost:5173
```

### Frontend Environment (`frontend/.env`)
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8080/api

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Image Management
# Static images are served from the backend
```

## 📱 API Documentation

### Authentication Endpoints
```http
POST /api/auth/login          # User login
POST /api/auth/register       # User registration
POST /api/auth/logout         # User logout
GET  /api/auth/profile        # Get user profile
```

### Inventory Endpoints
```http
GET    /api/inventory/items                    # Get all products
GET    /api/inventory/items/category/{cat}     # Get by category
GET    /api/inventory/categories               # Get all categories
GET    /api/inventory/search?q={query}        # Search products
POST   /api/inventory/images/refresh-cache    # Refresh image cache
```

### Cart Endpoints
```http
GET    /api/cart              # Get user cart
POST   /api/cart/add          # Add item to cart
PUT    /api/cart/update       # Update cart item
DELETE /api/cart/remove/{id}  # Remove cart item
DELETE /api/cart/clear        # Clear entire cart
GET    /api/cart/summary      # Get cart summary
```

### Order Endpoints
```http
POST   /api/orders/checkout   # Place new order
GET    /api/orders/history    # Get order history
GET    /api/orders/{id}       # Get order details
GET    /api/orders/track/{id} # Track order status
```

## 🎨 UI/UX Features

### Design System
- **Color Palette**: Sky blue primary, complementary gradients
- **Typography**: Modern, readable font hierarchy
- **Spacing**: Consistent 8px grid system
- **Animations**: Smooth transitions and micro-interactions

### Responsive Design
- **Mobile First**: Optimized for mobile devices
- **Tablet Support**: Enhanced layouts for medium screens
- **Desktop Experience**: Full-featured desktop interface
- **Touch Friendly**: Large touch targets and gestures

### Accessibility
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Proper ARIA labels and roles
- **Color Contrast**: WCAG 2.1 AA compliant contrast ratios
- **Focus Management**: Clear focus indicators

## 🔒 Security Features

### Authentication Security
- **Firebase Auth**: Industry-standard authentication
- **JWT Tokens**: Secure, stateless authentication
- **Token Refresh**: Automatic token renewal
- **Session Management**: Secure session handling

### Data Protection
- **Input Validation**: Comprehensive server-side validation
- **SQL Injection Prevention**: MongoDB parameterized queries
- **XSS Protection**: Input sanitization and output encoding
- **CORS Configuration**: Proper cross-origin resource sharing

### API Security
- **Rate Limiting**: Protection against abuse
- **Authentication Required**: Protected endpoints
- **Error Handling**: Secure error messages
- **Logging**: Comprehensive security logging

## 📊 Performance Optimizations

### Frontend Optimizations
- **Code Splitting**: Lazy loading of components
- **Image Optimization**: Responsive images with proper sizing
- **Bundle Optimization**: Tree shaking and minification
- **Caching Strategy**: Strategic browser caching

### Backend Optimizations
- **Database Indexing**: Optimized MongoDB indexes
- **Connection Pooling**: Efficient database connections
- **Caching**: In-memory caching for frequent queries
- **Async Processing**: Non-blocking operations

### Network Optimizations
- **API Caching**: Strategic response caching
- **Compression**: Gzip compression for responses
- **CDN Ready**: Optimized for CDN deployment
- **HTTP/2 Support**: Modern protocol support

## 🛠️ Development Tools

### Code Quality
- **ESLint**: JavaScript/React linting
- **Prettier**: Code formatting
- **Husky**: Git hooks for quality checks
- **SonarQube Ready**: Code quality analysis

### Testing (Ready for Implementation)
- **Jest**: Unit testing framework
- **React Testing Library**: Component testing
- **JUnit**: Backend unit testing
- **Cypress**: End-to-end testing

### Development Workflow
- **Hot Reload**: Instant development feedback
- **Source Maps**: Debugging support
- **Environment Variables**: Configuration management
- **Docker Ready**: Containerization support

## 🚀 Deployment Options

### Frontend Deployment
- **Vercel**: Recommended for React apps
- **Netlify**: Alternative static hosting
- **AWS S3 + CloudFront**: Enterprise solution
- **Firebase Hosting**: Integrated with Firebase

### Backend Deployment
- **Heroku**: Easy deployment platform
- **AWS EC2**: Scalable cloud hosting
- **Google Cloud Run**: Serverless containers
- **Docker**: Containerized deployment

### Database Hosting
- **MongoDB Atlas**: Managed MongoDB service
- **AWS DocumentDB**: MongoDB-compatible service
- **Google Cloud Firestore**: Alternative NoSQL option

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Process
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests (if applicable)
5. Submit a pull request

### Code Standards
- Follow existing code style
- Add comments for complex logic
- Update documentation as needed
- Ensure all tests pass

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Firebase** for authentication and hosting services
- **Static Images** for product display
- **Tailwind CSS** for the utility-first CSS framework
- **Spring Boot** for the robust backend framework
- **React** for the powerful frontend library

## 📞 Support

For support, email support@skyeats.com or join our Slack channel.

---

<div align="center">
  <p>Made with ❤️ by the SkyEats Team</p>
  <p>
    <a href="#-table-of-contents">Back to Top</a>
  </p>
</div>