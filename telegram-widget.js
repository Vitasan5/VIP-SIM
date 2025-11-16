// telegram-widget.js
(function () {
  // Ждем полной загрузки DOM
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTelegramWidget);
  } else {
    initTelegramWidget();
  }

  function initTelegramWidget() {
    // Создаем стили ТОЛЬКО для виджета
    const styles = `
        .floating-telegram-btn {
            position: fixed;
            left: 20px;
            bottom: 80px;
            width: 60px;
            height: 60px;
            background: #0088cc;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            cursor: pointer;
            z-index: 10000;
            transition: all 0.3s ease;
            animation: float 3s ease-in-out infinite;
        }

        .floating-telegram-btn:hover {
            background: #006699;
            transform: scale(1.1);
            animation: none;
        }

        .floating-telegram-btn svg {
            width: 30px;
            height: 30px;
            fill: white;
            transition: all 0.3s ease;
        }

        .floating-telegram-btn:hover svg {
            transform: scale(1.2);
        }

        /* Плавная анимация полета */
        @keyframes float {
            0%, 100% {
                transform: translateY(0) rotate(0deg);
            }
            25% {
                transform: translateY(-10px) rotate(-5deg);
            }
            50% {
                transform: translateY(-5px) rotate(0deg);
            }
            75% {
                transform: translateY(-8px) rotate(5deg);
            }
        }

        .telegram-popup {
            position: fixed;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            padding: 25px;
            text-align: center;
            z-index: 10001;
            transition: all 0.5s ease-in-out;
            max-width: 350px;
            width: 90%;
            display: none;
        }

        .telegram-popup.centered {
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }

        .telegram-popup-close {
            position: absolute;
            top: 10px;
            right: 15px;
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: #666;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .telegram-popup-close:hover {
            background: #f0f0f0;
            color: #000;
        }

        .telegram-popup-icon {
            width: 60px;
            height: 60px;
            margin: 0 auto 15px;
            background: #0088cc;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .telegram-popup-icon svg {
            width: 30px;
            height: 30px;
            fill: white;
        }

        .telegram-popup-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
            color: #333;
        }

        .telegram-popup-text {
            font-size: 14px;
            color: #666;
            margin-bottom: 20px;
            line-height: 1.4;
        }

        .telegram-popup-button {
            display: inline-block;
            background: #0088cc;
            color: white;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 6px;
            font-weight: bold;
            transition: all 0.3s;
            border: none;
            cursor: pointer;
            font-size: 14px;
        }

        .telegram-popup-button:hover {
            background: #006699;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }

        @keyframes telegramFadeIn {
            from { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }

        .telegram-popup.centered {
            animation: telegramFadeIn 0.5s ease-out;
        }

        @media (max-width: 768px) {
            .floating-telegram-btn {
                left: 15px;
                bottom: 70px;
                width: 55px;
                height: 55px;
            }
            .floating-telegram-btn svg {
                width: 25px;
                height: 25px;
            }
        }

        @media (max-width: 480px) {
            .floating-telegram-btn {
                left: 10px;
                bottom: 60px;
                width: 50px;
                height: 50px;
            }
            .floating-telegram-btn svg {
                width: 22px;
                height: 22px;
            }
            .telegram-popup {
                padding: 20px;
            }
        }

        .telegram-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 10000;
            display: none;
        }
        `;

    // Добавляем стили в head
    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // Создаем HTML структуру
    const widgetHTML = `
        <div class="floating-telegram-btn" id="telegramFloatingButton">
            <svg viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.14.14-.26.26-.534.26l.213-3.053 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.136-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
            </svg>
        </div>

        <div class="telegram-overlay" id="telegramOverlay"></div>

        <div class="telegram-popup centered" id="telegramPopup">
            <button class="telegram-popup-close" id="telegramPopupClose">×</button>
            <div class="telegram-popup-icon">
                <svg viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.14.14-.26.26-.534.26l.213-3.053 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.136-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                </svg>
            </div>
            <h3 class="telegram-popup-title">Подпишитесь на наш Telegram</h3>
            <p class="telegram-popup-text">Будьте в курсе всех новостей и получайте эксклюзивный контент!</p>
            <a href="https://t.me/simki_vip978" target="_blank" class="telegram-popup-button">Подписаться на канал</a>
        </div>
        `;

    // Добавляем HTML в body
    document.body.insertAdjacentHTML("beforeend", widgetHTML);

    // Функции для управления попапом
    function showPopup() {
      const popup = document.getElementById("telegramPopup");
      const overlay = document.getElementById("telegramOverlay");
      const button = document.getElementById("telegramFloatingButton");

      if (popup && overlay && button) {
        popup.style.display = "block";
        overlay.style.display = "block";
        button.style.animation = "none";
      }
    }

    function closePopup() {
      const popup = document.getElementById("telegramPopup");
      const overlay = document.getElementById("telegramOverlay");
      const button = document.getElementById("telegramFloatingButton");

      if (popup && overlay && button) {
        popup.style.display = "none";
        overlay.style.display = "none";
        button.style.animation = "float 3s ease-in-out infinite";
      }
    }

    // Назначаем обработчики событий
    const button = document.getElementById("telegramFloatingButton");
    const overlay = document.getElementById("telegramOverlay");
    const closeBtn = document.getElementById("telegramPopupClose");
    const popup = document.getElementById("telegramPopup");

    if (button) button.addEventListener("click", showPopup);
    if (overlay) overlay.addEventListener("click", closePopup);
    if (closeBtn) closeBtn.addEventListener("click", closePopup);

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closePopup();
      }
    });

    if (popup) {
      popup.addEventListener("click", function (event) {
        event.stopPropagation();
      });
    }
  }
})();
