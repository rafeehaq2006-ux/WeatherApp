import "./styles.css";
const city = document.querySelector(".city-name");
const date = document.querySelector(".weather-date");
const condition = document.querySelector(".condition-badge");
const currentTemp = document.querySelector(".temperature");
const weatherIcon = document.querySelector(".weather-icon");
let unit = "°C";
const sunrise = document.querySelector("#sunrise");
const sunset = document.querySelector("#sunset");
const high = document.querySelector("#high");
const low = document.querySelector("#low");
const hourlyScroll = document.querySelector(".hourly-scroll");
const searchForm = document.querySelector("#search");
const cityInput = document.querySelector("#city-input");
const errorMessage = document.querySelector("#error-message");
const forecastContainer = document.querySelector(".forecast-grid");
const unitToggle = document.querySelector("#unit-toggle");

async function recievedata(location) {
    const cityName = location || "London";
    let api = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(cityName)}?key=FRVEAEV7NR7LPJLW6PMHTLTEN`;
    try {
        const response = await fetch(api);
        const data = await response.json();
        const now = new Date(data.currentConditions.datetimeEpoch * 1000);
        let currentTime = now.getHours() + data.tzoffset;
        
        return {
            address: data.resolvedAddress,
            temp: data.currentConditions.temp,
            tempmax: data.days[0].tempmax,
            tempmin: data.days[0].tempmin,
            sunrise: data.days[0].sunrise,
            sunset:data.days[0].sunset,
            conditions: data.currentConditions.conditions,
            hours: data.days[0].hours,
            icon: data.currentConditions.icon,
            currentTime: currentTime,
            days: data.days.slice(1, 8),
        };
    } catch (error) {
        return error;
    }
    
}
function capitalize(str) {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
async function updateData(location = "London") {
    try {
        const data = await recievedata(location);
        if (!data || data instanceof Error) {
            errorMessage.textContent = "Unable to fetch weather data. Please try again later.";
            throw new Error("Unable to fetch weather data.");
        }else{
            errorMessage.textContent = "";
        
            const now = new Date();
            if (city) {
                city.textContent = capitalize(data.address) || "London";
            }
            date.textContent = now.toLocaleDateString();
            condition.textContent = data.conditions;
            sunrise.textContent = data.sunrise;
            sunset.textContent = data.sunset;
            let maxTemp = data.tempmax;
            let minTemp = data.tempmin;        
            let temperature = data.temp;
            if (unit === "°F") {
                currentTemp.textContent = `${temperature}${unit}`;
                high.textContent = `${maxTemp}${unit}`;
                low.textContent = `${minTemp}${unit}`;
            } else {
                temperature = ((temperature - 32) * (5 / 9)).toFixed(1);
                currentTemp.textContent = `${temperature}${unit}`;
                maxTemp = ((maxTemp - 32) * (5 / 9)).toFixed(1);
                minTemp = ((minTemp - 32) * (5 / 9)).toFixed(1);
                high.textContent = `${maxTemp}${unit}`;
                low.textContent = `${minTemp}${unit}`;
            }

            hourlyScroll.replaceChildren();
            let currenthour = data.currentTime;
            let nextday = false;
            for (let i=0;i<24;i++){
                
                const hourSlot = document.createElement("div");
                hourSlot.classList.add("hour-slot");
                const hourTime = document.createElement("div");
                hourTime.classList.add("time");
                const hourTemp = document.createElement("div");
                hourTemp.classList.add("temperature");
                const hourCondition = document.createElement("div");
                hourCondition.classList.add("condition");

                currenthour = (currenthour + 1) % 24;
                if (currenthour === 0 && i !== 0) {
                    nextday = true;
                }
                if (nextday){
                    hourTime.textContent = data.days[1].hours[currenthour].datetime;
                    let temp = data.days[1].hours[currenthour].temp;
                    if (unit === "°F") {
                        hourTemp.textContent = `${temp}${unit}`;
                    } else {
                        temp = ((temp - 32) * (5 / 9)).toFixed(1);
                        hourTemp.textContent = `${temp}${unit}`;
                    }
                    hourCondition.textContent = data.days[1].hours[currenthour].conditions;
                }
                else{
                    hourTime.textContent = data.days[0].hours[currenthour].datetime;
                    let temp = data.days[0].hours[currenthour].temp;
                    if (unit === "°F") {
                        hourTemp.textContent = `${temp}${unit}`;
                    } else {
                        temp = ((temp - 32) * (5 / 9)).toFixed(1);
                        hourTemp.textContent = `${temp}${unit}`;
                    }
                    hourCondition.textContent = data.days[0].hours[currenthour].conditions; 
                }
                hourSlot.appendChild(hourTime);
                hourSlot.appendChild(hourTemp);
                hourSlot.appendChild(hourCondition);
                hourlyScroll.appendChild(hourSlot);
            }

            let iconMarkup = "";
            switch (data.icon) {
                case "snow":
                    iconMarkup = `
                        <svg viewBox="0 0 64 64" aria-hidden="true" role="img">
                            <path d="M24 18c0-6 5-10 10-10 4 0 8 2 9 6 1-1 2-2 4-2 3 0 5 2 5 5 0 1-1 3-2 4h-2c2 1 3 3 3 5 0 3-3 6-6 6H24c-4 0-7-3-7-7 0-3 2-6 5-7z" fill="#cfe8ff"/>
                            <path d="M22 34l-3 6m9-6l-2 7m10-7l-1 6m8-6l-3 6" stroke="#8ec5ff" stroke-width="2" stroke-linecap="round"/>
                        </svg>`;
                    break;
                case "rain":
                    iconMarkup = `
                        <svg viewBox="0 0 64 64" aria-hidden="true" role="img">
                            <path d="M22 20a10 10 0 1 1 20 0c0 4-3 7-6 8h-8c-4 0-6-3-6-7z" fill="#cfe8ff"/>
                            <path d="M18 34h4l-2 10h-4zM30 34h4l-2 10h-4zM42 34h4l-2 10h-4z" fill="#5aa5ff"/>
                        </svg>`;
                    break;
                case "fog":
                    iconMarkup = `
                        <svg viewBox="0 0 64 64" aria-hidden="true" role="img">
                            <path d="M20 20a10 10 0 1 1 20 0c0 4-3 7-6 8h-8c-4 0-6-3-6-7z" fill="#dce7f2"/>
                            <path d="M16 34h32M16 40h24M16 46h28" stroke="#8ba3b8" stroke-width="3" stroke-linecap="round"/>
                        </svg>`;
                    break;
                case "wind":
                    iconMarkup = `
                        <svg viewBox="0 0 64 64" aria-hidden="true" role="img">
                            <path d="M18 24h20" stroke="#8ec5ff" stroke-width="4" stroke-linecap="round"/>
                            <path d="M16 34h24" stroke="#6fa8dc" stroke-width="4" stroke-linecap="round"/>
                            <path d="M22 44h14" stroke="#4b83c3" stroke-width="4" stroke-linecap="round"/>
                            <path d="M30 24l8-8m-8 8l8 8" stroke="#4b83c3" stroke-width="4" stroke-linecap="round"/>
                        </svg>`;
                    break;
                case "cloudy":
                    iconMarkup = `
                        <svg viewBox="0 0 64 64" aria-hidden="true" role="img">
                            <path d="M20 24a10 10 0 1 1 20 0c0 4-3 7-6 8h-8c-4 0-6-3-6-7z" fill="#cfe8ff"/>
                            <path d="M18 34c0-6 5-10 10-10h8c5 0 9 4 9 9 0 4-3 8-7 8H22c-3 0-4-2-4-7z" fill="#9eb8c9"/>
                        </svg>`;
                    break;
                case "partly-cloudy-day":
                case "partly-cloudy-night":
                    iconMarkup = `
                        <svg viewBox="0 0 64 64" aria-hidden="true" role="img">
                            <circle cx="26" cy="26" r="10" fill="#ffd166"/>
                            <path d="M20 42c0-7 6-12 12-12h6c6 0 10 4 10 10 0 5-4 8-9 8H25c-3 0-5-2-5-6z" fill="#9eb8c9"/>
                        </svg>`;
                    break;
                case "clear-day":
                    iconMarkup = `
                        <svg viewBox="0 0 64 64" aria-hidden="true" role="img">
                            <circle cx="32" cy="32" r="12" fill="#ffd166"/>
                            <path d="M32 10v8M32 46v8M10 32h8M46 32h8M16 16l6 6M42 42l6 6M16 48l6-6M42 22l6-6" stroke="#ffd166" stroke-width="3" stroke-linecap="round"/>
                        </svg>`;
                    break;
                case "clear-night":
                    iconMarkup = `
                        <svg viewBox="0 0 64 64" aria-hidden="true" role="img">
                            <path d="M42 40a18 18 0 1 1 7-33 14 14 0 1 0 6 26 18 18 0 0 1-13 7z" fill="#f3d67f"/>
                        </svg>`;
                    break;
                default:
                    iconMarkup = `
                        <svg viewBox="0 0 64 64" aria-hidden="true" role="img">
                            <circle cx="32" cy="32" r="12" fill="#ffd166"/>
                        </svg>`;
            }

            if (weatherIcon) {
                weatherIcon.innerHTML = "";
                weatherIcon.insertAdjacentHTML("beforeend", iconMarkup);
            }

            forecastContainer.replaceChildren();
            for (let i=0;i<data.days.length;i++){
                const dayCard = document.createElement("div");
                dayCard.classList.add("forecast-day");
                const dayName = document.createElement("div");
                dayName.classList.add("forecast-date");
                const dateTemp = new Date(data.days[i].datetimeEpoch * 1000);
                dayName.textContent = dateTemp.toLocaleDateString('en-GB', { weekday: 'long' });
                const dayMaxTemp = document.createElement("div");
                dayMaxTemp.classList.add("forecast-maxtemp");
                const dayMinTemp = document.createElement("div");
                dayMinTemp.classList.add("forecast-mintemp");
                const dayTemp = document.createElement("div");
                dayTemp.classList.add("forecast-temp");
                const dayCondition = document.createElement("div");
                dayCondition.classList.add("forecast-condition");
                dayCondition.textContent = data.days[i].conditions;
                let DayTempVal = data.days[i].temp;
                let maxTemp = data.days[i].tempmax;
                let minTemp = data.days[i].tempmin;
                if (unit === "°F") {
                    dayTemp.textContent = `${DayTempVal}${unit}`;
                    dayMaxTemp.textContent = `High: ${maxTemp}${unit}`;
                    dayMinTemp.textContent = `Low: ${minTemp}${unit}`;
                } else {
                    DayTempVal = ((DayTempVal - 32) * (5 / 9)).toFixed(1);
                    maxTemp = ((maxTemp - 32) * (5 / 9)).toFixed(1);
                    minTemp = ((minTemp - 32) * (5 / 9)).toFixed(1);
                    dayTemp.textContent = `${DayTempVal}${unit}`;
                    dayMaxTemp.textContent = `High: ${maxTemp}${unit}`;
                    dayMinTemp.textContent = `Low: ${minTemp}${unit}`;
                }
                forecastContainer.appendChild(dayCard);
                dayCard.appendChild(dayName);
                dayCard.appendChild(dayMaxTemp);
                dayCard.appendChild(dayTemp);
                dayCard.appendChild(dayMinTemp);
                dayCard.appendChild(dayCondition);
            }
        }
    } catch (error) {
        console.error(error);  
    }
}

function enableHorizontalWheelScroll(container) {
    if (!container) return;

    container.addEventListener(
        "wheel",
        (event) => {
            const hasHorizontalOverflow = container.scrollWidth > container.clientWidth;
            if (!hasHorizontalOverflow) return;

            const delta = event.deltaY || event.deltaX;
            if (delta !== 0) {
                event.preventDefault();
                event.stopPropagation();
                container.scrollLeft += delta;
            }
        },
        { passive: false }
    );
}


function handleSearchSubmit(event) {
    event.preventDefault();
    const location = cityInput.value.trim();
    if (!location) return;
    updateData(location);
}

function toggleUnit() {
    unit = unit === "°C" ? "°F" : "°C";
    unitToggle.textContent = unit === "°C" ? "Switch to °F" : "Switch to °C";
    updateData(cityInput.value.trim() || "London");
}

if (unitToggle) {
    unitToggle.addEventListener("click", toggleUnit);
}

if (searchForm) {
    searchForm.addEventListener("submit", handleSearchSubmit);
}

updateData();