import React from "react";
import CurrentLocation from "./currentLocation";
import "./currentLocation.css"; // CSS for weather card and background

function App() {
  return (
    <div className="app-container">
      {/* Top developer info */}
      <div className="app-header">
        <h1>Developed by Sayantan Kar</h1>
        <p>
          GitHub:{" "}
          <a
            href="https://github.com/sayantankar/weather-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            sayantankar
          </a>
        </p>
        <p>
          Powered by{" "}
          <a
            href="https://openweathermap.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            OpenWeather
          </a>
        </p>
      </div>

      {/* Weather card */}
      <CurrentLocation />
    </div>
  );
}

export default App;