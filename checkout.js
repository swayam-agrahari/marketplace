// Get cart data from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Initialize checkout page
function initializeCheckout() {
  displayCartItems();
  updateOrderSummary();
  setupEventListeners();
}

// Display cart items
function displayCartItems() {
  const cartItemsContainer = document.getElementById("cart-items");
  const emptyCartSection = document.getElementById("empty-cart");

  if (cart.length === 0) {
    cartItemsContainer.style.display = "none";
    emptyCartSection.style.display = "block";
    return;
  }

  cartItemsContainer.style.display = "flex";
  emptyCartSection.style.display = "none";

  // Group items by ID and count quantities
  const groupedItems = cart.reduce((acc, item) => {
    if (acc[item.id]) {
      acc[item.id].quantity += 1;
    } else {
      acc[item.id] = { ...item, quantity: 1 };
    }
    return acc;
  }, {});

  cartItemsContainer.innerHTML = "";

  Object.values(groupedItems).forEach((item) => {
    const cartItem = createCartItemElement(item);
    cartItemsContainer.appendChild(cartItem);
  });
}

// Create cart item element
function createCartItemElement(item) {
  const cartItem = document.createElement("div");
  cartItem.className = "cart-item";
  cartItem.dataset.itemId = item.id;

  cartItem.innerHTML = `
    <div class="item-image">
      ${item.emoji}
    </div>
    <div class="item-details">
      <h4>${item.name}</h4>
      <div class="item-price">${item.price}</div>
    </div>
    <div class="quantity-controls">
      <button class="quantity-btn decrease-btn" data-item-id="${item.id}">-</button>
      <span class="quantity">${item.quantity}</span>
      <button class="quantity-btn increase-btn" data-item-id="${item.id}">+</button>
    </div>
    <button class="remove-btn" data-item-id="${item.id}">Remove</button>
  `;

  return cartItem;
}

// Setup event listeners
function setupEventListeners() {
  // Quantity controls
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("increase-btn")) {
      const itemId = parseInt(e.target.dataset.itemId);
      updateQuantity(itemId, 1);
    }

    if (e.target.classList.contains("decrease-btn")) {
      const itemId = parseInt(e.target.dataset.itemId);
      updateQuantity(itemId, -1);
    }

    if (e.target.classList.contains("remove-btn")) {
      const itemId = parseInt(e.target.dataset.itemId);
      removeItem(itemId);
    }
  });

  // Checkout button
  document
    .getElementById("checkout-btn")
    .addEventListener("click", completeCheckout);
}

// Update item quantity
function updateQuantity(itemId, change) {
  if (change > 0) {
    // Add one more of this item
    const originalItem = cart.find((item) => item.id === itemId);
    if (originalItem) {
      cart.push({ ...originalItem });
    }
  } else {
    // Remove one of this item
    const itemIndex = cart.findIndex((item) => item.id === itemId);
    if (itemIndex !== -1) {
      cart.splice(itemIndex, 1);
    }
  }

  // Update localStorage
  localStorage.setItem("cart", JSON.stringify(cart));

  // Refresh display
  displayCartItems();
  updateOrderSummary();

  // Update main page cart count if it exists
  updateMainPageCartCount();
}

// Remove item completely
function removeItem(itemId) {
  cart = cart.filter((item) => item.id !== itemId);

  // Update localStorage
  localStorage.setItem("cart", JSON.stringify(cart));

  // Refresh display
  displayCartItems();
  updateOrderSummary();

  // Update main page cart count if it exists
  updateMainPageCartCount();
}

// Update order summary
function updateOrderSummary() {
  const subtotalElement = document.getElementById("subtotal");
  const taxElement = document.getElementById("tax");
  const totalElement = document.getElementById("total");

  // Calculate subtotal
  const subtotal = cart.reduce((sum, item) => {
    const price = parseFloat(item.price.replace("$", ""));
    return sum + price;
  }, 0);

  // Calculate tax (8.5%)
  const tax = subtotal * 0.085;

  // Calculate total
  const total = subtotal + tax;

  // Update display
  subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
  taxElement.textContent = `$${tax.toFixed(2)}`;
  totalElement.textContent = `$${total.toFixed(2)}`;
}

// Complete checkout
function completeCheckout() {
  if (cart.length === 0) {
    alert("Your cart is empty! Add some products first.");
    return;
  }

  // Show success animation
  showSuccessAnimation();

  // Clear cart after delay
  setTimeout(() => {
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));

    // Redirect to main page
    window.location.href = "index.html";
  }, 3000);
}

// Show success animation
function showSuccessAnimation() {
  const successDiv = document.createElement("div");
  successDiv.className = "success-animation";
  successDiv.innerHTML = `
    <h3>🎉 Order Successful!</h3>
    <p>Thank you for your purchase! You'll be redirected shortly.</p>
    <div style="font-size: 3em; margin: 20px 0;">✨</div>
  `;

  document.body.appendChild(successDiv);

  // Trigger animation
  setTimeout(() => {
    successDiv.classList.add("show");
  }, 100);

  // Remove after animation
  setTimeout(() => {
    successDiv.remove();
  }, 3500);
}

// Update main page cart count (if main page is open in another tab)
function updateMainPageCartCount() {
  // This would work if both pages were open, but localStorage events
  // don't fire on the same page that made the change
  localStorage.setItem("cartUpdated", Date.now().toString());
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", initializeCheckout);
