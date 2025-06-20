# Korean Baby Meals

A comprehensive toddler recipe website focused on Korean and Asian cuisine for children 12+ months old. Features intelligent ingredient-based search, practical filters for real-world toddler feeding situations, and batch cooking optimization.

## 🌟 Features

### Core Functionality
- **Ingredient Search**: Find recipes by entering pantry items with fuzzy matching and autocomplete
- **Smart Filters**: Filter by eating method, messiness level, freezer-friendly, and food processor-friendly options
- **Almost Matches**: Discover recipes that need only 1-2 additional ingredients
- **Recipe Management**: Full CRUD operations with SEO-friendly URLs

### User Features
- **Account System**: Optional registration with email/password or Google OAuth
- **Recipe Ratings**: 1-5 star rating system
- **Favorites**: Save and organize favorite recipes
- **Data Export**: Download user data in JSON format

### Technical Features
- **Responsive Design**: Optimized for both mobile and desktop
- **SEO Optimized**: Meta tags, structured data, robots.txt, llms.txt
- **Performance**: Efficient database queries with pagination
- **Security**: Rate limiting, input validation, secure authentication

## 🏗️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MySQL
- **Authentication**: JWT with bcrypt password hashing
- **Search**: Fuse.js for fuzzy ingredient matching
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
   Create a `.env.local` file with your database and authentication credentials.

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

---