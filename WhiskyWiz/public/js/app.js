// DOM Elements
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const featuredWhiskiesGrid = document.getElementById('featured-whiskies-grid');
const featuredLoading = document.getElementById('featured-loading');
const whiskyDetailsSection = document.getElementById('whisky-details-section');
const searchResultsSection = document.getElementById('search-results-section');
const searchResultsGrid = document.getElementById('search-results-grid');
const exploreButton = document.getElementById('explore-button');
const topRatedButton = document.getElementById('top-rated-button');
const categoryCards = document.querySelectorAll('.category-card');
const whiskyCardTemplate = document.getElementById('whisky-card-template');

// API URL
const API_URL = '/api';

// State
let currentWhiskies = [];
let currentPrices = [];
let currentReviews = [];

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  // Load featured whiskies
  loadFeaturedWhiskies();
  
  // Event listeners
  searchButton.addEventListener('click', handleSearch);
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  });
  
  exploreButton.addEventListener('click', () => {
    loadAllWhiskies();
  });
  
  topRatedButton.addEventListener('click', () => {
    loadTopRatedWhiskies();
  });
  
  categoryCards.forEach(card => {
    card.addEventListener('click', () => {
      const category = card.dataset.category;
      loadWhiskiesByCategory(category);
    });
  });
});

// Load featured whiskies
async function loadFeaturedWhiskies() {
  try {
    featuredLoading.style.display = 'block';
    
    // In a real app, you would have an endpoint for featured whiskies
    // For now, we'll just get the first few whiskies
    const response = await fetch(`${API_URL}/whiskies?limit=6`);
    const data = await response.json();
    
    currentWhiskies = data.whiskies;
    
    // Clear the grid
    featuredWhiskiesGrid.innerHTML = '';
    
    // Add whisky cards
    if (currentWhiskies.length > 0) {
      currentWhiskies.forEach(whisky => {
        const whiskyCard = createWhiskyCard(whisky);
        featuredWhiskiesGrid.appendChild(whiskyCard);
      });
    } else {
      featuredWhiskiesGrid.innerHTML = '<p class="no-results">No whiskies found</p>';
    }
  } catch (error) {
    console.error('Error loading featured whiskies:', error);
    featuredWhiskiesGrid.innerHTML = '<p class="error">Error loading whiskies. Please try again later.</p>';
  } finally {
    featuredLoading.style.display = 'none';
  }
}

// Load all whiskies
async function loadAllWhiskies() {
  try {
    showSearchResults();
    searchResultsGrid.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i></div>';
    
    const response = await fetch(`${API_URL}/whiskies?limit=20`);
    const data = await response.json();
    
    currentWhiskies = data.whiskies;
    
    // Clear the grid
    searchResultsGrid.innerHTML = '';
    
    // Add whisky cards
    if (currentWhiskies.length > 0) {
      currentWhiskies.forEach(whisky => {
        const whiskyCard = createWhiskyCard(whisky);
        searchResultsGrid.appendChild(whiskyCard);
      });
    } else {
      searchResultsGrid.innerHTML = '<p class="no-results">No whiskies found</p>';
    }
  } catch (error) {
    console.error('Error loading whiskies:', error);
    searchResultsGrid.innerHTML = '<p class="error">Error loading whiskies. Please try again later.</p>';
  }
}

// Load top rated whiskies
async function loadTopRatedWhiskies() {
  try {
    showSearchResults();
    searchResultsGrid.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i></div>';
    
    // In a real app, you would have an endpoint for top rated whiskies
    // For now, we'll just sort by rating
    const response = await fetch(`${API_URL}/whiskies?limit=20`);
    const data = await response.json();
    
    currentWhiskies = data.whiskies.sort((a, b) => b.averageRating - a.averageRating);
    
    // Clear the grid
    searchResultsGrid.innerHTML = '';
    
    // Add whisky cards
    if (currentWhiskies.length > 0) {
      currentWhiskies.forEach(whisky => {
        const whiskyCard = createWhiskyCard(whisky);
        searchResultsGrid.appendChild(whiskyCard);
      });
    } else {
      searchResultsGrid.innerHTML = '<p class="no-results">No whiskies found</p>';
    }
  } catch (error) {
    console.error('Error loading top rated whiskies:', error);
    searchResultsGrid.innerHTML = '<p class="error">Error loading whiskies. Please try again later.</p>';
  }
}

