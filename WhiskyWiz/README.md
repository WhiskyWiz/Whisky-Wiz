# WhiskyWiz

WhiskyWiz is a comprehensive whisky information website that provides detailed information about whisky bottles worldwide, including where to purchase them, pricing information, and user reviews.

## Features

- Extensive database of whisky bottles from around the world
- Detailed information about each whisky (distillery, region, age, ABV, etc.)
- User reviews and ratings system
- Price tracking from various retailers
- Advanced search and filtering functionality
- Responsive design for all devices

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **Database**: MongoDB with Mongoose

## Setup Instructions

1. **Install Dependencies**
   ```
   npm install
   ```

2. **Set Up Environment Variables**
   Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/whiskywiz
   JWT_SECRET=your_jwt_secret
   ```

3. **Start MongoDB**
   Make sure MongoDB is installed and running on your system.

4. **Start the Server**
   ```
   npm start
   ```
   For development with auto-reload:
   ```
   npm run dev
   ```

5. **Access the Application**
   Open your browser and navigate to:
   ```
   http://localhost:5000
   ```

## Project Structure

- `/models` - Database schemas
- `/routes` - API routes
- `/public` - Frontend files
  - `/css` - Stylesheets
  - `/js` - JavaScript files

## API Endpoints

### Whiskies
- `GET /api/whiskies` - Get all whiskies (paginated)
- `GET /api/whiskies/:id` - Get whisky by ID
- `GET /api/whiskies/search/:query` - Search whiskies
- `POST /api/whiskies` - Create new whisky
- `PUT /api/whiskies/:id` - Update whisky
- `DELETE /api/whiskies/:id` - Delete whisky

### Reviews
- `GET /api/reviews/whisky/:whiskyId` - Get all reviews for a whisky
- `POST /api/reviews` - Add a review
- `PUT /api/reviews/:id` - Update a review
- `DELETE /api/reviews/:id` - Delete a review

### Prices
- `GET /api/prices/whisky/:whiskyId` - Get all prices for a whisky
- `POST /api/prices` - Add a price
- `PUT /api/prices/:id` - Update a price
- `DELETE /api/prices/:id` - Delete a price

## Development Notes

- The frontend includes mock data for development purposes when running on localhost
- For production, remove the mock data section in `app.js`

## License

MIT