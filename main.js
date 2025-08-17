// Product data
const products = [
  {
    id: 1,
    name: "Cozy Cloud Hoodie",
    price: "$49.99",
    description:
      "Soft as a cloud, warm as a hug. Perfect for lazy Sunday mornings.",
    emoji: "☁️",
  },
  {
    id: 2,
    name: "Sunshine Coffee Mug",
    price: "$19.99",
    description:
      "Start your day with liquid sunshine. Comes with built-in good vibes.",
    emoji: "☕",
  },
  {
    id: 3,
    name: "Adventure Backpack",
    price: "$89.99",
    description:
      "Your companion for epic journeys. Holds dreams and snacks equally well.",
    emoji: "🎒",
  },
  {
    id: 4,
    name: "Magic Notebook",
    price: "$24.99",
    description:
      "Where ideas come to life. Warning: may cause sudden bursts of creativity.",
    emoji: "📝",
  },
  {
    id: 5,
    name: "Comet Wireless Earbuds",
    price: "$129.99",
    description:
      "Sound that's out of this world. Now with 50% less chance of losing them.",
    emoji: "🎧",
  },
  {
    id: 6,
    name: "Rainbow Succulent Plant",
    price: "$15.99",
    description:
      "Low maintenance, high happiness. Perfect for those without green thumbs.",
    emoji: "🌈",
  },
  {
    id: 7,
    name: "Stellar Phone Case",
    price: "$34.99",
    description:
      "Protect your phone like it's made of stardust. Drop protection guaranteed.",
    emoji: "✨",
  },
  {
    id: 8,
    name: "Zen Meditation Cushion",
    price: "$59.99",
    description:
      "Find your inner peace. Side effects may include sudden enlightenment.",
    emoji: "🧘",
  },
];

// Fun confessions API (mock data)
const confessions = [
  "I secretly talk to my plants and I'm pretty sure they talk back! 🌱",
  "Sometimes I pretend I'm a barista when making my morning coffee ☕",
  "I have a playlist specifically for doing laundry. Don't judge! 🎵",
  "I've never met a cute animal video I didn't like. My 'Watch Later' list is 500+ videos deep 🐱",
  "I still get excited about getting mail, even if it's just bills 📬",
  "I practice acceptance speeches in the shower for awards I'll never win 🏆",
  "I have strong opinions about the correct way to load a dishwasher 🍽️",
  "I've memorized the theme songs of at least 12 TV shows from the 90s 📺",
  "I believe that everything tastes better when eaten with chopsticks 🥢",
  "I have a secret rivalry with the GPS lady. She doesn't know about it 🗺️",
];

// Cart functionality
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let cartCount = 0;

// Initialize the marketplace
function initializeMarketplace() {
  renderProducts();
  setupEventListeners();
  updateCartIndicator();
}

// Render products to the grid
function renderProducts() {
  const grid = document.getElementById("products-grid");
  grid.innerHTML = "";

  products.forEach((product) => {
    const productCard = createProductCard(product);
    grid.appendChild(productCard);
  });
}

// Create a product card element
function createProductCard(product) {
  const card = document.createElement("div");
  card.className = "product-card";
  card.dataset.productId = product.id;

  card.innerHTML = `
    <div class="product-image">
      ${product.emoji}
    </div>
    <div class="product-info">
      <h3 class="product-name">${product.name}</h3>
      <div class="product-price">${product.price}</div>
      <p class="product-description">${product.description}</p>
      
      <div class="button-group">
        <button class="btn btn-secondary add-to-cart-btn" data-product-id="${product.id}">
          Add to Cart
        </button>
        <button class="btn btn-primary buy-now-btn" data-product-id="${product.id}">
          Buy Now
        </button>
      </div>
      
      <button class="btn btn-confession confession-btn" data-product-id="${product.id}">
        🤫 Tell me a secret
      </button>
      
      <div class="confession-section" id="confession-${product.id}">
        <div class="confession-text"></div>
      </div>
    </div>
    
    <div class="cart-animation" id="cart-animation-${product.id}">
      +1 added to cart! 🛒
    </div>
  `;

  return card;
}

// Setup event listeners
function setupEventListeners() {
  // Add to cart buttons
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-to-cart-btn")) {
      const productId = parseInt(e.target.dataset.productId);
      addToCart(productId, e.target);
    }
  });

  // Buy now buttons
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("buy-now-btn")) {
      const productId = parseInt(e.target.dataset.productId);
      buyNow(productId);
    }
  });

  // Confession buttons
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("confession-btn")) {
      const productId = parseInt(e.target.dataset.productId);
      showConfession(productId, e.target);
    }
  });

  // Cart indicator click
  document
    .querySelector(".cart-indicator")
    .addEventListener("click", goToCheckout);
}
// Add to cart functionality
function addToCart(productId, button) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  // Add to cart array
  cart.push(product);
  cartCount++;

  // Save to localStorage
  localStorage.setItem("cart", JSON.stringify(cart));

  // Update cart indicator
  updateCartIndicator();

  // Visual feedback on button
  button.classList.add("added");
  button.textContent = "Added! ✓";

  // Show cart animation
  showCartAnimation(productId);

  // Reset button after delay
  setTimeout(() => {
    button.classList.remove("added");
    button.textContent = "Add to Cart";
  }, 2000);
}

// Buy now functionality
function buyNow(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  // Create a fun purchase animation
  goToCheckout();
}

// Show confession functionality
async function showConfession(productId, button) {
  const confessionSection = document.getElementById(`confession-${productId}`);
  const confessionText = confessionSection.querySelector(".confession-text");

  // Disable button during loading
  button.disabled = true;
  button.innerHTML = '<span class="loading"></span> Getting confession...';

  // Simulate API call delay
  await new Promise((resolve) =>
    setTimeout(resolve, 1000 + Math.random() * 1000)
  );

  // Get random confession
  const randomConfession =
    confessions[Math.floor(Math.random() * confessions.length)];

  // Show confession
  confessionText.textContent = randomConfession;
  confessionSection.classList.add("show");

  // Reset button
  button.disabled = false;
  button.innerHTML = "🤫 Tell me another secret";
}

// Show cart animation
function showCartAnimation(productId) {
  const animation = document.getElementById(`cart-animation-${productId}`);
  animation.classList.add("show");

  setTimeout(() => {
    animation.classList.remove("show");
  }, 2000);
}

// Go to checkout page
function goToCheckout() {
  window.location.href = "checkout.html";
}

// Update cart indicator
function updateCartIndicator() {
  cartCount = cart.length;
  const cartCountElement = document.getElementById("cart-count");
  cartCountElement.textContent = cartCount;

  if (cartCount > 0) {
    cartCountElement.classList.add("show");
  } else {
    cartCountElement.classList.remove("show");
  }
}

// Shuffle product grid
function shuffleProductGrid() {
  const grid = document.getElementById("products-grid");
  const cards = Array.from(grid.children);

  // Shuffle array
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  // Re-append in new order
  cards.forEach((card) => {
    grid.appendChild(card);
  });
}

// Listen for cart updates from other pages
window.addEventListener("storage", (e) => {
  if (e.key === "cart") {
    cart = JSON.parse(e.newValue) || [];
    updateCartIndicator();
  }
});

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", initializeMarketplace);