// Load whiskies by category
async function loadWhiskiesByCategory(category) {
  try {
    showSearchResults();
    searchResultsGrid.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i></div>';
    
    // In a real app, you would have an endpoint for filtering by category
    // For now, we'll just get all whiskies and filter client-side
    const response = await fetch(`${API_URL}/whiskies?limit=50`);
    const data = await response.json();
    
    currentWhiskies = data.whiskies.filter(whisky => whisky.type === category);
    
    // Clear the grid
    searchResultsGrid.innerHTML = '';
    
    // Add whisky cards
    if (currentWhiskies.length > 0) {
      currentWhiskies.forEach(whisky => {
        const whiskyCard = createWhiskyCard(whisky);
        searchResultsGrid.appendChild(whiskyCard);
      });
    } else {
      searchResultsGrid.innerHTML = '<p class="no-results">No whiskies found in this category</p>';
    }
  } catch (error) {
    console.error('Error loading whiskies by category:', error);
    searchResultsGrid.innerHTML = '<p class="error">Error loading whiskies. Please try again later.</p>';
  }
}

// Handle search
async function handleSearch() {
  const query = searchInput.value.trim();
  
  if (!query) return;
  
  try {
    showSearchResults();
    searchResultsGrid.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i></div>';
    
    const response = await fetch(`${API_URL}/whiskies/search/${query}`);
    const data = await response.json();
    
    currentWhiskies = data;
    
    // Clear the grid
    searchResultsGrid.innerHTML = '';
    
    // Add whisky cards
    if (currentWhiskies.length > 0) {
      currentWhiskies.forEach(whisky => {
        const whiskyCard = createWhiskyCard(whisky);
        searchResultsGrid.appendChild(whiskyCard);
      });
    } else {
      searchResultsGrid.innerHTML = '<p class="no-results">No whiskies found matching your search</p>';
    }
  } catch (error) {
    console.error('Error searching whiskies:', error);
    searchResultsGrid.innerHTML = '<p class="error">Error searching whiskies. Please try again later.</p>';
  }
}

