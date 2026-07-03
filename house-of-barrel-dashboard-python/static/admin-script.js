console.log("ADMIN SCRIPT FULL STABLE VERSION LOADED");

/* =====================================================
   DOM READY
===================================================== */
 document.addEventListener("DOMContentLoaded", function () {
function showSection(sectionId) {
  document.querySelectorAll(".admin-section").forEach(section => {
    section.style.display = "none";
  });

  const activeSection = document.getElementById(sectionId);
  if (activeSection) {
    activeSection.style.display = "block";
  }
}
  document.querySelectorAll(".action-btn.edit").forEach(button => {
    button.addEventListener("click", function () {

      const card = this.closest(".menu-card");
      const id = card.dataset.id;

      const nameEl = card.querySelector("h3");
      const categoryEl = card.querySelector(".menu-category");
      const priceEl = card.querySelector(".menu-price");
      const imageEl = card.querySelector("img");

      const newName = prompt("Enter new name:", nameEl.textContent);
      const newCategory = prompt("Enter new category:", categoryEl.textContent);
      const newPrice = prompt("Enter new price:", priceEl.textContent.replace("₹",""));
      const newImage = prompt("Enter new image path:", imageEl.getAttribute("src"));

      if (newName) nameEl.textContent = newName;
      if (newCategory) categoryEl.textContent = newCategory;
      if (newPrice) priceEl.textContent = "₹" + newPrice;
      if (newImage) imageEl.src = newImage;

      let menuData = JSON.parse(localStorage.getItem("menuData")) || {};

      menuData[id] = {
        name: nameEl.textContent,
        category: categoryEl.textContent,
        price: priceEl.textContent,
        image: imageEl.getAttribute("src")
      };

      localStorage.setItem("menuData", JSON.stringify(menuData));

      console.log("Saved:", menuData);
      alert("Updated successfully ✅");

    });
  });


  /* ================= LOGOUT ================= */
  const logoutBtn = document.querySelector(".logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to logout?")) {
        localStorage.removeItem("access_token");
        window.location.href = "index.html";
      }
    });
  }

  /* ================= EDIT BUTTON ================= */
  document.querySelectorAll(".action-btn.edit").forEach((btn) => {
    btn.addEventListener("click", () => {
      alert("Edit functionality would open here");
    });
  });

  /* ================= DELETE BUTTON ================= */
  document.querySelectorAll(".action-btn.delete").forEach((btn) => {
    btn.addEventListener("click", function () {
      if (confirm("Are you sure you want to delete this item?")) {
        const parent = this.closest("tr, .menu-card");
        if (parent) parent.remove();
      }
    });
  });

  /* ================= COMPLETE ORDER BUTTON ================= */
  document.querySelectorAll(".action-btn.complete").forEach((btn) => {
    btn.addEventListener("click", function () {
      const row = this.closest("tr");
      if (!row) return;

      const statusBadge = row.querySelector(".status-badge");
      if (statusBadge) {
        statusBadge.textContent = "Delivered";
        statusBadge.className = "status-badge delivered";
        alert("Order marked as complete!");
      }
    });
  });

  /* ================= STATUS SELECT ================= */
  document.querySelectorAll(".status-select").forEach((select) => {
    select.addEventListener("change", function () {
      const status = this.value;
      alert(`Order status updated to: ${status}`);
    });
  });

  /* ================= AVAILABILITY TOGGLE ================= */
  document.querySelectorAll(".availability-toggle").forEach((toggle) => {
    toggle.addEventListener("change", function () {
      const card = this.closest(".menu-card-content");
      if (!card) return;

      const statusText = card.querySelector(".availability-status");
      if (!statusText) return;

      if (this.checked) {
        statusText.textContent = "Available";
        statusText.className = "availability-status available";
      } else {
        statusText.textContent = "Out of Stock";
        statusText.className = "availability-status unavailable";
      }
    });
  });

  /* ================= SIMPLE CHART ================= */
  const canvas = document.getElementById("weeklyChart");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    canvas.width = 400;
    canvas.height = 200;

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const sales = [28000, 32000, 29000, 35000, 38000, 42000, 41600];

    const barWidth = 40;
    const gap = 15;
    const maxSales = Math.max(...sales);

    ctx.fillStyle = "#C9A24D";

    sales.forEach((sale, i) => {
      const barHeight = (sale / maxSales) * 150;
      const x = i * (barWidth + gap) + 20;
      const y = 170 - barHeight;

      ctx.fillRect(x, y, barWidth, barHeight);

      ctx.fillStyle = "#9CA3AF";
      ctx.font = "12px Roboto";
      ctx.fillText(days[i], x + 10, 190);

      ctx.fillStyle = "#C9A24D";
    });
  }
