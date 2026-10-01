// ==========================================
// LUMORA MARKETPLACE
// ==========================================


// ---------- GET HTML ELEMENTS ----------

const productGrid = document.getElementById("productGrid");
const productCount = document.getElementById("productCount");
const noProducts = document.getElementById("noProducts");

const searchInput = document.getElementById("search");
const categoryFilters = document.querySelectorAll(".category-filter");
const priceRange = document.getElementById("priceRange");
const priceValue = document.getElementById("priceValue");
const sortSelect = document.getElementById("sort");
const clearFiltersBtn = document.getElementById("clearFilters");

const cartBtn = document.getElementById("cartBtn");
const cartCount = document.getElementById("cartCount");

const cartOverlay = document.getElementById("cartOverlay");
const cartSidebar = document.getElementById("cartSidebar");
const closeCartBtn = document.getElementById("closeCart");

const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");


// ---------- VARIABLES ----------

let products = [];
let cart = JSON.parse(localStorage.getItem("lumoraCart")) || [];


// ==========================================
// LOAD PRODUCTS FROM JSON
// ==========================================

async function loadProducts() {

    try {

        const response = await fetch("product.json");

        products = await response.json();

        displayProducts(products);

        updateCart();

    } catch (error) {

        console.error("Products could not be loaded:", error);

    }
}


// ==========================================
// DISPLAY PRODUCTS
// ==========================================

function displayProducts(productsToDisplay) {

    productGrid.innerHTML = "";

    productCount.textContent =
        `${productsToDisplay.length} Products`;


    // If no products found

    if (productsToDisplay.length === 0) {

        noProducts.style.display = "block";

        return;
    }


    noProducts.style.display = "none";


    // Create product cards

    productsToDisplay.forEach(product => {

        const productCard = document.createElement("div");

        productCard.classList.add("product-card");


        productCard.innerHTML = `

            <img
                src="${product.image}"
                alt="${product.name}"
                class="product-image"
            >

            <div class="product-info">

                <p class="product-category">
                    ${product.category}
                </p>

                <h3 class="product-name">
                    ${product.name}
                </h3>

                <p class="product-price">
                    PKR ${product.price.toLocaleString()}
                </p>

                <button
                    class="add-to-cart"
                    data-id="${product.id}"
                >
                    Add to Cart
                </button>

            </div>

        `;


        productGrid.appendChild(productCard);

    });


    // Add event listeners to Add to Cart buttons

    const addToCartButtons =
        document.querySelectorAll(".add-to-cart");


    addToCartButtons.forEach(button => {

        button.addEventListener("click", () => {

            const productId = Number(button.dataset.id);

            addToCart(productId);

        });

    });

}


// ==========================================
// INITIALIZE APP
// ==========================================

loadProducts();


// ==========================================
// FILTER PRODUCTS
// ==========================================

function filterProducts() {

    const searchText =
        searchInput.value.toLowerCase().trim();


    // Get selected categories

    const selectedCategories = [];

    categoryFilters.forEach(checkbox => {

        if (checkbox.checked) {

            selectedCategories.push(
                checkbox.value
            );

        }

    });


    // Maximum price

    const maximumPrice =
        Number(priceRange.value);


    // Filter products

    let filteredProducts = products.filter(product => {

        const matchesSearch =
            product.name
                .toLowerCase()
                .includes(searchText);


        const matchesCategory =
            selectedCategories.length === 0 ||
            selectedCategories.includes(product.category);


        const matchesPrice =
            product.price <= maximumPrice;


        return (
            matchesSearch &&
            matchesCategory &&
            matchesPrice
        );

    });


    // Sort products

    filteredProducts = sortProducts(filteredProducts);


    // Display final products

    displayProducts(filteredProducts);

}


// ==========================================
// SORT PRODUCTS
// ==========================================

function sortProducts(productsArray) {

    const sortValue = sortSelect.value;

    const sortedProducts = [...productsArray];


    if (sortValue === "low-high") {

        sortedProducts.sort(
            (a, b) => a.price - b.price
        );

    }


    else if (sortValue === "high-low") {

        sortedProducts.sort(
            (a, b) => b.price - a.price
        );

    }


    else if (sortValue === "name-a-z") {

        sortedProducts.sort(
            (a, b) =>
                a.name.localeCompare(b.name)
        );

    }


    else if (sortValue === "name-z-a") {

        sortedProducts.sort(
            (a, b) =>
                b.name.localeCompare(a.name)
        );

    }


    return sortedProducts;

}


