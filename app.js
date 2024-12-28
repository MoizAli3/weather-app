const weatherIcons = {
  "01d": "sun.png", // Clear sky (day)
  "01n": "moon-and-stars.png", // Clear sky (night)
  "02d": "partly-cloudy.png", // Partly cloudy (day)
  "02n": "partly-cloudy-night.png", // Partly cloudy (night)
  "03d": "cloudy.png", // Cloudy (day)
  "03n": "cloudy.png", // Cloudy (night)
  "09d": "rainy-day.png", // Drizzle or light rain (day)
  "09n": "rainy-day.png", // Drizzle or light rain (night)
  "10d": "pouring.png", // Rain showers (day)
  "10n": "pouring.png", // Rain showers (night)
  "11d": "storm.png", // Thunderstorm (day)
  "11n": "storm.png", // Thunderstorm (night)
  "13d": "snowy.png", // Snow (day)
  "13n": "snowy.png", // Snow (night)
  "50d": "fog.png", // Fog or mist (day)
  "50n": "fog.png", // Fog or mist (night)
};

let input = document.querySelector("input");
let temp = document.querySelector(".temp");
let city = document.querySelector(".city");
let icon = document.querySelector(".icon");
let longitude = document.getElementById("longitude");
let latitude = document.getElementById("latitude");
let windSpeed = document.getElementById("wind-speed");
let humidity = document.getElementById("humidity");
let pressure = document.getElementById("pressure");

// Hide the UI initially
document.querySelector(".main").style.display = "none";

// Function to get weather by city name
async function getDataByCity(cityName) {
  let key = "99413b8042ccb86eeeb305955ccf0e23";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${key}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const { main, name, weather, coord, wind } = await response.json();

    // Update city name and temperature
    city.innerText = name;
    temp.innerText = (main.temp - 273.15).toFixed(0) + "°";

    // Update longitude and latitude
    longitude.innerText = coord.lon;
    latitude.innerText = coord.lat;

    // Update wind speed, humidity, and pressure
    windSpeed.innerText = wind.speed + " m/s"; // Wind speed in meters per second
    humidity.innerText = main.humidity + "%"; // Humidity in percentage
    pressure.innerText = main.pressure + " hPa"; // Pressure in hPa

    // Use the weatherIcons object to set the icon
    const iconCode = weather[0].icon;
    const iconFile = weatherIcons[iconCode] || "default.png"; // Fallback to a default image if the icon code is not found
    icon.src = `img/${iconFile}`; // Make sure to replace `img/` with the actual path to your images

    // Show the content after fetching the location data
    document.querySelector(".main").style.display = "flex";
  } catch (error) {
    console.error(error.message);
    city.innerText = "City not found";
    temp.innerText = "--";
    icon.src = ""; // Clear the icon
    longitude.innerText = "--";
    latitude.innerText = "--";
    windSpeed.innerText = "--";
    humidity.innerText = "--";
    pressure.innerText = "--";
  }
}

// Function to get the user's current location
function getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: userLat, longitude: userLon } = position.coords;
        getDataByCoordinates(userLat, userLon);
      },
      (error) => {
        console.error("Error getting location: ", error);
        city.innerText = "Unable to get location";
        temp.innerText = "--";
        icon.src = ""; // Clear the icon
        longitude.innerText = "--";
        latitude.innerText = "--";
        windSpeed.innerText = "--";
        humidity.innerText = "--";
        pressure.innerText = "--";
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
}

// Function to fetch data based on coordinates (latitude, longitude)
async function getDataByCoordinates(lat, lon) {
  let key = "99413b8042ccb86eeeb305955ccf0e23";
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const { main, name, weather, coord, wind } = await response.json();

    // Update city name and temperature
    city.innerText = name;
    temp.innerText = (main.temp - 273.15).toFixed(0) + "°";

    // Update longitude and latitude
    longitude.innerText = coord.lon;
    latitude.innerText = coord.lat;

    // Update wind speed, humidity, and pressure
    windSpeed.innerText = wind.speed + " m/s"; // Wind speed in meters per second
    humidity.innerText = main.humidity + "%"; // Humidity in percentage
    pressure.innerText = main.pressure + " hPa"; // Pressure in hPa

    // Use the weatherIcons object to set the icon
    const iconCode = weather[0].icon;
    const iconFile = weatherIcons[iconCode] || "default.png"; // Fallback to a default image if the icon code is not found
    icon.src = `img/${iconFile}`; // Make sure to replace `img/` with the actual path to your images

    // Show the content after fetching the location data
    document.querySelector(".main").style.display = "flex";
  } catch (error) {
    console.error(error.message);
    city.innerText = "Unable to get location";
    temp.innerText = "--";
    icon.src = ""; // Clear the icon
    longitude.innerText = "--";
    latitude.innerText = "--";
    windSpeed.innerText = "--";
    humidity.innerText = "--";
    pressure.innerText = "--";
  }
}

// Wait until the page loads, then request the current location
window.onload = function () {
  getCurrentLocation();
};

// Debounce helper
function debounce(func, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

// Input listener with debounce for city input
input.addEventListener(
  "input",
  debounce((e) => {
    const value = e.target.value.trim();
    if (value) {
      getDataByCity(value);
    }
  }, 300)
);
