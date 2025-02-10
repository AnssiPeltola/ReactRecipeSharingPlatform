# Recipe Sharing Platform 🍽️

A full-stack web application for food lovers to create, share, and discover recipes. Built with **React, TypeScript, Redux, Node.js, and PostgreSQL**, this platform allows users to manage their own recipes and engage with a growing community.

## Features 🚀
- 🔐 **User Authentication** – Secure signup & login using Passport.js and JWT.
- 👤 **User Profile Management** – Users can modify or delete their profile (deleting a profile removes all associated data, including recipes, comments, and likes).
- 📌 **Recipe Management** – Users can **create, edit, and delete** their own recipes.
- 🔍 **Advanced Search & Sorting** – Users can search for recipes using a **search box** (by recipe name, ingredient, or keyword), category or diet. Search results can be sorted by **name, category, newest first, oldest first, most liked, and most commented**.
- ⭐ **Favorites** – UUsers can like recipes. All liked recipes are displayed on their profile page.
- 📝 **Comments** – Users can leave comments on recipes. 
- 📜 **Efficient Pagination** – Recipes and comments are loaded with pagination, ensuring optimal performance even with a large dataset.
- 🎭 **RecipeSwiper** – A Tinder-like swipe page where users see unliked recipes and can swipe left to skip or right to like.
  - 🏷️ **Filter options**: - Main ingredient, category, and diet.
  - ↩️ **Undo feature**: Ability to undo the last swipe action (like/dislike)
- 📈 **Top Recipes of the Week** – The front page highlights the top 6 liked recipes of the week.
- 🌍 **Ingredient Search** – Uses the [OpenFoodFacts API](https://world.openfoodfacts.org/data/taxonomies/ingredients.json) to fetch ingredient names in Finnish when typing three or more letters in the **IngredientSearch** component.
  - For example, typing "per" would suggest "peruna" (potato) and other related ingredients.

## Tech Stack 🛠️
| **Frontend** | **Backend** | **Database** |
|-------------|------------|-------------|
| React, TypeScript, Redux, TailwindCSS | Node.js, Express.js, Passport.js, Passport-JWT| PostgreSQL |

## Installation & Setup
### Prerequisites
1. **Install PostgreSQL 16**
2. **Install Flyway Desktop**

### Database & Flyway Setup
1. **Create a new PostgreSQL database** (`recipe`) in pgAdmin 4.
2. **Configure Flyway** with the database connection.
3. **Run Flyway migrations** to create database tables. (flyway.toml file)

### Project Setup
1. **Clone the repository**
   ```sh
   git clone https://github.com/yourusername/RecipeSharingPlatform.git
   cd RecipeSharingPlatform
   ```
2. **Install dependencies**
   ```sh
   cd backend && npm install
   cd ../frontend && npm install
   ```
3. **Set up environment variables**
   - Create `.env` files in `backend` and `frontend`.
   - Example `.env` for **backend**:
     ```sh
     DB_HOST=XXXXX
     DB_USER=XXXXXX
     DB_PASSWORD='XXXXXX'
     DB_DATABASE=XXXXX
     DB_PORT=XXXX
     SESSION_SECRET=XXXXXXXXXXXXXXXXXXXXXX
     JWT_SECRET=XXXXXXXXXXXXXXXXXXXXXX
     ```
   - Example `.env` for **frontend**:
     ```sh
     REACT_APP_API_BASE_URL=http://localhost:3000
     ```

### Running the Project
1. **Start Backend**
   ```sh
   cd backend
   npm run start
   ```
2. **Start Frontend**
   ```sh
   cd frontend
   npm run start
   ```


📧 **Email:** anssipeltola@hotmail.com
💼 **LinkedIn:** [Anssi Peltola](https://www.linkedin.com/in/anssi-peltola-363255107/)
