
/* ===================================
   FOODIE - FOOD DELIVERY APPLICATION
   JavaScript Functionality
=================================== */

// Food menu data
const foodItems = [
    {
        id: 1,
        name: "Classic Smash Burger",
        category: "Burgers",
        price: 249,
        rating: 4.9,
        emoji: "🍔",
        tag: "BESTSELLER",
        bg: "#fff0df",
        description: "Juicy burger with cheddar cheese, pickles and special sauce."
    },
    {
        id: 2,
        name: "Margherita Pizza",
        category: "Pizza",
        price: 299,
        rating: 4.8,
        emoji: "🍕",
        tag: "VEGETARIAN",
        bg: "#fff0e5",
        description: "Classic pizza with tomato, mozzarella and fresh basil."
    },
    {
        id: 3,
        name: "Creamy Alfredo Pasta",
        category: "Asian",
        price: 279,
        rating: 4.7,
        emoji: "🍝",
        tag: "CHEF'S PICK",
        bg: "#fff4d9",
        description: "Creamy pasta with parmesan cheese and herbs."
    },
    {
        id: 4,
        name: "Rainbow Buddha Bowl",
        category: "Healthy",
        price: 229,
        rating: 4.8,
        emoji: "🥗",
        tag: "FRESH & LIGHT",
        bg: "#eaf4e7",
        description: "Fresh vegetables, avocado, grains and lemon dressing."
    },
    {
        id: 5,
        name: "Crispy Sushi Rolls",
        category: "Asian",
        price: 349,
        rating: 4.9,
        emoji: "🍣",
        tag: "POPULAR",
        bg: "#fbe8e3",
        description: "Delicious sushi rolls with fresh fillings and dip."
    },
    {
        id: 6,
        name: "Double Cheese Burger",
        category: "Burgers",
        price: 329,
        rating: 4.9,
        emoji: "🍔",
        tag: "EXTRA CHEESY",
        bg: "#f8e8d5",
        description: "Two grilled patties with melted cheese and soft buns."
    },
    {
        id: 7,
        name: "Chocolate Lava Cake",
        category: "Desserts",
        price: 159,
        rating: 4.8,
        emoji: "🍫",
        tag: "SWEET TREAT",
        bg: "#f4e5df",
        description: "Warm chocolate cake with a rich, gooey centre."
    },
    {
        id: 8,
        name: "Berry Cheesecake",
        category: "Desserts",
        price: 189,
        rating: 4.7,
        emoji: "🍰",
        tag: "MUST TRY",
        bg: "#f9e7ef",
        description: "Creamy cheesecake topped with fresh berries."
    }
];


// Get HTML elements
const foodGrid = document.querySelector("#food-grid");
const searchInput = document.querySelector("#food-search");
const categoryFilters = document.querySelector("#category-filters");
const emptyState = document.querySelector("#empty-state");

const cartDrawer = document.querySelector("#cart-drawer");
const cartOverlay = document.querySelector("#cart-overlay");
const cartItemsElement = document.querySelector("#cart-items");
const cartEmpty = document.querySelector("#cart-empty");
const cartFooter = document.querySelector("#cart-footer");
const toast = document.querySelector("#toast");


// Application state
let activeCategory = "All";
let cart = [];
let favorites = new Set();
let toastTimeout;


// Format prices in Indian Rupees
function formatPrice(price) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(price);
}


// Display food cards
function renderFood() {
    const query = searchInput.value.trim().toLowerCase();

    const filteredFoods = foodItems.filter(food => {
        const matchesCategory =
            activeCategory === "All" ||
            food.category === activeCategory;

        const searchableText =
            `${food.name} ${food.category} ${food.description}`
                .toLowerCase();

        const matchesSearch = searchableText.includes(query);

        return matchesCategory && matchesSearch;
    });

    foodGrid.innerHTML = filteredFoods.map(food => `
        <article class="food-card">

            <div class="food-image" style="--food-bg: ${food.bg}">

                <span class="food-tag">${food.tag}</span>

                <button
                    class="favorite-button ${favorites.has(food.id) ? "liked" : ""}"
                    data-favorite="${food.id}"
                    aria-label="Toggle ${food.name} favorite"
                    aria-pressed="${favorites.has(food.id)}">
                    ${favorites.has(food.id) ? "♥" : "♡"}
                </button>

                <span class="food-emoji" role="img"
                    aria-label="${food.name}">
                    ${food.emoji}
                </span>

            </div>

            <div class="food-info">

                <div class="food-name-row">
                    <h3>${food.name}</h3>
                    <span class="rating">★ ${food.rating}</span>
                </div>

                <p class="food-description">
                    ${food.description}
                </p>

                <div class="food-meta">

                    <span class="food-price">
                        ${formatPrice(food.price)}
                    </span>

                    <button class="add-button" data-add="${food.id}">
                        ＋ Add
                    </button>

                </div>

            </div>

        </article>
    `).join("");

    emptyState.hidden = filteredFoods.length > 0;
}


