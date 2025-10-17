import React from "react";
import apiKeys from "./apikeys";
import Clock from "react-live-clock";
import Forcast from "./forcast";
import loader from "./assets/WeatherIcons.gif";
import ReactAnimatedWeather from "react-animated-weather";

const dateBuilder = (d) => {
  let months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];
  let days = [
    "Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday",
  ];
  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();
  return `${day}, ${date} ${month} ${year}`;
};

const defaults = { color: "white", size: 112, animate: true };

class Weather extends React.Component {
  state = {
    lat: undefined,
    lon: undefined,
    errorMessage: undefined,
    temperatureC: undefined,
    temperatureF: undefined,
    city: undefined,
    country: undefined,
    humidity: undefined,
    description: undefined,
    icon: "CLEAR_DAY",
    main: undefined,
  };

  componentDidMount() {
    // Use standard navigator.geolocation (no react-geolocated)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.getWeather(position.coords.latitude, position.coords.longitude);
        },
        (err) => {
          // fallback to Delhi if location denied
          this.getWeather(28.67, 77.22);
          alert(
            "Location access denied. Using default location (Delhi) for weather."
          );
        }
      );
    } else {
      alert("Geolocation not available. Using default location (Delhi).");
      this.getWeather(28.67, 77.22);
    }

    // auto-refresh every 10 minutes
    this.timerID = setInterval(
      () => this.getWeather(this.state.lat, this.state.lon),
      600000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  getWeather = async (lat, lon) => {
    try {
      const api_call = await fetch(
        `${apiKeys.base}weather?lat=${lat}&lon=${lon}&units=metric&APPID=${apiKeys.key}`
      );
      const data = await api_call.json();

      this.setState({
        lat,
        lon,
        city: data.name,
        temperatureC: Math.round(data.main.temp),
        temperatureF: Math.round(data.main.temp * 1.8 + 32),
        humidity: data.main.humidity,
        main: data.weather[0].main,
        country: data.sys.country,
      });

      // set icon based on weather
      let iconMap = {
        Haze: "CLEAR_DAY",
        Clouds: "CLOUDY",
        Rain: "RAIN",
        Snow: "SNOW",
        Dust: "WIND",
        Drizzle: "SLEET",
        Fog: "FOG",
        Smoke: "FOG",
        Tornado: "WIND",
      };
      this.setState({ icon: iconMap[this.state.main] || "CLEAR_DAY" });
    } catch (err) {
      console.error("Failed to fetch weather:", err);
    }
  };

  render() {
    if (this.state.temperatureC) {
      return (
        <React.Fragment>
          <div className="city">
            <div className="title">
              <h2>{this.state.city}</h2>
              <h3>{this.state.country}</h3>
            </div>
            <div className="mb-icon">
              <ReactAnimatedWeather
                icon={this.state.icon}
                color={defaults.color}
                size={defaults.size}
                animate={defaults.animate}
              />
              <p>{this.state.main}</p>
            </div>
            <div className="date-time">
              <div className="dmy">
                <div className="current-time">
                  <Clock format="HH:mm:ss" interval={1000} ticking={true} />
                </div>
                <div className="current-date">{dateBuilder(new Date())}</div>
              </div>
              <div className="temperature">
                <p>
                  {this.state.temperatureC}°<span>C</span>
                </p>
              </div>
            </div>
          </div>
          <Forcast icon={this.state.icon} weather={this.state.main} />
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <img
            src={loader}
            style={{ width: "50%", WebkitUserDrag: "none" }}
            alt="loading"
          />
          <h3 style={{ color: "white", fontSize: "22px", fontWeight: "600" }}>
            Detecting your location
          </h3>
          <h3 style={{ color: "white", marginTop: "10px" }}>
            Your current location will be displayed on the App & used for real-time weather.
          </h3>
        </React.Fragment>
      );
    }
  }
}

export default Weather;