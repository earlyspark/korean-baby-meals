# Korean Baby Meals

A comprehensive toddler recipe website focused on Korean and Asian cuisine for children 12+ months old. Features intelligent ingredient-based search, categorized ingredient organization, and practical filters designed for real-world toddler feeding situations.

## 🌟 Key Features

### Smart Recipe Discovery
- **Ingredient-Based Search**: Find recipes by entering ingredients you have available
- **Fuzzy Matching**: Intelligent search with autocomplete suggestions and alternative ingredient names
- **Almost Matches**: Discover recipes that need only 1-2 additional ingredients
- **Categorized Ingredients**: Organized by dry, wet, seasoning, and other categories for logical cooking flow

### Practical Filters for Parents
- **Eating Methods**: Filter by finger foods or utensil-friendly options
- **Messiness Level**: Choose clean, moderate, or messy recipes based on your situation
- **Batch Cooking**: Find freezer-friendly and food processor-friendly recipes
- **User Preferences**: Filter by your favorited recipes (with account)

### User Experience
- **Recipe Ratings**: 1-5 star rating system to help other parents
- **Favorites System**: Save and organize your go-to recipes
- **Responsive Design**: Works seamlessly on mobile and desktop
- **SEO-Friendly**: Clean URLs and optimized for search engines

### Technical Excellence
- **Performance Optimized**: Fast loading with efficient database queries
- **GDPR Compliant**: Cookie consent management for analytics
- **Security First**: Secure authentication and input validation
- **Progressive Enhancement**: Works without JavaScript, enhanced with it

## 🏗️ Technology Stack

### Core Technologies
- **Next.js 15.3.4** - Latest App Router with Turbopack development
- **React 19.0.0** - Modern React with concurrent features
- **TypeScript 5** - Full type safety throughout the application
- **Tailwind CSS v4** - Utility-first styling with custom design system

### Database & Search
- **MySQL** - Robust database with comprehensive indexing
- **Fuse.js 7.1.0** - Advanced fuzzy search for ingredient matching
- **Custom JWT Authentication** - Secure user management with bcrypt

### Development & Performance
- **Turbopack** - Next.js bundler for lightning-fast development
- **Sharp** - Optimized image processing
- **ESLint 9** - Code quality and consistency
- **Lucide React** - Modern icon library

## 🚀 Getting Started

### Prerequisites
- **Node.js 20+** - Latest LTS version recommended
- **MySQL Database** - Local or hosted MySQL instance
- **npm** - Package manager

### Quick Start

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd korean-baby-meals
   npm install
   ```

2. **Database Setup**
   - Create a MySQL database
   - Import the database schema
   - Configure connection settings

3. **Environment Configuration**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your database credentials
   ```

4. **Start Development**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🏃‍♂️ Available Commands

```bash
# Development with Turbopack (recommended)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Code linting
npm run lint
```

## 📱 Core Features in Detail

### Recipe Search System
The heart of Korean Baby Meals is its intelligent search system that helps parents find recipes based on ingredients they actually have. The fuzzy matching ensures you'll find recipes even with slight variations in ingredient names.

### Toddler-Focused Design
Every filter and feature is designed with real parenting situations in mind - from messiness levels for different settings to batch cooking options for meal prep efficiency.

### User Personalization
Create an account to rate recipes, save favorites, and get personalized recipe recommendations based on your preferences and past interactions.

### Mobile-First Experience
Designed for busy parents who often browse recipes on mobile devices while cooking or shopping.

## 🤝 Contributing

This project follows modern React and Next.js best practices. Contributions are welcome for new features, bug fixes, and recipe additions that align with the toddler-focused mission.

## 📞 Support

For issues, feature requests, or questions about contributing, please use the project's issue tracker.

---

Built with ❤️ for parents introducing Korean flavors to their toddlers.