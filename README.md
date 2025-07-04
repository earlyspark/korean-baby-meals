# Korean Baby Meals

A comprehensive toddler recipe website focused on Korean and Asian cuisine for children 12+ months old. Features intelligent ingredient-based search, practical filters for real-world toddler feeding situations, and an admin interface for recipe management.

## 🌟 Features

### Core Functionality
- **Ingredient Search**: Find recipes by entering pantry items with fuzzy matching and autocomplete
- **Smart Filters**: Filter by eating method, messiness level, freezer-friendly, and food processor-friendly options
- **Almost Matches**: Discover recipes that need only 1-2 additional ingredients
- **SEO-Friendly URLs**: Human-readable recipe URLs

### Admin Interface
- **Protected Admin Panel**: HTTP Basic Auth protected admin interface
- **Recipe Management**: Edit recipe titles with real-time preview
- **Statistics Dashboard**: Recipe counts and system metrics

### User Features (Backend Ready)
- **Account System**: Registration with email/password or Google OAuth
- **Recipe Ratings**: 1-5 star rating system (requires authentication)
- **Favorites**: Save and organize favorite recipes (requires authentication)
- **Data Export**: Download user data in JSON format

### Technical Features
- **Responsive Design**: Optimized for both mobile and desktop
- **SEO Optimized**: Meta tags, structured data, dynamic sitemaps, canonical URLs
- **Performance**: Efficient database queries with dynamic rendering
- **Security**: Input validation, secure authentication, SQL injection prevention
- **GDPR Compliance**: Cookie consent management for analytics

## 🏗️ Tech Stack

- **Frontend**: Next.js 15.3.4, React 19, TypeScript, Tailwind CSS v4
- **Backend**: Next.js API Routes with middleware
- **Database**: MySQL with connection pooling
- **Authentication**: Custom JWT with bcrypt password hashing
- **Search**: Fuse.js for fuzzy ingredient matching
- **Analytics**: Google Analytics 4 with GDPR compliance
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MySQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/korean-baby-meals.git
   cd korean-baby-meals
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file with your configuration.

4. **Set up the database**
   Import the database schema into your MySQL database.

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)



---

Built with ❤️ for parents feeding Korean flavors to their toddlers.
