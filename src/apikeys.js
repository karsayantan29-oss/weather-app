const apiKeys = {
  key: process.env.REACT_APP_API_KEY,
  base: "https://api.openweathermap.org/data/2.5/",
};
console.log("🔑 API Key loaded:", process.env.REACT_APP_API_KEY);
export default apiKeys;