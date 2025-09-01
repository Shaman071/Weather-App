const options = {
    method: 'GET',
    headers: {
        'x-rapidapi-key': '6f7c040a8fmshd90e8e81d1ceae0p17abd9jsn93f1a6d58790',  
        'x-rapidapi-host': 'weather-api99.p.rapidapi.com'
    }
};

async function getWeather(city) {
    document.getElementById("city-name").innerText = `Fetching weather for ${city}...`;
    document.getElementById("current_datetime").innerText = "Loading...";

    try {
        const response = await fetch(
            `https://weather-api99.p.rapidapi.com/weather?city=${city}`,
            options
        );

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log(result);

        if (result.cod && result.cod !== 200) {
            throw new Error(result.message || "City not found by the API.");
        }
        
        document.getElementById("city-name").innerText = `Weather in ${result.name}`;

        const timestamp = result.dt;
        const currentDate = new Date(timestamp * 1000);
        const day = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
        const time = currentDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        document.getElementById("current_datetime").innerText = `${day}, ${time}`;

        const weatherDescription = result.weather[0].main;
        document.getElementById("weather_description").innerText = weatherDescription;

        document.getElementById("temp").innerText = (result.main.temp - 273.15).toFixed(1);
        document.getElementById("min_temp").innerText = (result.main.temp_min - 273.15).toFixed(1);
        document.getElementById("max_temp").innerText = (result.main.temp_max - 273.15).toFixed(1);
        
        const sunrise = new Date(result.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const sunset = new Date(result.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        document.getElementById("sunrise").innerText = sunrise;
        document.getElementById("sunset").innerText = sunset;

        document.getElementById("feels_like").innerText = (result.main.feels_like - 273.15).toFixed(1);
        document.getElementById("humidity").innerText = result.main.humidity;
        document.getElementById("pressure").innerText = result.main.pressure;
        document.getElementById("cloud_pct").innerText = result.clouds.all;
        document.getElementById("visibility").innerText = (result.visibility / 1000).toFixed(1);
        
        document.getElementById("wind_speed").innerText = result.wind.speed;
        document.getElementById("wind_degrees").innerText = result.wind.deg;
        
        document.getElementById("gusts").innerText = "N/A";
        document.getElementById("air_quality").innerText = "N/A";
        document.getElementById("uv_index").innerText = "N/A";

    } catch (error) {
        console.error("Error fetching weather:", error);
        document.getElementById("city-name").innerText = "❌ City not found or API error.";
        document.getElementById("current_datetime").innerText = "";
        document.getElementById("weather_description").innerText = "Error";
        document.getElementById("temp").innerText = "--";
    }
}

// Helper function to create a delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Function to populate the weather table for common places
async function populateWeatherTable() {
    const tableBody = document.querySelector(".table tbody");
    const rows = tableBody.querySelectorAll("tr");

    for (const row of rows) {
        const cityCell = row.querySelector("th");
        const weatherCells = row.querySelectorAll("td");
        const cityName = cityCell.innerText;

        weatherCells.forEach(cell => cell.innerText = "Loading...");
        
        
        await delay(1000); 

        try {
            const response = await fetch(`https://weather-api99.p.rapidapi.com/weather?city=${cityName}`, options);
            if (!response.ok) throw new Error("API call failed");
            
            const result = await response.json();
            if (result.cod && result.cod !== 200) throw new Error("City not found");

            // Update table cells with live data
            weatherCells[0].innerText = `${(result.main.temp - 273.15).toFixed(1)}°C`;
            weatherCells[1].innerText = `${result.main.humidity}%`;
            weatherCells[2].innerText = `${result.wind.speed} km/h`;
            weatherCells[3].innerText = `${(result.main.feels_like - 273.15).toFixed(1)}°C`;

        } catch (error) {
            weatherCells.forEach(cell => cell.innerText = "Error");
            console.error(`Failed to fetch weather for ${cityName}:`, error);
        }
    }
}

// Hook Search Bar
const searchForm = document.querySelector("form");
const searchInput = searchForm.querySelector("input");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const city = searchInput.value.trim();
    if (city) {
        getWeather(city);
        searchInput.value = "";
    }
});

// Make Navbar links functional
document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const city = e.target.innerText;
        getWeather(city);
    });
});

// Load a default city for the main cards when the page loads
getWeather("Delhi");

// Populate the common places table on page load
populateWeatherTable();