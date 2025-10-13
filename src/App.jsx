import React from "react";
import CurrentLocation from "./currentLocation";
import "./App.css";

function App() {
  return (
    <>
      <div className="container">
        <CurrentLocation />
      </div>

      <div className="footer-info">
        <a
          href="https://github.com/sayantankar/weather-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub Repo
        </a>{" "}
        | Developed by{" "}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://sayantankar.vercel.app/"
        >
          Sayantan Kar
        </a>{" "}
        | Powered by{" "}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://openweathermap.org/"
        >
          OpenWeather
        </a>
      </div>
    </>
  );
}

export default App;