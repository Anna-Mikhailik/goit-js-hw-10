import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

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

let SelectedDate = null;
let downInterval = null;

const startbtn = document.querySelector('[data-start]');
const inputDatetime = document.querySelector('input#datetime-picker');
const timerFields = {
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    SelectedDate = selectedDates[0];
    if (SelectedDate <= new Date()) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
        timeout: 3000,
      });
      startbtn.disabled = true;
    } else {
      iziToast.success({
        title: 'Success',
        message: 'You have selected a valid date!',
        position: 'topRight',
      });
      startbtn.disabled = false;
    }
  },
};

flatpickr(inputDatetime, options);

function updateTimer() {
  const timeLeft = SelectedDate - new Date();
  if (timeLeft <= 0) {
    clearInterval(downInterval);
    startbtn.disabled = false;
    inputDatetime.disabled = false;
    return;
  }

  const { days, hours, minutes, seconds } = convertMs(timeLeft);

  timerFields.days.textContent = addLeadingZero(days);
  timerFields.hours.textContent = addLeadingZero(hours);
  timerFields.minutes.textContent = addLeadingZero(minutes);
  timerFields.seconds.textContent = addLeadingZero(seconds);
}

function startTimer() {
  startbtn.disabled = true;
  inputDatetime.disabled = true;

  downInterval = setInterval(updateTimer, 1000);
  updateTimer();
}

startbtn.addEventListener('click', startTimer);
