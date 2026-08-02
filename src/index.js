import "./styles.css";
const city = document.querySelector(".city-name");
const date = document.querySelector(".weather-date");
const condition = document.querySelector(".condition-badge");
const currentTemp = document.querySelector(".temperature");

async function recievedata(location) {
    let api = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/london?key=FRVEAEV7NR7LPJLW6PMHTLTEN`;
    try {
        const response = await fetch(api);
        const data = await response.json();
        return {
            date: data.days[0].datetime,
            temp: data.days[0].temp,
            tempmax: data.days[0].tempmax,
            tempmin: data.days[0].tempmin,
            sunrise: data.days[0].sunrise,
            sunset:data.days[0].sunset,
            conditions: data.days[0].conditions,
            hours: data.days[0].hours,
        };
    } catch (error) {
        return error;
    }
    
}

async function updateData() {
    try {
        const data = await recievedata();
        date.textContent = data.date;
        condition.textContent = data.conditions;
        currentTemp.textContent = data.temp;
    } catch (error) {
        console.error(error);  
    }
}

updateData();