// Show whisky details
async function showWhiskyDetails(whiskyId) {
  try {
    whiskyDetailsSection.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i></div>';
    whiskyDetailsSection.classList.add('active');
    
    // Hide other sections
    searchResultsSection.classList.remove('active');
    
    // Fetch whisky details
    const whiskyResponse = await fetch(`${API_URL}/whiskies/${whiskyId}`);
    const whisky = await whiskyResponse.json();
    
    // Fetch prices
    const pricesResponse = await fetch(`${API_URL}/prices/whisky/${whiskyId}`);
    const prices = await pricesResponse.json();
    
    // Fetch reviews
    const reviewsResponse = await fetch(`${API_URL}/reviews/whisky/${whiskyId}`);
    const reviews = await reviewsResponse.json();
    
    currentPrices = prices;
    currentReviews = reviews;
    
    // Create whisky details HTML
    const detailsHTML = `
      <div class="whisky-details-container">
        <button class="back-button btn btn-secondary"><i class="fas fa-arrow-left"></i> Back</button>
        
        <div class="whisky-details-header">
          <div class="whisky-details-image">
            <img src="${whisky.imageUrl || 'https://via.placeholder.com/400x600?text=No+Image'}" alt="${whisky.name}">
          </div>
          <div class="whisky-details-info">
            <h2>${whisky.name}</h2>
            <p class="distillery">${whisky.distillery}</p>
            <div class="whisky-meta">
              <span class="type">${whisky.type}</span>
              ${whisky.age ? `<span class="age">${whisky.age} Years</span>` : ''}
              <span class="abv">${whisky.abv}% ABV</span>
            </div>
            <div class="whisky-rating">
              <div class="stars">${getStarsHTML(whisky.averageRating)}</div>
              <span class="rating-value">${whisky.averageRating.toFixed(1)}</span>
              <span class="review-count">(${whisky.totalReviews} reviews)</span>
            </div>
            <div class="whisky-description">
              <p>${whisky.description}</p>
            </div>
            <div class="whisky-details-meta">
              <div class="meta-item">
                <h4>Region</h4>
                <p>${whisky.region || 'N/A'}</p>
              </div>
              <div class="meta-item">
                <h4>Country</h4>
                <p>${whisky.country}</p>
              </div>
              <div class="meta-item">
                <h4>Bottler</h4>
                <p>${whisky.bottler || 'N/A'}</p>
              </div>
              <div class="meta-item">
                <h4>Cask Type</h4>
                <p>${whisky.caskType ? whisky.caskType.join(', ') : 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="whisky-details-tabs">
          <div class="tabs-header">
            <button class="tab-button active" data-tab="tasting-notes">Tasting Notes</button>
            <button class="tab-button" data-tab="prices">Where to Buy</button>
            <button class="tab-button" data-tab="reviews">Reviews</button>
          </div>
          
          <div class="tabs-content">
            <div class="tab-content active" id="tasting-notes">
              <div class="tasting-notes">
                <div class="note">
                  <h4>Nose</h4>
                  <p>${whisky.nose || 'No tasting notes available'}</p>
                </div>
                <div class="note">
                  <h4>Palate</h4>
                  <p>${whisky.palate || 'No tasting notes available'}</p>
                </div>
                <div class="note">
                  <h4>Finish</h4>
                  <p>${whisky.finish || 'No tasting notes available'}</p>
                </div>
              </div>
            </div>
            
            <div class="tab-content" id="prices">
              ${getPricesHTML(prices)}
            </div>
            
            <div class="tab-content" id="reviews">
              ${getReviewsHTML(reviews)}
              
              <div class="add-review">
                <h3>Add Your Review</h3>
                <form id="review-form">
                  <input type="hidden" id="whisky-id" value="${whisky._id}">
                  <div class="form-group">
                    <label for="username">Your Name</label>
                    <input type="text" id="username" required>
                  </div>
                  <div class="form-group">
                    <label for="review-title">Title</label>
                    <input type="text" id="review-title" required>
                  </div>
                  <div class="form-group">
                    <label for="rating">Overall Rating</label>
                    <div class="rating-input">
                      <input type="number" id="rating" min="1" max="5" required>
                      <span class="rating-out-of">/5</span>
                    </div>
                  </div>
                  <div class="form-group">
                    <label for="review-comment">Your Review</label>
                    <textarea id="review-comment" rows="4" required></textarea>
                  </div>
                  <button type="submit" class="btn btn-primary">Submit Review</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    whiskyDetailsSection.innerHTML = detailsHTML;
    
    // Add event listeners for tabs
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const tab = button.dataset.tab;
        
        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked button and corresponding content
        button.classList.add('active');
        document.getElementById(tab).classList.add('active');
      });
    });
    
    // Add event listener for back button
    const backButton = document.querySelector('.back-button');
    backButton.addEventListener('click', () => {
      whiskyDetailsSection.classList.remove('active');
      if (searchResultsSection.querySelector('.whisky-card')) {
        searchResultsSection.classList.add('active');
      }
    });
    
    // Add event listener for review form
    const reviewForm = document.getElementById('review-form');
    reviewForm.addEventListener('submit', handleReviewSubmit);
    
  } catch (error) {
    console.error('Error loading whisky details:', error);
    whiskyDetailsSection.innerHTML = '<p class="error">Error loading whisky details. Please try again later.</p>';
  }
}

// Handle review submit
async function handleReviewSubmit(e) {
  e.preventDefault();
  
  const whiskyId = document.getElementById('whisky-id').value;
  const username = document.getElementById('username').value;
  const title = document.getElementById('review-title').value;
  const rating = document.getElementById('rating').value;
  const comment = document.getElementById('review-comment').value;
  
  try {
    const response = await fetch(`${API_URL}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        whisky: whiskyId,
        username,
        title,
        rating: Number(rating),
        comment
      })
    });
    
    if (response.ok) {
      // Reset form
      e.target.reset();
      
      // Reload reviews
      const reviewsResponse = await fetch(`${API_URL}/reviews/whisky/${whiskyId}`);
      const reviews = await reviewsResponse.json();
      
      currentReviews = reviews;
      
      // Update reviews HTML
      const reviewsTab = document.getElementById('reviews');
      const addReviewSection = reviewsTab.querySelector('.add-review');
      reviewsTab.innerHTML = getReviewsHTML(reviews);
      reviewsTab.appendChild(addReviewSection);
      
      // Show success message
      const successMessage = document.createElement('div');
      successMessage.classList.add('success-message');
      successMessage.textContent = 'Review submitted successfully!';
      addReviewSection.prepend(successMessage);
      
      // Remove success message after 3 seconds
      setTimeout(() => {
        successMessage.remove();
      }, 3000);
    }
  } catch (error) {
    console.error('Error submitting review:', error);
    
    // Show error message
    const errorMessage = document.createElement('div');
    errorMessage.classList.add('error-message');
    errorMessage.textContent = 'Error submitting review. Please try again later.';
    document.querySelector('.add-review').prepend(errorMessage);
    
    // Remove error message after 3 seconds
    setTimeout(() => {
      errorMessage.remove();
    }, 3000);
  }
}

