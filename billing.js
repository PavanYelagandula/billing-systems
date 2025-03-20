const RAZORPAY_KEY = "YOUR_RAZORPAY_KEY_HERE"; // Replace with your Razorpay Key ID

const items = [
    { name: "Shirt", price: 499.00 },
    { name: "Jeans", price: 899.00 },
    { name: "Saree", price: 1499.00 },
    { name: "Kurti", price: 699.00 },
    { name: "Trousers", price: 799.00 }
];

const itemsContainer = document.getElementById('items');
const cartItemsList = document.getElementById('cart-items');
const totalElement = document.getElementById('total');
const checkoutButton = document.getElementById('checkout');
const payNowButton = document.getElementById('pay-now');

const modal = document.getElementById('checkout-modal');
const invoiceItems = document.getElementById('invoice-items');
const subtotalElement = document.getElementById('subtotal');
const gstElement = document.getElementById('gst');
const finalTotalElement = document.getElementById('final-total');
const closeModal = document.getElementById('close-modal');
const printInvoice = document.getElementById('print-invoice');

const cartItems = [];

// Load items dynamically
items.forEach(item => {
    const itemElement = document.createElement('div');
    itemElement.classList.add('item');
    itemElement.innerHTML = `
        <span class="item-name">${item.name}</span>
        <span class="item-price">₹${item.price.toFixed(2)}</span>
        <button class="add-to-cart">Add to Cart</button>
    `;
    itemsContainer.appendChild(itemElement);

    itemElement.querySelector('.add-to-cart').addEventListener('click', () => {
        addToCart(item);
    });
});

function addToCart(item) {
    cartItems.push(item);
    renderCart();
}

function renderCart() {
    cartItemsList.innerHTML = '';
    let total = 0;

    cartItems.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - ₹${item.price.toFixed(2)}`;
        cartItemsList.appendChild(li);
        total += item.price;
    });

    totalElement.textContent = `Total: ₹${total.toFixed(2)}`;
}

checkoutButton.addEventListener('click', () => {
    if (cartItems.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    modal.style.display = "flex";
    invoiceItems.innerHTML = '';
    let subtotal = 0;

    cartItems.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - ₹${item.price.toFixed(2)}`;
        invoiceItems.appendChild(li);
        subtotal += item.price;
    });

    let gst = subtotal * 0.18;
    let finalTotal = subtotal + gst;

    subtotalElement.textContent = `Subtotal: ₹${subtotal.toFixed(2)}`;
    gstElement.textContent = `GST (18%): ₹${gst.toFixed(2)}`;
    finalTotalElement.textContent = `Final Total: ₹${finalTotal.toFixed(2)}`;
});

payNowButton.addEventListener('click', () => {
    let amount = parseFloat(finalTotalElement.textContent.replace("Final Total: ₹", "")) * 100;

    let options = {
        key: RAZORPAY_KEY,
        amount: amount,
        currency: "INR",
        name: "Swapna Cloth Store",
        description: "Order Payment",
        handler: function (response) {
            alert("Payment successful: " + response.razorpay_payment_id);
            modal.style.display = "none";
        }
    };

    let rzp = new Razorpay(options);
    rzp.open();
});

closeModal.addEventListener('click', () => {
    modal.style.display = "none";
});

printInvoice.addEventListener('click', () => {
    window.print();
});
