// Sample product data
const products = [
    { id: 1, name: "Product A", price: 10.00 },
    { id: 2, name: "Product B", price: 20.00 },
    { id: 3, name: "Product C", price: 15.00 },
    { id: 4, name: "Product D", price: 25.00 }
];

const cart = {};

const productList = document.getElementById('productList');
const cartDiv = document.getElementById('cart');
const totalPriceElement = document.getElementById('totalPrice');

// Display products
products.forEach(product => {
    const div = document.createElement('div');
    div.classList.add('product');
    div.innerHTML = `
        <h3>${product.name}</h3>
        <p>Price: $${product.price.toFixed(2)}</p>
        <button onclick="addToCart(${product.id})">Add to Cart</button>
    `;
    productList.appendChild(div);
});

// Add to cart function
function addToCart(productId) {
    if (cart[productId]) {
        cart[productId].quantity += 1;
    } else {
        const product = products.find(p => p.id === productId);
        cart[productId] = { ...product, quantity: 1 };
    }
    updateCart();
}

// Update cart display
function updateCart() {
    cartDiv.innerHTML = '';
    let total = 0;

    for (const id in cart) {
        const item = cart[id];
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `
            <h4>${item.name}</h4>
            <p>Price: $${item.price.toFixed(2)}</p>
            <div class="quantity-controls">
                <button onclick="decreaseQuantity(${item.id})">-</button>
                <span>${item.quantity}</span>
                <button onclick="increaseQuantity(${item.id})">+</button>
            </div>
            <p>Total: $${itemTotal.toFixed(2)}</p>
        `;
        cartDiv.appendChild(div);
    }

    if (total === 0) {
        cartDiv.innerHTML = '<p>No items in cart.</p>';
    }

    totalPriceElement.textContent = `Total: $${total.toFixed(2)}`;
}

// Increase quantity
function increaseQuantity(productId) {
    cart[productId].quantity += 1;
    updateCart();
}

// Decrease quantity
function decreaseQuantity(productId) {
    if (cart[productId].quantity > 1) {
        cart[productId].quantity -= 1;
    } else {
        delete cart[productId];
    }
    updateCart();
}