// Create whisky card
function createWhiskyCard(whisky) {
  const template = whiskyCardTemplate.content.cloneNode(true);
  
  // Set image
  const image = template.querySelector('.whisky-image img');
  image.src = whisky.imageUrl || 'https://via.placeholder.com/300x400?text=No+Image';
  image.alt = whisky.name;
  
  // Set info
  template.querySelector('.whisky-name').textContent = whisky.name;
  template.querySelector('.whisky-distillery').textContent = whisky.distillery;
  
  // Set meta
  const metaElements = template.querySelectorAll('.whisky-meta span');
  metaElements[0].textContent = whisky.type;
  metaElements[1].textContent = whisky.age ? `${whisky.age} Years` : '';
  metaElements[2].textContent = `${whisky.abv}% ABV`;
  
  // Set rating
  template.querySelector('.stars').innerHTML = getStarsHTML(whisky.averageRating);
  template.querySelector('.rating-value').textContent = whisky.averageRating.toFixed(1);
  template.querySelector('.review-count').textContent = `(${whisky.totalReviews})`;
  
  // Set price (placeholder for now)
  template.querySelector('.price-value').textContent = '$99.99';
  
  // Add event listener
  const card = template.querySelector('.whisky-card');
  card.addEventListener('click', () => {
    showWhiskyDetails(whisky._id);
  });
  
  return card;
}

// Get stars HTML
function getStarsHTML(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  
  let starsHTML = '';
  
  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    starsHTML += '<i class="fas fa-star"></i>';
  }
  
  // Add half star
  if (halfStar) {
    starsHTML += '<i class="fas fa-star-half-alt"></i>';
  }
  
  // Add empty stars
  for (let i = 0; i < emptyStars; i++) {
    starsHTML += '<i class="far fa-star"></i>';
  }
  
  return starsHTML;
}

// Get prices HTML
function getPricesHTML(prices) {
  if (prices.length === 0) {
    return '<p class="no-results">No price information available</p>';
  }
  
  let pricesHTML = `
    <div class="prices-list">
      <div class="prices-header">
        <span class="retailer">Retailer</span>
        <span class="price">Price</span>
        <span class="stock">Availability</span>
        <span class="action"></span>
      </div>
  `;
  
  prices.forEach(price => {
    pricesHTML += `
      <div class="price-item">
        <span class="retailer">${price.retailer}</span>
        <span class="price">${price.currency} ${price.price.toFixed(2)}</span>
        <span class="stock">${price.inStock ? 'In Stock' : 'Out of Stock'}</span>
        <span class="action">
          <a href="${price.url}" target="_blank" class="btn btn-primary btn-sm">Buy Now</a>
        </span>
      </div>
    `;
  });
  
  pricesHTML += '</div>';
  
  return pricesHTML;
}

// Get reviews HTML
function getReviewsHTML(reviews) {
  if (reviews.length === 0) {
    return '<p class="no-results">No reviews yet. Be the first to review!</p>';
  }
  
  let reviewsHTML = '<div class="reviews-list">';
  
  reviews.forEach(review => {
    reviewsHTML += `
      <div class="review-item">
        <div class="review-header">
          <div class="review-user">
            <span class="username">${review.username}</span>
          </div>
          <div class="review-rating">
            <div class="stars">${getStarsHTML(review.rating)}</div>
            <span class="rating-value">${review.rating.toFixed(1)}</span>
          </div>
        </div>
        <h4 class="review-title">${review.title}</h4>
        <p class="review-comment">${review.comment}</p>
        <div class="review-date">
          <span>${new Date(review.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    `;
  });
  
  reviewsHTML += '</div>';
  
  return reviewsHTML;
}

// Show search results
function showSearchResults() {
  searchResultsSection.classList.add('active');
  whiskyDetailsSection.classList.remove('active');
}

