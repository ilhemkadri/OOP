class Product {
  constructor(name, price) {
    this.name = name;
    this.price = price;
  }
}

class ShoppingCartItem {
  constructor(product, quantity) {
    this.product = product;
    this.quantity = quantity;
  }

  calculateTotalPrice() {
    return this.product.price * this.quantity;
  }
}

class ShoppingCart {
  constructor() {
    this.items = [];
  }

  addItem(product, quantity) {
    const existingItem = this.items.find(item => item.product.name === product.name);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push(new ShoppingCartItem(product, quantity));
    }
    this.updateTotalPrice();
  }

  removeItem(productName) {
    this.items = this.items.filter(item => item.product.name !== productName);
    this.updateTotalPrice();
  }

  updateQuantity(productName, quantity) {
    const item = this.items.find(item => item.product.name === productName);
    if (item) {
      item.quantity = quantity > 0 ? quantity : 1;
      this.updateTotalPrice();
    }
  }

  updateTotalPrice() {
    const total = this.items.reduce((sum, item) => sum + item.calculateTotalPrice(), 0);
    document.getElementById("total-price").textContent = `$${total.toFixed(2)}`;
  }
}

const cart = new ShoppingCart();

function updateQuantity(button, change) {
  const itemElement = button.closest(".cart-item");
  const itemName = itemElement.querySelector(".item-name").textContent;
  const quantityElement = itemElement.querySelector(".quantity-value");
  let quantity = parseInt(quantityElement.textContent) + change;

  if (quantity < 1) quantity = 1;
  quantityElement.textContent = quantity;
  cart.updateQuantity(itemName, quantity);
}

document.querySelectorAll(".plus-button").forEach(button => {
  button.addEventListener("click", () => updateQuantity(button, 1));
});

document.querySelectorAll(".minus-button").forEach(button => {
  button.addEventListener("click", () => updateQuantity(button, -1));
});

document.querySelectorAll(".delete-button").forEach(button => {
  button.addEventListener("click", () => {
    const itemElement = button.closest(".cart-item");
    const itemName = itemElement.querySelector(".item-name").textContent;
    itemElement.remove();
    cart.removeItem(itemName);
  });
});

document.querySelectorAll(".cart-item").forEach(itemElement => {
  const name = itemElement.querySelector(".item-name").textContent;
  const price = parseFloat(itemElement.querySelector(".item-price").textContent.replace("$", ""));
  const quantity = parseInt(itemElement.querySelector(".quantity-value").textContent);
  const product = new Product(name, price);
  cart.addItem(product, quantity);
});

cart.updateTotalPrice();
