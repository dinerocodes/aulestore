
    document.addEventListener("DOMContentLoaded", function () {
      var itemsPerPage = 6;
      var grid = document.getElementById("shop-grid");
      if (!grid) return;
      var items = Array.prototype.slice.call(grid.children); // direct column wrappers
      var pager = document.getElementById("shop-pagination");
      if (!pager) return;
      var currentPage = 1;
      var pageCount = Math.ceil(items.length / itemsPerPage);

      function showPage(page) {
        // bounds
        if (page < 1) page = 1;
        if (page > pageCount) page = pageCount;
        currentPage = page;

        // hide all
        items.forEach(function (el) { el.style.display = "none"; });
        // show slice
        var start = (page - 1) * itemsPerPage;
        var end = start + itemsPerPage;
        items.slice(start, end).forEach(function (el) { el.style.display = ""; });

        // update active button
        Array.prototype.forEach.call(pager.querySelectorAll(".page-btn"), function (btn) {
          btn.classList.toggle("active", parseInt(btn.dataset.page, 10) === currentPage);
        });

        // 👇 Scroll to top of the grid
        grid.scrollIntoView({ behavior: "smooth" });
      }

      function buildPager() {
        pager.innerHTML = "";
        for (var i = 1; i <= pageCount; i++) {
          var btn = document.createElement("button");
          btn.className = "page-btn" + (i === currentPage ? " active" : "");
          btn.textContent = i;
          btn.dataset.page = i;
          btn.addEventListener("click", function (e) {
            var pg = parseInt(e.currentTarget.dataset.page, 10);
            showPage(pg);
          });
          pager.appendChild(btn);
        }
      }

      buildPager();
      showPage(1);
    });
  </script>

  <script>
    document.addEventListener("DOMContentLoaded", function () {
      let cart = [];
      const cartCount = document.getElementById("cart-count");
      const cartItems = document.getElementById("cart-items");

      // Update dropdown
      function renderCart() {
        cartItems.innerHTML = "";
        if (cart.length === 0) {
          cartItems.innerHTML = "<li class='empty'>Your cart is empty</li>";
          cartCount.textContent = 0;
          return;
        }

        let total = 0;
        cart.forEach((item, index) => {
          total += item.price * item.quantity;

          const li = document.createElement("li");
          li.innerHTML = `
          <div class="d-flex">
            <div class="thumb">
              <img alt="${item.name}" src="${item.image}" />
            </div>
            <div class="content">
              <h6 class="title">${item.name}</h6>
              <span class="price">$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
            <div class="action">
              <input type="number" value="${item.quantity}" min="1" data-index="${index}" class="qty-input"/>
              <a class="remove" href="#" data-index="${index}">Remove</a>
            </div>
          </div>
        `;
          cartItems.appendChild(li);
        });

        // Total row
        const totalLi = document.createElement("li");
        totalLi.innerHTML = `
        <h6 class="tprice"><span>Total price: </span>$${total.toFixed(2)}</h6>
        <div class="btn-wrapper">
          <a class="btn btn-cart" href="shoping-cart.html">Go to cart</a>
        </div>
      `;
        cartItems.appendChild(totalLi);

        cartCount.textContent = cart.length;

        // Attach remove + quantity handlers
        cartItems.querySelectorAll(".remove").forEach(btn => {
          btn.addEventListener("click", function (e) {
            e.preventDefault();
            const index = parseInt(this.dataset.index);
            cart.splice(index, 1);
            renderCart();
          });
        });

        cartItems.querySelectorAll(".qty-input").forEach(input => {
          input.addEventListener("change", function () {
            const index = parseInt(this.dataset.index);
            const newQty = parseInt(this.value);
            cart[index].quantity = newQty > 0 ? newQty : 1;
            renderCart();
          });
        });
      }

      function showCartPopup(message) {
        const popup = document.getElementById("cart-popup");
        popup.textContent = message;
        popup.classList.add("show");

        setTimeout(() => {
          popup.classList.remove("show");
        }, 2000);
      }

      // Example test button
      document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", function () {
          const name = this.dataset.name || "Item"; // fallback if no data-name
          showCartPopup(name + " successfully added to cart!");
        });
      });

      // Handle Add to Cart clicks
      document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", function () {
          const name = this.dataset.name;
          const price = parseFloat(this.dataset.price);
          const image = this.dataset.image;

          // Check if already in cart
          const existing = cart.find(item => item.name === name);
          if (existing) {
            existing.quantity += 1;
          } else {
            cart.push({ name, price, image, quantity: 1 });
          }

          renderCart();
        });
      });

      renderCart(); // initial load
    });