/* ================= LOAD ON SIDEBAR CLICK ================= */
document.querySelectorAll(".sidebar a").forEach(link => {
  link.addEventListener("click", function () {
    const sectionId = this.getAttribute("href").substring(1);

    showSection(sectionId);

    if (sectionId === "reservations") {
      loadReservations();
    }

    if (sectionId === "orders") {
      loadOrders();
    }
  });
});


/* =====================================================
   ADD NEW MENU ITEM (GLOBAL)
===================================================== */
async function addNewItem() {
  const name = prompt("Enter item name:");
  const category = prompt("Enter category:");
  const price = prompt("Enter price:");
  const image = prompt("Enter image URL:");

  if (!name || !category || !price) {
    alert("All fields required!");
    return;
  }

  const item = {
    name,
    category,
    price: parseInt(price),
    image: image || "",
    available: true
  };

  try {
    const response = await fetch("http://127.0.0.1:8000/menu/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item)
    });

    if (!response.ok) {
      alert("Failed to add item");
      return;
    }

    alert("Item Added Successfully ✅");
    loadMenu();

  } catch (error) {
    console.error("Add menu error:", error);
  }
}

/* =====================================================
   LOAD MENU
===================================================== */
async function loadMenu() {
  try {
    const response = await fetch("http://127.0.0.1:8000/menu/");
    const data = await response.json();
    console.log("Menu Data:", data);
  } catch (error) {
    console.error("Menu load error:", error);
  }
}

/* =====================================================
   LOAD RESERVATIONS
===================================================== */
async function loadReservations() {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    const response = await fetch(
      "http://127.0.0.1:8000/api/reservations",
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    if (!response.ok) return;

    const data = await response.json();
    const tableBody = document.getElementById("reservationTableBody");
    if (!tableBody) return;

    tableBody.innerHTML = "";

    data.forEach((res, index) => {
      const row = `
        <tr>
          <td>${index + 1}</td>
          <td>${res.name}</td>
          <td>${res.phone}</td>
          <td>${res.date}</td>
          <td>${res.time}</td>
          <td>${res.guests}</td>
          <td>${res.tableType}</td>
          <td>
            <span class="status-badge ${res.status || "pending"}">
              ${(res.status || "pending").toUpperCase()}
            </span>
          </td>
          <td>
            <button onclick="updateReservationStatus('${res.id}', 'confirmed')">✔</button>
            <button onclick="updateReservationStatus('${res.id}', 'cancelled')">✖</button>
            <button onclick="deleteReservation('${res.id}')">🗑</button>
          </td>
        </tr>
      `;
      tableBody.innerHTML += row;
    });

  } catch (error) {
    console.error("Reservation load error:", error);
  }
}

/* =====================================================
   UPDATE RESERVATION STATUS
===================================================== */
window.updateReservationStatus = async function(id, status) {
    const token = localStorage.getItem("access_token");

  await fetch(
    `http://127.0.0.1:8000/api/admin/reservation/${id}/status`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    }
  );

  loadReservations();
}

/* =====================================================
   DELETE RESERVATION
===================================================== */
window.deleteReservation = async function(id) {
    const token = localStorage.getItem("access_token");

  await fetch(
    `http://127.0.0.1:8000/api/admin/reservation/${id}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    }
  );

  loadReservations();
}

/* =====================================================
   LOAD ORDERS
===================================================== */
async function loadOrders() {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/orders");
    if (!response.ok) return;

    const orders = await response.json();
    const tableBody = document.getElementById("orders-table-body");
    if (!tableBody) return;

    tableBody.innerHTML = "";

    orders.forEach(order => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>#${order.transaction_id}</td>
        <td>${order.customer_name}</td>
        <td>${order.phone}</td>
        <td>${order.items.length}</td>
        <td>₹${order.total}</td>
        <td>${order.address}</td>
        <td>
          <select onchange="updateOrderStatus('${order.transaction_id}', this.value)">
            <option value="Pending" ${order.status === "Pending" ? "selected" : ""}>Pending</option>
            <option value="Preparing" ${order.status === "Preparing" ? "selected" : ""}>Preparing</option>
            <option value="Delivered" ${order.status === "Delivered" ? "selected" : ""}>Delivered</option>
          </select>
        </td>
      `;

      tableBody.appendChild(row);
    });

  } catch (error) {
    console.error("Order load error:", error);
  }
}

/* =====================================================
   UPDATE ORDER STATUS
===================================================== */
async function updateOrderStatus(orderId, newStatus) {
  await fetch(
    `http://127.0.0.1:8000/api/orders/${orderId}/status`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus })
    }
  );

  loadOrders();
}
/* =====================================================
   AUTO LOAD BASED ON HASH
===================================================== */

window.addEventListener("load", () => {
  const currentHash = window.location.hash.substring(1);

  if (currentHash === "reservations") {
    loadReservations();
  }

  if (currentHash === "orders") {
    loadOrders();
  }
  
})
 })
 