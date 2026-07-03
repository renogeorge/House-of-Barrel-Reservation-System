    console.log("Script Loaded");
    // Cart functionality
    let lastTransactionId = null;

    let cart = []

    // Smooth scrolling for navigation
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", function (e) {
        if (this.id === "authLink") return

        if (this.getAttribute("href").startsWith("#")) {
          e.preventDefault()
          const targetId = this.getAttribute("href")
          const targetSection = document.querySelector(targetId)

          if (targetSection) {
            const navHeight = document.querySelector(".navbar").offsetHeight
            const targetPosition = targetSection.offsetTop - navHeight

            window.scrollTo({
              top: targetPosition,
              behavior: "smooth",
            })

            // Update active link
            document.querySelectorAll(".nav-link").forEach((l) => l.classList.remove("active"))
            this.classList.add("active")
          }
        }
      })
    })

    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector(".mobile-menu-btn")
    const navMenu = document.querySelector(".nav-menu")
    const navActions = document.querySelector(".nav-actions")

    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener("click", () => {
        navMenu.classList.toggle("active")
        navActions.classList.toggle("active")
      })
    }


    // Category filter for drinks
    const tabButtons = document.querySelectorAll(".tab-btn")
    const drinkCards = document.querySelectorAll(".drink-card")

    tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const category = button.getAttribute("data-category")

        // Update active tab
        tabButtons.forEach((btn) => btn.classList.remove("active"))
        button.classList.add("active")

        // Filter drinks
        drinkCards.forEach((card) => {
          if (category === "all" || card.getAttribute("data-category") === category) {
            card.style.display = "block"
            setTimeout(() => {
              card.style.opacity = "1"
              card.style.transform = "translateY(0)"
            }, 10)
          } else {
            card.style.opacity = "0"
            card.style.transform = "translateY(20px)"
            setTimeout(() => {
              card.style.display = "none"
            }, 300)
          }
        })
      })
    })

    // Add to cart functionality
    document.querySelectorAll(".btn-add").forEach((button) => {
      button.addEventListener("click", function () {
        const card = this.closest(".drink-card, .food-card")
        const name = card.querySelector("h3").textContent
        const priceText = card.querySelector(".price").textContent
        const price = Number.parseInt(priceText.replace("₹", ""))

        // Add to cart
        const existingItem = cart.find((item) => item.name === name)
        if (existingItem) {
          existingItem.quantity += 1
        } else {
          cart.push({
            name: name,
            price: price,
            quantity: 1,
          })
        
        }

        updateCart()

        // Visual feedback
        this.textContent = "Added!"
        this.style.background = "#10B981"
        setTimeout(() => {
          this.textContent = "Add to Cart"
          this.style.background = ""
        }, 1000)
      })
    })

    // Update cart display
    function updateCart() {
      const cartItems = document.getElementById("cartItems")
      const subtotalEl = document.getElementById("subtotal")
      const totalEl = document.getElementById("total")

      if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty. Add items from our menu!</p>'
        subtotalEl.textContent = "₹0"
        totalEl.textContent = "₹0"
        return
      }

      let html = ""
      let subtotal = 0

      cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity
        subtotal += itemTotal

        html += `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>Qty: ${item.quantity}</p>
                    </div>
                    <div class="cart-item-actions">
                        <span class="cart-item-price">₹${itemTotal}</span>
                        <button class="remove-btn" onclick="removeFromCart(${index})">×</button>
                    </div>
                </div>
            `
      })

      cartItems.innerHTML = html
      subtotalEl.textContent = `₹${subtotal}`
      totalEl.textContent = `₹${subtotal + 50}`
    }

    // Remove from cart
    function removeFromCart(index) {
      cart.splice(index, 1)
      updateCart()
    }

    // Handle reservation form submission
    const reservationForm = document.getElementById("reservationForm");
    if (reservationForm) {
      reservationForm.addEventListener("submit", async function (e) {
        e.preventDefault();

      const formData = {
        name: document.getElementById("name").value,
        phone: document.getElementById("phone").value,
        date: document.getElementById("date").value,
        time: document.getElementById("time").value,
        guests: Number(document.getElementById("guests").value),
        tableType: document.getElementById("tableType").value,
        specialRequests: document.getElementById("specialRequests").value,
      }

      try {
        const token = localStorage.getItem("access_token")
        console.log("token being sent here",token);
        const response = await fetch("http://127.0.0.1:8000/api/reservation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(formData),
        })

        const data = await response.json()

        if (!response.ok) {
          if (response.status === 401) {
            showPopup("⚠ Please login to make a reservation.")
          } else {
            showPopup(data.detail || "Something went wrong.")
          }
          return
        }

        showPopup("✅ Reservation created successfully!")
        this.reset()

      } catch (error) {
        showPopup("Server error. Please try again.")
      }
    })
const takeawayForm = document.getElementById("takeawayForm");
    // Handle takeaway form submission
    // Handle takeaway form submission
takeawayForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  if (cart.length === 0) {
    alert("Please add items to cart first.");
    return;
  }

  const modal = document.getElementById("paymentModal");
  const status = document.getElementById("paymentStatus");
  const transaction = document.getElementById("transactionId");
  const spinner = document.querySelector(".spinner");

  if (modal) modal.style.display = "flex";
  if (status) status.innerText = "Processing Payment...";
  if (spinner) spinner.style.display = "block";
try {

  // ✅ Generate transaction ID BEFORE sending
  const transactionId = "HOB" + Date.now();

  const response = await fetch("http://127.0.0.1:8000/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      transaction_id: transactionId,
      customer_name: document.getElementById("customerName").value,
      phone: document.getElementById("customerPhone").value,
      address: document.getElementById("address").value,
      items: cart,
      total: document.getElementById("total").textContent
    })
  });
  // If backend crashes, this prevents infinite loading
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Backend error:", errorText);
    alert("Order failed. Please try again.");
    
    if (spinner) spinner.style.display = "none";
    return;
  }

  const orderData = await response.json();

  // Safety check
  if (!orderData.transaction_id) {
    console.error("transaction_id missing in response");
    alert("Order saved but transaction ID missing.");
    if (spinner) spinner.style.display = "none";
    return;
  }

  // Save correct ID
  lastTransactionId = orderData.transaction_id;

  if (status) status.innerText = "Payment Successful ✅";
  if (spinner) spinner.style.display = "none";

  // Optional: auto close modal after 2 sec
  setTimeout(() => {
    const modal = document.getElementById("paymentModal");
    if (modal) modal.style.display = "none";
  }, 2000);

  // Clear cart
  cart = [];
  updateCart();

} catch (error) {
  console.error("Fetch crashed:", error);
  alert("Server error. Please try again.");
  
  if (spinner) spinner.style.display = "none";
}
    // Navbar scroll effect
    let lastScroll = 0
    const navbar = document.querySelector(".navbar")

    window.addEventListener("scroll", () => {
      const currentScroll = window.pageYOffset

      if (currentScroll > 100) {
        navbar.style.background = "rgba(18, 18, 18, 0.98)"
        navbar.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.5)"
      } else {
        navbar.style.background = "rgba(18, 18, 18, 0.95)"
        navbar.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.3)"
      }

      lastScroll = currentScroll
    })

    // Set minimum date for reservation (today)
    const dateInput = document.getElementById("date")
    const today = new Date().toISOString().split("T")[0]
    dateInput.setAttribute("min", today)
    function showPopup(message) {
      const popup = document.createElement("div")
      popup.className = "custom-popup"
      popup.innerHTML = `
        <div class="popup-content">
          <p>${message}</p>
          <button onclick="this.closest('.custom-popup').remove()">OK</button>
        </div>
      `
      document.body.appendChild(popup)
    }


    // Logout
    function logout() {
      localStorage.removeItem("access_token");
      alert("Logged out successfully");
      window.location.href = "login.html";
    }

    // Toggle login/logout button visibility
    document.addEventListener("DOMContentLoaded", function () {
      const token = localStorage.getItem("access_token");
      const loginBtn = document.getElementById("loginBtn");
      const logoutBtn = document.getElementById("logoutBtn");

      if (token) {
        if (loginBtn) loginBtn.style.display = "none";
        if (logoutBtn) logoutBtn.style.display = "inline-block";
      } else {
        if (loginBtn) loginBtn.style.display = "inline-block";
        if (logoutBtn) logoutBtn.style.display = "none";
      }
    });

    // Close payment modal
    function closePaymentModal() {
      const modal = document.getElementById("paymentModal");
      if (modal) modal.style.display = "none";
    }

    // Download invoice
    function downloadInvoice() {
  if (!lastTransactionId) {
    alert("No transaction found");
    return;
  }

  window.open(
    `http://127.0.0.1:8000/api/orders/${lastTransactionId}/invoice`,
    "_blank"
  );
}

    // Fade animation
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }
      });
    });

       document.querySelectorAll(".section").forEach(section => {
      section.classList.add("fade-up");
      observer.observe(section);
    });
   window.addEventListener("click", function (e) {
  const modal = document.getElementById("paymentModal");
  if (e.target === modal) {
    modal.style.display = "none";
  }
})})}
document.addEventListener("DOMContentLoaded", function () {

  const menuData = JSON.parse(localStorage.getItem("menuData"));
  if (!menuData) return;

  document.querySelectorAll(".drink-card").forEach(card => {

    const id = card.dataset.id;
    if (!menuData[id]) return;

    card.querySelector("h3").textContent = menuData[id].name;
    card.querySelector(".category-badge").textContent = menuData[id].category;
    card.querySelector(".price").textContent = menuData[id].price;
    card.querySelector("img").src = menuData[id].image;

  });

});