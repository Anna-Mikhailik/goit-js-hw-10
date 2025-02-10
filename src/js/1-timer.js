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
const modal = document.getElementById("modal");
const overlay = document.getElementById("overlay");
const openModalBtn = document.getElementById("open-modal");

let userSelectedDate = null;
let timerInterval = null;

const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        const selectedTime = selectedDates[0];
        if (selectedTime <= new Date()) {
            iziToast.error({
                title: "Помилка",
                message: "Please choose a date in the future",
                position: "topRight"
            });
            startButton.disabled = true;
        } else {
            userSelectedDate = selectedTime;
            startButton.disabled = false;
            closeModal();
        }
    }
};

flatpickr(dateTimePicker, options);

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

function addLeadingZero(value) {
    return String(value).padStart(2, "0");
}

function updateTimerDisplay({ days, hours, minutes, seconds }) {
    daysEl.textContent = addLeadingZero(days);
    hoursEl.textContent = addLeadingZero(hours);
    minutesEl.textContent = addLeadingZero(minutes);
    secondsEl.textContent = addLeadingZero(seconds);
}

function startCountdown() {
    startButton.disabled = true;
    openModalBtn.disabled = true;

    timerInterval = setInterval(() => {
        const now = new Date();
        const timeRemaining = userSelectedDate - now;

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            updateTimerDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            openModalBtn.disabled = false;
            return;
        }

        updateTimerDisplay(convertMs(timeRemaining));
    }, 1000);
}

// Відкриття модального вікна
function openModal() {
    modal.classList.add("active");
    overlay.classList.add("active");
}

// Закриття модального вікна
function closeModal() {
    modal.classList.remove("active");
    overlay.classList.remove("active");
}

// Обробник кліку на кнопку "📅 Вибрати дату"
openModalBtn.addEventListener("click", openModal);

// Закриття модального вікна при кліку поза ним
overlay.addEventListener("click", closeModal);

startButton.addEventListener("click", startCountdown);