// ==========================================
// PRICE RANGE
// ==========================================

priceRange.addEventListener("input", () => {

    const price =
        Number(priceRange.value);


    priceValue.textContent =
        `PKR ${price.toLocaleString()}`;


    filterProducts();

});


// ==========================================
// SEARCH
// ==========================================

searchInput.addEventListener("input", () => {

    filterProducts();

});


// ==========================================
// CATEGORY FILTER
// ==========================================

categoryFilters.forEach(checkbox => {

    checkbox.addEventListener("change", () => {

        filterProducts();

    });

});


// ==========================================
// SORT
// ==========================================

sortSelect.addEventListener("change", () => {

    filterProducts();

});


// ==========================================
// CLEAR FILTERS
// ==========================================

clearFiltersBtn.addEventListener("click", () => {

    // Clear search

    searchInput.value = "";


    // Uncheck categories

    categoryFilters.forEach(checkbox => {

        checkbox.checked = false;

    });


    // Reset price

    priceRange.value = 20000;

    priceValue.textContent = "PKR 20,000";


    // Reset sorting

    sortSelect.value = "default";


    // Display all products

    displayProducts(products);

});


// ==========================================
// ADD TO CART
// ==========================================

function addToCart(productId) {

    const product =
        products.find(
            product => product.id === productId
        );


    if (!product) {
        return;
    }


    cart.push(product);


    saveCart();

    updateCart();

}


// ==========================================
// SAVE CART TO LOCAL STORAGE
// ==========================================

function saveCart() {

    localStorage.setItem(
        "lumoraCart",
        JSON.stringify(cart)
    );

}


// ==========================================
// UPDATE CART
// ==========================================

function updateCart() {

    cartCount.textContent = cart.length;

    cartItems.innerHTML = "";


    // Empty cart

    if (cart.length === 0) {

        cartItems.innerHTML = `

            <p style="
                text-align: center;
                color: #777;
                padding: 40px 0;
            ">
                Your cart is empty.
            </p>

        `;

        cartTotal.textContent = "PKR 0";

        return;
    }


    // Display cart items

    cart.forEach((product, index) => {

        const cartItem =
            document.createElement("div");


        cartItem.classList.add("cart-item");


        cartItem.innerHTML = `

            <img
                src="${product.image}"
                alt="${product.name}"
            >

            <div class="cart-item-info">

                <h4>
                    ${product.name}
                </h4>

                <p>
                    PKR ${product.price.toLocaleString()}
                </p>

                <button
                    class="remove-item"
                    data-index="${index}"
                    style="
                        margin-top: 6px;
                        border: none;
                        background: none;
                        color: #777;
                        cursor: pointer;
                        font-size: 11px;
                    "
                >
                    Remove
                </button>

            </div>

        `;


        cartItems.appendChild(cartItem);

    });


    // Remove buttons

    const removeButtons =
        document.querySelectorAll(".remove-item");


    removeButtons.forEach(button => {

        button.addEventListener("click", () => {

            const index =
                Number(button.dataset.index);


            cart.splice(index, 1);

            saveCart();

            updateCart();

        });

    });


    // Calculate total

    const total =
        cart.reduce(
            (sum, product) =>
                sum + product.price,
            0
        );


    cartTotal.textContent =
        `PKR ${total.toLocaleString()}`;

}


// ==========================================
// OPEN CART
// ==========================================

cartBtn.addEventListener("click", () => {

    cartSidebar.classList.add("active");

    cartOverlay.classList.add("active");

});


// ==========================================
// CLOSE CART
// ==========================================

function closeCart() {

    cartSidebar.classList.remove("active");

    cartOverlay.classList.remove("active");

}


closeCartBtn.addEventListener(
    "click",
    closeCart
);


cartOverlay.addEventListener(
    "click",
    closeCart
);


// ==========================================
// CHECKOUT
// ==========================================

checkoutBtn.addEventListener("click", () => {

    if (cart.length === 0) {

        alert("Your cart is empty.");

        return;
    }


    alert(
        "Thank you for shopping with LUMORA!"
    );

});