// Add food to cart
function addToCart(id) {
    const food = foodItems.find(item => item.id === id);

    if (!food) return;

    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...food,
            quantity: 1
        });
    }

    renderCart();

    showToast(`${food.name} added to your cart`);
}


// Increase or decrease item quantity
function changeQuantity(id, amount) {
    const item = cart.find(food => food.id === id);

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        cart = cart.filter(food => food.id !== id);
    }

    renderCart();
}


// Remove an item from the cart
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    renderCart();
}


// Display shopping cart
function renderCart() {
    const totalItems = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const subtotal = cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    document.querySelector("#cart-count").textContent = totalItems;

    document.querySelector("#cart-heading-count").textContent =
        `(${totalItems})`;

    document.querySelector("#cart-subtotal").textContent =
        formatPrice(subtotal);

    cartEmpty.hidden = totalItems > 0;
    cartFooter.hidden = totalItems === 0;
    cartItemsElement.hidden = totalItems === 0;

    cartItemsElement.innerHTML = cart.map(item => `
        <article class="cart-item">

            <div class="cart-item-emoji"
                style="--food-bg: ${item.bg}">
                ${item.emoji}
            </div>

            <div>

                <h3>${item.name}</h3>

                <span class="cart-item-price">
                    ${formatPrice(item.price)} each
                </span>

                <div class="quantity-controls">

                    <button
                        data-quantity="${item.id}"
                        data-change="-1"
                        aria-label="Decrease quantity">
                        −
                    </button>

                    <span>${item.quantity}</span>

                    <button
                        data-quantity="${item.id}"
                        data-change="1"
                        aria-label="Increase quantity">
                        +
                    </button>

                </div>

            </div>

            <button
                class="remove-item"
                data-remove="${item.id}"
                aria-label="Remove ${item.name}">
                ×
            </button>

        </article>
    `).join("");
}


// Open shopping cart
function openCart() {
    cartDrawer.classList.add("open");

    cartDrawer.setAttribute("aria-hidden", "false");

    cartOverlay.hidden = false;

    document.body.classList.add("cart-open");

    document.querySelector("#cart-close").focus();
}


// Close shopping cart
function closeCart() {
    cartDrawer.classList.remove("open");

    cartDrawer.setAttribute("aria-hidden", "true");

    cartOverlay.hidden = true;

    document.body.classList.remove("cart-open");

    document.querySelector("#cart-toggle").focus();
}


// Show notification messages
function showToast(message) {
    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimeout);

    toastTimeout = setTimeout(() => {
        toast.classList.remove("show");
    }, 2400);
}


// Food card buttons
foodGrid.addEventListener("click", function(event) {

    const addButton = event.target.closest("[data-add]");

    const favoriteButton = event.target.closest("[data-favorite]");

    // Add food to cart
    if (addButton) {
        addToCart(Number(addButton.dataset.add));
    }

    // Add or remove favorites
    if (favoriteButton) {
        const id = Number(favoriteButton.dataset.favorite);

        if (favorites.has(id)) {
            favorites.delete(id);
        } else {
            favorites.add(id);
        }

        renderFood();
    }
});


// Filter food categories
categoryFilters.addEventListener("click", function(event) {

    const button = event.target.closest("[data-category]");

    if (!button) return;

    activeCategory = button.dataset.category;

    categoryFilters.querySelectorAll(".category-chip")
        .forEach(chip => {
            const isActive = chip === button;

            chip.classList.toggle("active", isActive);

            chip.setAttribute("aria-pressed", String(isActive));
        });

    renderFood();
});


// Search food
searchInput.addEventListener("input", renderFood);


// Cart quantity and remove buttons
cartItemsElement.addEventListener("click", function(event) {

    const quantityButton = event.target.closest("[data-quantity]");

    const removeButton = event.target.closest("[data-remove]");

    if (quantityButton) {
        const id = Number(quantityButton.dataset.quantity);
        const amount = Number(quantityButton.dataset.change);

        changeQuantity(id, amount);
    }

    if (removeButton) {
        removeFromCart(Number(removeButton.dataset.remove));
    }
});


// Cart open and close controls
document.querySelector("#cart-toggle")
    .addEventListener("click", openCart);

document.querySelector("#cart-close")
    .addEventListener("click", closeCart);

cartOverlay.addEventListener("click", closeCart);


// Browse menu from empty cart
document.querySelector("#browse-menu")
    .addEventListener("click", function() {
        closeCart();

        document.querySelector("#menu").scrollIntoView({
            behavior: "smooth"
        });
    });


// Demo checkout button
document.querySelector("#checkout-button")
    .addEventListener("click", function() {
        showToast(
            "Demo checkout only. Connect a payment service to accept orders."
        );
    });


// Keyboard shortcuts
document.addEventListener("keydown", function(event) {

    if (
        event.key === "Escape" &&
        cartDrawer.classList.contains("open")
    ) {
        closeCart();
    }

    if (
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === "k"
    ) {
        event.preventDefault();
        searchInput.focus();
    }
});


// Automatically update copyright year
document.querySelector("#year").textContent =
    new Date().getFullYear();


// Initialize website
renderFood();
renderCart();