// Mock data for development (remove in production)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  // Mock whiskies
  const mockWhiskies = [
    {
      _id: '1',
      name: 'Macallan 12 Year Old Sherry Oak',
      distillery: 'Macallan',
      country: 'Scotland',
      region: 'Speyside',
      type: 'Single Malt',
      age: 12,
      abv: 43,
      bottler: 'Macallan Distillery',
      caskType: ['Sherry Oak'],
      nose: 'Vanilla with a hint of ginger, dried fruits, sherry sweetness and wood smoke',
      palate: 'Deliciously smooth, rich dried fruits and sherry, balanced with wood smoke and spice',
      finish: 'Sweet toffee and dried fruits, with wood smoke and spice',
      description: 'The Macallan 12 Year Old Sherry Oak is a classic Speyside single malt, matured exclusively in hand-picked sherry seasoned oak casks from Jerez, Spain.',
      imageUrl: 'https://via.placeholder.com/300x400?text=Macallan+12',
      averageRating: 4.5,
      totalReviews: 120
    },
    {
      _id: '2',
      name: 'Lagavulin 16 Year Old',
      distillery: 'Lagavulin',
      country: 'Scotland',
      region: 'Islay',
      type: 'Single Malt',
      age: 16,
      abv: 43,
      bottler: 'Lagavulin Distillery',
      caskType: ['American Oak', 'European Oak'],
      nose: 'Intense peat smoke with iodine and seaweed, rich sweetness',
      palate: 'Dry peat smoke fills the palate with a gentle but strong sweetness, followed by sea and salt with touches of wood',
      finish: 'Long, elegant peat-filled finish with lots of salt and seaweed',
      description: 'A much sought-after single malt with the massive peat-smoke that\'s typical of southern Islay, but also offering richness and a dryness that turns it into a truly interesting dram.',
      imageUrl: 'https://via.placeholder.com/300x400?text=Lagavulin+16',
      averageRating: 4.8,
      totalReviews: 150
    },
    {
      _id: '3',
      name: 'Buffalo Trace',
      distillery: 'Buffalo Trace',
      country: 'USA',
      region: 'Kentucky',
      type: 'Bourbon',
      age: null,
      abv: 45,
      bottler: 'Buffalo Trace Distillery',
      caskType: ['New American Oak'],
      nose: 'Spicy and sweet with caramel, creamy toffee eclairs, vanilla, and candied fruit',
      palate: 'Brown sugar, toffee, oak, dark fruit, and anise',
      finish: 'Long and smooth with spicy oak and sweet vanilla',
      description: 'Buffalo Trace Kentucky Straight Bourbon Whiskey is distilled, aged and bottled at the most award-winning distillery in the world. Made from the finest corn, rye and barley malt, this whiskey ages in new oak barrels for years in century old warehouses until the peak of maturity.',
      imageUrl: 'https://via.placeholder.com/300x400?text=Buffalo+Trace',
      averageRating: 4.3,
      totalReviews: 95
    },
    {
      _id: '4',
      name: 'Redbreast 12 Year Old',
      distillery: 'Midleton',
      country: 'Ireland',
      region: 'Cork',
      type: 'Irish',
      age: 12,
      abv: 40,
      bottler: 'Irish Distillers',
      caskType: ['Sherry', 'Bourbon'],
      nose: 'Nutty, rich and oily. Notes of dried peels, ginger, linseed, cut fruits and a touch of Sherry',
      palate: 'Spicy with great body. Nuts, nutmeg, dried fruits and Sherry',
      finish: 'Long, creamy, caramel, vanilla',
      description: 'Redbreast 12 Year Old is full of aroma and flavor. A complex Pot Still Irish Whiskey matured for at least 12 years in a combination of Spanish Oloroso sherry casks and American Bourbon whiskey barrels.',
      imageUrl: 'https://via.placeholder.com/300x400?text=Redbreast+12',
      averageRating: 4.6,
      totalReviews: 88
    },
    {
      _id: '5',
      name: 'Hibiki Japanese Harmony',
      distillery: 'Suntory',
      country: 'Japan',
      region: 'Various',
      type: 'Japanese',
      age: null,
      abv: 43,
      bottler: 'Suntory',
      caskType: ['American White Oak', 'Sherry', 'Mizunara'],
      nose: 'Rose, lychee, hint of rosemary, mature woodiness, sandalwood',
      palate: 'Honey-like sweetness, candied orange peel, white chocolate',
      finish: 'Subtle, tender long finish, with hint of Mizunara (Japanese oak)',
      description: 'Hibiki Japanese Harmony is a blend of Japanese malt and grain whiskies from Yamazaki, Hakushu and Chita. Presented in the brand\'s trademark 24-faceted bottle representing the Japanese seasons, this is light, approachable and moreish with enticing notes of orange peel and white chocolate.',
      imageUrl: 'https://via.placeholder.com/300x400?text=Hibiki+Harmony',
      averageRating: 4.4,
      totalReviews: 75
    },
    {
      _id: '6',
      name: 'Glenfiddich 15 Year Old Solera',
      distillery: 'Glenfiddich',
      country: 'Scotland',
      region: 'Speyside',
      type: 'Single Malt',
      age: 15,
      abv: 40,
      bottler: 'William Grant & Sons',
      caskType: ['Sherry', 'Bourbon', 'New Oak'],
      nose: 'Sweet heather honey and vanilla fudge combined with rich dark fruits',
      palate: 'Silky smooth, revealing layers of sherry oak, marzipan, cinnamon and ginger',
      finish: 'Satisfyingly rich with lingering sweetness',
      description: 'Aged in European, American and New Oak, the whiskies are mellowed in a unique Solera vat, a large oak tun inspired by the sherry bodegas of Spain and Portugal.',
      imageUrl: 'https://via.placeholder.com/300x400?text=Glenfiddich+15',
      averageRating: 4.2,
      totalReviews: 110
    }
  ];

  // Mock prices
  const mockPrices = [
    {
      _id: '1',
      whisky: '1',
      retailer: 'The Whisky Exchange',
      price: 79.99,
      currency: 'USD',
      url: '#',
      inStock: true,
      country: 'UK'
    },
    {
      _id: '2',
      whisky: '1',
      retailer: 'Master of Malt',
      price: 82.50,
      currency: 'USD',
      url: '#',
      inStock: true,
      country: 'UK'
    },
    {
      _id: '3',
      whisky: '1',
      retailer: 'Total Wine',
      price: 74.99,
      currency: 'USD',
      url: '#',
      inStock: false,
      country: 'USA'
    }
  ];

  // Mock reviews
  const mockReviews = [
    {
      _id: '1',
      whisky: '1',
      username: 'WhiskyLover42',
      rating: 4.5,
      title: 'Excellent Sherry Bomb',
      comment: 'This is an excellent example of a sherry-influenced Speyside. Rich, complex, and very enjoyable. Highly recommended!',
      createdAt: '2023-01-15T12:00:00Z'
    },
    {
      _id: '2',
      whisky: '1',
      username: 'MaltMaster',
      rating: 4,
      title: 'Solid Dram',
      comment: 'A very good whisky with nice sherry notes. Not the most complex, but very enjoyable and approachable.',
      createdAt: '2023-02-20T15:30:00Z'
    }
  ];

  // Mock API
  const originalFetch = window.fetch;
  window.fetch = function(url, options) {
    if (url.includes('/api/whiskies') && !url.includes('/search/')) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            ok: true,
            json: () => Promise.resolve({
              whiskies: mockWhiskies,
              totalPages: 1,
              currentPage: 1,
              total: mockWhiskies.length
            })
          });
        }, 500);
      });
    }
    
    if (url.includes('/api/whiskies/search/')) {
      const query = url.split('/search/')[1].toLowerCase();
      const results = mockWhiskies.filter(whisky => 
        whisky.name.toLowerCase().includes(query) || 
        whisky.distillery.toLowerCase().includes(query) ||
        whisky.region.toLowerCase().includes(query) ||
        whisky.country.toLowerCase().includes(query)
      );
      
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            ok: true,
            json: () => Promise.resolve(results)
          });
        }, 500);
      });
    }
    
    if (url.includes('/api/whiskies/') && !url.includes('/search/')) {
      const id = url.split('/whiskies/')[1];
      const whisky = mockWhiskies.find(w => w._id === id);
      
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            ok: true,
            json: () => Promise.resolve(whisky)
          });
        }, 300);
      });
    }
    
    if (url.includes('/api/prices/whisky/')) {
      const whiskyId = url.split('/whisky/')[1];
      const prices = mockPrices.filter(p => p.whisky === whiskyId);
      
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            ok: true,
            json: () => Promise.resolve(prices)
          });
        }, 300);
      });
    }
    
    if (url.includes('/api/reviews/whisky/')) {
      const whiskyId = url.split('/whisky/')[1];
      const reviews = mockReviews.filter(r => r.whisky === whiskyId);
      
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            ok: true,
            json: () => Promise.resolve(reviews)
          });
        }, 300);
      });
    }
    
    if (url === '/api/reviews' && options && options.method === 'POST') {
      const review = JSON.parse(options.body);
      const newReview = {
        _id: String(mockReviews.length + 1),
        ...review,
        createdAt: new Date().toISOString()
      };
      
      mockReviews.push(newReview);
      
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            ok: true,
            json: () => Promise.resolve(newReview)
          });
        }, 300);
      });
    }
    
    return originalFetch(url, options);
  };
}