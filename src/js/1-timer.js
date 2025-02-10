import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const dateTimePicker = document.querySelector("#datetime-picker");
const startButton = document.querySelector("[data-start]");
const daysEl = document.querySelector("[data-days]");
const hoursEl = document.querySelector("[data-hours]");
const minutesEl = document.querySelector("[data-minutes]");
const secondsEl = document.querySelector("[data-seconds]");
const openModalBtn = document.getElementById("open-modal");

let timerInterval = null;

// Дата за замовчуванням: 21 липня 2017 року, 17:57
const defaultDate = new Date("2017-07-21T17:57:00");

const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: defaultDate,
    minuteIncrement: 1,
    onClose(selectedDates) {
        const selectedTime = selectedDates[0];
        startCountdown(selectedTime);
    }
};

// Ініціалізація flatpickr
const calendar = flatpickr(dateTimePicker, options);

// Відкриття календаря при натисканні кнопки 📅 Вибрати дату
openModalBtn.addEventListener("click", () => {
    dateTimePicker.click(); // Відкриває flatpickr
});

// Функція для перетворення мс у дні, години, хвилини, секунди
function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
}

// Додає 0 перед цифрою, якщо вона < 10
function addLeadingZero(value) {
    return String(value).padStart(2, "0");
}

// Оновлення відображення таймера
function updateTimerDisplay({ days, hours, minutes, seconds }) {
    daysEl.textContent = addLeadingZero(days);
    hoursEl.textContent = addLeadingZero(hours);
    minutesEl.textContent = addLeadingZero(minutes);
    secondsEl.textContent = addLeadingZero(seconds);
}

// Запуск таймера
function startCountdown(targetDate) {
    clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        const now = new Date();
        const timeRemaining = now - targetDate; // Використовуємо минулий час для відліку

        updateTimerDisplay(convertMs(timeRemaining));
    }, 1000);
}

// Автоматичний запуск таймера з моменту завантаження сторінки
startCountdown(defaultDate);