let weeklyChart = null;
console.log("ADMIN SCRIPT FIXED");

/* ================= DOM READY ================= */
document.addEventListener("DOMContentLoaded", function () {


  /* ================= LOAD MENU ================= */
  loadMenu();

});


/* ================= MENU ================= */
async function loadMenu() {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/menu");
    const data = await res.json();

    document.querySelectorAll(".menu-card").forEach(card => {

      const name = card.querySelector("h3").textContent.trim();
      const item = data.find(d => d.name === name);

      if (!item) return;

      card.querySelector(".menu-price").textContent = "₹" + item.price;

      const toggle = card.querySelector(".availability-toggle");
      const status = card.querySelector(".availability-status");

      if (item.available) {
        if (toggle) toggle.checked = true;
        status.textContent = "Available";
      } else {
        if (toggle) toggle.checked = false;
        status.textContent = "Out of Stock";
      }

      card.dataset.id = item._id;

    });

  } catch (err) {
    console.error(err);
  }
}


/* ================= RESERVATIONS ================= */
async function loadReservations() {
  const token = localStorage.getItem("access_token");

  const res = await fetch("http://127.0.0.1:8000/api/reservations", {
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await res.json();
  const table = document.getElementById("reservationTableBody");
  table.innerHTML = "";

  data.forEach((r, i) => {
    table.innerHTML += `
      <tr>
        <td>${i+1}</td>
        <td>${r.name}</td>
        <td>${r.phone}</td>
        <td>${r.date}</td>
        <td>${r.time}</td>
        <td>${r.guests}</td>
        <td>${r.tableType}</td>
<td>
  <div style="display:flex; align-items:center; justify-content:space-between; gap:10px;">

    <!-- STATUS TEXT -->
    <span style="
      padding:4px 10px;
      border-radius:12px;
      font-size:12px;
      font-weight:600;
      background:${r.status === 'confirmed' ? '#22c55e' :
                  r.status === 'pending' ? '#facc15' : '#ef4444'};
      color:${r.status === 'pending' ? '#000' : '#fff'};
    ">
      ${r.status}
    </span>

    <!-- BUTTONS -->
    <div style="display:flex; gap:6px;">
      <button onclick="updateReservationStatus('${r.id}','confirmed')"
        style="background:#22c55e;color:white;border:none;padding:4px 8px;border-radius:6px;">
        Confirm
      </button>

      <button onclick="updateReservationStatus('${r.id}','cancelled')"
        style="background:#ef4444;color:white;border:none;padding:4px 8px;border-radius:6px;">
        Deny
      </button>
    </div>

  </div>
</td>

    `;
  });
}


/* ================= ORDERS ================= */

async function loadOrders() {
  const res = await fetch("http://127.0.0.1:8000/api/orders");
  const data = await res.json();

  const table = document.getElementById("orders-table-body");
  table.innerHTML = "";

  data.forEach(o => {
    console.log(o);
    table.innerHTML += `
      <tr>
        <td>#${o.transaction_id}</td>
        <td>${o.customer_name}</td>
        <td>${o.phone}</td>
        <td>${o.items.length}</td>
        <td>₹${String(o.total).replace("₹","")}</td>
        <td>${o.address}</td>
       <td>
  <div style="display:flex; justify-content:space-between; align-items:center;">

    <span style="
      padding:4px 10px;
      border-radius:12px;
      background:#facc15;
      color:#000;
      font-size:12px;
    ">
      ${o.status || "pending"}
    </span>

    <select onchange="updateStatus('${o.transaction_id}', this.value, this)">
      <option value="pending" ${(o.status || "pending") === "pending" ? "selected" : ""}>Pending</option>
      <option value="preparing" ${(o.status || "pending") === "preparing" ? "selected" : ""}>Preparing</option>
      <option value="delivered" ${(o.status || "pending") === "delivered" ? "selected" : ""}>Delivered</option>
    </select>

  </div>
</td>
    `;
  });
}


/* ================= AUTO LOAD ================= */
document.addEventListener("DOMContentLoaded", () => {
  loadReservations();
  loadOrders();
});


/* ================= ADD THIS HERE ================= */
window.updateReservationStatus = async function(id, status) {
  const token = localStorage.getItem("access_token");

  await fetch(`http://127.0.0.1:8000/api/admin/reservation/${id}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ status })
  });

  loadReservations();
};
window.updateOrderStatus = function(id, status) {
  console.log("Order:", id, "New Status:", status);
};
window.updateOrderStatus = function(id, selectElement) {

  const newStatus = selectElement.value;

  // 🔥 find the badge in same row
  const badge = selectElement.parentElement.querySelector("span");

  // ✅ update text
  badge.textContent = newStatus;

  // ✅ update color
  if (newStatus === "Pending") {
    badge.style.background = "#facc15";
    badge.style.color = "#000";
  } else if (newStatus === "Preparing") {
    badge.style.background = "#3b82f6";
    badge.style.color = "#fff";
  } else if (newStatus === "Delivered") {
    badge.style.background = "#22c55e";
    badge.style.color = "#fff";
  }

  console.log("Updated:", id, newStatus);
};
function scrollToSection(id){
  const section = document.getElementById(id);
  if(section){
    section.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }
}
async function updateStatus(orderId, newStatus, selectElement) {
    try {
        await fetch(`http://127.0.0.1:8000/api/orders/${orderId}/status?status=${newStatus}`, {
            method: "PUT"
        });

        // 🔥 SAFE UI UPDATE
        if (selectElement) {
            const badge = selectElement.parentElement.querySelector("span");

            if (badge) {
                badge.textContent = newStatus;

                if (newStatus === "pending") {
                    badge.style.background = "#facc15";
                    badge.style.color = "#000";
                } 
                else if (newStatus === "preparing") {
                    badge.style.background = "#3b82f6";
                    badge.style.color = "#fff";
                } 
                else if (newStatus === "delivered") {
                    badge.style.background = "#22c55e";
                    badge.style.color = "#fff";
                }
            }
        }

    } catch (err) {
        console.error("Error updating status:", err);
    }
}
async function updateMenuItem(name, newPrice) {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/menu/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: name.trim(),   // ✅ important
        price: Number(newPrice)
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(data);
      alert(data.detail || "Update failed");
      return;
    }

    alert("✅ Updated in DB!");

  } catch (err) {
    console.error(err);
    alert("Server error");
  }
}

document.querySelectorAll(".edit").forEach(btn => {
  btn.addEventListener("click", () => {

    const card = btn.closest(".menu-card");

    const name = card.querySelector("h3").textContent.trim();
    const priceEl = card.querySelector(".menu-price");

    const currentPrice = priceEl.textContent.replace("₹", "");

    const newPrice = prompt("Enter new price:", currentPrice);

    if (!newPrice) return;

    updateMenuItem(name, newPrice);

    // UI update
    priceEl.textContent = "₹" + newPrice;
  });
});