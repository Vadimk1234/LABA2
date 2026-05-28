const menuButton = document.querySelector(".burger");
const mainNav = document.querySelector(".main-nav");

if (menuButton && mainNav) {
  menuButton.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  mainNav.addEventListener("click", (event) => {
    if (event.target.matches("a")) {
      mainNav.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
    }
  });
}

const defaultProducts = [
  {
    title: "Унікальні цукерки з малюнком",
    description: "Фруктові карамелі з індивідуальним дизайном.",
  },
  {
    title: "Стандартний асортимент",
    description: "Готові набори для щоденного настрою.",
  },
  {
    title: "Крафтова майстерня",
    description: "Солодощі ручної роботи для свят.",
  },
];

const storage = {
  get(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
};

const subscribeForm = document.querySelector("#subscribeForm");
const subscribeMessage = document.querySelector("#subscribeMessage");

if (subscribeForm) {
  subscribeForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(subscribeForm);
    const subscriber = {
      name: formData.get("name").trim(),
      email: formData.get("email").trim().toLowerCase(),
      date: new Date().toLocaleDateString("uk-UA"),
    };

    const subscribers = storage.get("lollypopSubscribers", []);
    const alreadyExists = subscribers.some((item) => item.email === subscriber.email);

    if (alreadyExists) {
      subscribeMessage.textContent = "Цей email уже є у списку підписників.";
      return;
    }

    subscribers.push(subscriber);
    storage.set("lollypopSubscribers", subscribers);
    subscribeForm.reset();
    subscribeMessage.textContent = "Дякуємо! Підписку збережено.";
  });
}

const loginView = document.querySelector("#loginView");
const dashboardView = document.querySelector("#dashboardView");
const loginForm = document.querySelector("#loginForm");
const loginMessage = document.querySelector("#loginMessage");
const logoutButton = document.querySelector("#logoutButton");
const subscriberRows = document.querySelector("#subscriberRows");
const subscriberCount = document.querySelector("#subscriberCount");
const productCount = document.querySelector("#productCount");
const productForm = document.querySelector("#productForm");
const adminProductList = document.querySelector("#adminProductList");

function isAdminLoggedIn() {
  return sessionStorage.getItem("lollypopAdminLoggedIn") === "true";
}

function setAdminVisible(isVisible) {
  if (!loginView || !dashboardView) return;
  loginView.classList.toggle("hidden", isVisible);
  dashboardView.classList.toggle("hidden", !isVisible);
  if (isVisible) renderDashboard();
}

function renderDashboard() {
  const subscribers = storage.get("lollypopSubscribers", []);
  const products = storage.get("lollypopProducts", defaultProducts);

  if (subscriberCount) subscriberCount.textContent = subscribers.length;
  if (productCount) productCount.textContent = products.length;

  if (subscriberRows) {
    subscriberRows.innerHTML = subscribers.length
      ? subscribers
          .map(
            (subscriber) => `
              <tr>
                <td>${escapeHtml(subscriber.name)}</td>
                <td>${escapeHtml(subscriber.email)}</td>
                <td>${escapeHtml(subscriber.date)}</td>
              </tr>
            `,
          )
          .join("")
      : '<tr><td colspan="3">Поки що немає підписників.</td></tr>';
  }

  if (adminProductList) {
    adminProductList.innerHTML = products
      .map(
        (product) => `
          <li>
            <strong>${escapeHtml(product.title)}</strong>
            <span>${escapeHtml(product.description)}</span>
          </li>
        `,
      )
      .join("");
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

if (loginForm) {
  setAdminVisible(isAdminLoggedIn());

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(loginForm);
    const username = formData.get("username").trim();
    const password = formData.get("password").trim();

    if (username === "admin" && password === "admin2026") {
      sessionStorage.setItem("lollypopAdminLoggedIn", "true");
      loginForm.reset();
      loginMessage.textContent = "";
      setAdminVisible(true);
    } else {
      loginMessage.textContent = "Невірний логін або пароль.";
    }
  });
}

if (logoutButton) {
  logoutButton.addEventListener("click", () => {
    sessionStorage.removeItem("lollypopAdminLoggedIn");
    setAdminVisible(false);
  });
}

if (productForm) {
  productForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(productForm);
    const products = storage.get("lollypopProducts", defaultProducts);

    products.push({
      title: formData.get("title").trim(),
      description: formData.get("description").trim(),
    });

    storage.set("lollypopProducts", products);
    productForm.reset();
    renderDashboard();
  });
}
