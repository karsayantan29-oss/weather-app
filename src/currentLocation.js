import React, { useEffect, useState } from "react";
import { useGeolocation } from "react-use";
import apiKeys from "./apikeys";
import Clock from "react-live-clock";
import Forecast from "./forcast";
import loader from "./assets/WeatherIcons.gif";
import ReactAnimatedWeather from "react-animated-weather";
import "./currentLocation.css";

const CurrentLocation = () => {
  const { latitude, longitude, error } = useGeolocation();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cityInput, setCityInput] = useState(""); // input field
  const [searchCity, setSearchCity] = useState(""); // city to fetch

  const defaults = {
    icon: "CLEAR_DAY",
    color: "goldenrod",
    size: 64,
    animate: true,
  };

  // Fetch weather by geolocation or city
  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      let url = "";

      if (searchCity) {
        // Fetch by city name
        url = `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&units=metric&appid=${apiKeys.key}`;
      } else if (latitude && longitude) {
        // Fetch by current location
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKeys.key}`;
      } else {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(url);
        const data = await res.json();
        setWeather(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [searchCity, latitude, longitude]);

  // Date builder
  const dateBuilder = (d) => {
    const months = [
      "January","February","March","April","May","June",
      "July","August","September","October","November","December"
    ];
    const days = [
      "Sunday","Monday","Tuesday","Wednesday",
      "Thursday","Friday","Saturday"
    ];
    return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]}`;
  };

  // Handle city search form submit
  const handleSearch = (e) => {
    e.preventDefault();
    if (cityInput.trim() !== "") {
      setSearchCity(cityInput.trim());
      setCityInput("");
    }
  };

  // Error handling
  if (error) {
    return (
      <div className="weather-box">
        <h3>⚠️ Location Error</h3>
        <p>{error.message || "Enable location and reload"}</p>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="weather-box">
        <img src={loader} alt="Loading..." className="loader" />
        <h3>Detecting your location...</h3>
      </div>
    );
  }

  // Weather API error
  if (!weather || weather.cod !== 200) {
    return (
      <div className="weather-box">
        <h3>Unable to fetch weather data ☁️</h3>
        <p>Try refreshing the page or check the city name.</p>
      </div>
    );
  }

  // Main weather card
  return (
    <div className="weather-box">
      {/* Search box */}
      <form onSubmit={handleSearch} style={{ marginBottom: "15px", width: "100%" }}>
        <input
          type="text"
          placeholder="Enter city"
          value={cityInput}
          onChange={(e) => setCityInput(e.target.value)}
          style={{
            width: "70%",
            padding: "8px",
            borderRadius: "8px 0 0 8px",
            border: "none",
            outline: "none",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "8px 12px",
            border: "none",
            borderRadius: "0 8px 8px 0",
            background: "goldenrod",
            color: "#000",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </form>

      <h2>{weather.name}, {weather.sys.country}</h2>
      <p>{dateBuilder(new Date())}</p>

      <div className="weather-temp">{Math.round(weather.main.temp)}°C</div>
      <ReactAnimatedWeather
        icon={defaults.icon}
        color={defaults.color}
        size={defaults.size}
        animate={defaults.animate}
      />

      <p>{weather.weather[0].main}</p>
      <p className="weather-details">
        Humidity: {weather.main.humidity}% | Wind: {Math.round(weather.wind.speed)} m/s
      </p>

      <Clock format="HH:mm:ss" ticking={true} className="weather-clock" />
      <Forecast lat={weather.coord.lat} lon={weather.coord.lon} />
    </div>
  );
};

export default CurrentLocation;