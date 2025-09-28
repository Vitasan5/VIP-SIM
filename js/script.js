// ЕДИНЫЙ ФАЙЛ: js/script.js
// Все функции сайта — в одном месте

document.addEventListener("DOMContentLoaded", function () {
  // === ГАМБУРГЕР-МЕНЮ (работает на всех страницах) ===
  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", function () {
      menuToggle.classList.toggle("active");
      mobileMenu.classList.toggle("active");
    });
  }

  // === СЛАЙДЕР АКСЕССУАРОВ (кнопки + свайп) ===
  const track = document.getElementById("sliderTrack");
  if (track) {
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const cardWidth = 180 + 15; // ширина карточки + gap

    nextBtn?.addEventListener("click", () => {
      track.scrollLeft += cardWidth;
    });

    prevBtn?.addEventListener("click", () => {
      track.scrollLeft -= cardWidth;
    });

    // Свайп на смартфонах
    let startX = 0;
    let isSwiping = false;

    track.addEventListener(
      "touchstart",
      (e) => {
        startX = e.touches[0].clientX;
        isSwiping = true;
      },
      { passive: true }
    );

    track.addEventListener(
      "touchmove",
      (e) => {
        if (!isSwiping) return;
        const x = e.touches[0].clientX;
        const diff = startX - x;

        if (Math.abs(diff) > 20) {
          track.scrollLeft += diff;
          startX = x;
        }
      },
      { passive: true }
    );

    track.addEventListener("touchend", () => {
      isSwiping = false;
    });
  }

  // === КНОПКА "НАВЕРХ" ===
  const scrollToTopBtn = document.getElementById("scrollToTop");
  if (scrollToTopBtn) {
    window.addEventListener("scroll", () => {
      scrollToTopBtn.classList.toggle("show", window.pageYOffset > 300);
    });

    scrollToTopBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /*// === АВТОПРОКРУТКА СПИСКА "РАСПРОДАЖА" ===
  const saleList = document.getElementById("sale-list");
  if (saleList) {
    const items = saleList.querySelectorAll(".sale-item");
    if (items.length > 0) {
      const itemHeight = items[0].offsetHeight;
      const totalHeight = itemHeight * items.length;

      saleList.innerHTML += saleList.innerHTML;

      let position = 0;
      const speed = 0.5;
      let animationId;
      let isHovered = false;

      function scrollList() {
        if (isHovered) return;
        position -= speed;
        if (position <= -totalHeight) position = 0;
        saleList.style.transform = `translateY(${position}px)`;
        animationId = requestAnimationFrame(scrollList);
      }

      animationId = requestAnimationFrame(scrollList);

      saleList.addEventListener("mouseenter", () => (isHovered = true));
      saleList.addEventListener("mouseleave", () => {
        isHovered = false;
        animationId = requestAnimationFrame(scrollList);
      });
    }
  }*/

  // === ОБРАБОТЧИК КНОПКИ "БРОНИРОВАТЬ" ===
  document.querySelectorAll(".reserve-btn").forEach((button) => {
    button.addEventListener("click", function () {
      // Получаем номер из <span> в родительской карточке
      const number = this.closest(".sale-item")
        ?.querySelector("span")
        ?.textContent.trim();

      if (!number) {
        console.error("Не удалось получить номер");
        return;
      }

      // Упрощённое сообщение
      const message = `Бронирую номер: ${number}`;

      // Кодируем корректно
      const encodedMessage = encodeURIComponent(message);

      // Формируем ссылку
      const url = `https://t.me/vipsimka82?text=${encodedMessage}`;

      // Открываем в новой вкладке
      window.open(url, "_blank", "noopener");
    });
  });
});

// === УНИВЕРСАЛЬНЫЙ СЛАЙДЕР (Волна, Вин) ===
function moveSlide(sliderId, direction) {
  const slider = document.getElementById(sliderId + "-slider");
  if (!slider) return;
  const cardWidth = 250;
  slider.scrollLeft += direction * cardWidth;
}

// === ФУНКЦИЯ "ПОДЕЛИТЬСЯ" ===
function sharePage() {
  if (navigator.share) {
    navigator.share({
      title: "VIP-SIMKA",
      text: "Посмотри, какой классный сайт!",
      url: "https://vip-sim.ru",
    });
  } else {
    alert("Функция обмена не поддерживается на этом устройстве.");
  }
}

function sendRequest(messenger) {
  const model =
    document.getElementById("modal-title")?.textContent || "устройство";

  const message = encodeURIComponent(
    `Здравствуйте! Интересует:\n` +
      `- Модель: ${model}\n` +
      `- Объём памяти: ?\n` +
      `- Цвет: ?\n\n` +
      `Подскажите стоимость и наличие?`
  );

  let url = "";

  if (messenger === "telegram") {
    url = `https://t.me/vipsimka82?text=${message}`;
  } else if (messenger === "whatsapp") {
    url = `https://wa.me/79915556663?text=${message}`;
  } else if (messenger === "vk") {
    url = `https://vk.com/vip.simki?w=write&text=${message}`;
  }

  window.open(url, "_blank");
}

// === ФУНКЦИЯ ДЛЯ ВЫПАДАЮЩЕГО МЕНЮ ===
function toggleDropdown(event) {
  event.stopPropagation();
  const dropdown = event.target.closest(".request-dropdown");
  if (dropdown) {
    dropdown.classList.toggle("active");
  }
}

// Закрытие меню при клике вне его
document.addEventListener("click", function (e) {
  const dropdowns = document.querySelectorAll(".request-dropdown");
  dropdowns.forEach((dropdown) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove("active");
    }
  });
});
