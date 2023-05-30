const axios = require("axios");
const apiKey = process.env.API_KEY;

async function getWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&cnt=40&appid=${apiKey}`;

  try {
    const response = await axios.get(url);
    const weatherJson = response.data;

    const weatherData = [];

    const today = new Date().setHours(0, 0, 0, 0);
    let currentDate = null;
    let minTemp = null;
    let maxTemp = null;
    let tempSum = 0;
    let tempCount = 0;

    for (let i = 0; i < weatherJson.list.length; i++) {
      const date = new Date(weatherJson.list[i].dt * 1000).setHours(0, 0, 0, 0);

      if (currentDate === null) {
        currentDate = date;
      }

      if (date !== currentDate) {
        if (currentDate >= today && weatherData.length < 5) {
          const avgTemp = tempSum / tempCount;
          const weather = {
            date: new Date(currentDate),
            city: city,
            temperature: Math.round(avgTemp),
            description: weatherJson.list[i - 1].weather[0].description,
            icon: weatherJson.list[i - 1].weather[0].icon,
            minTemp: Math.round(minTemp),
            maxTemp: Math.round(maxTemp),
          };
          weatherData.push(weather);
        }

        currentDate = date;
        minTemp = weatherJson.list[i].main.temp;
        maxTemp = weatherJson.list[i].main.temp;
        tempSum = weatherJson.list[i].main.temp;
        tempCount = 1;
      } else {
        if (weatherJson.list[i].main.temp < minTemp) {
          minTemp = weatherJson.list[i].main.temp;
        }
        if (weatherJson.list[i].main.temp > maxTemp) {
          maxTemp = weatherJson.list[i].main.temp;
        }
        tempSum += weatherJson.list[i].main.temp;
        tempCount++;
      }
    }

    if (currentDate >= today && weatherData.length < 5) {
      const avgTemp = tempSum / tempCount;
      const weather = {
        date: new Date(currentDate),
        city: city,
        temperature: Math.round(weatherJson.main.temp),
        description:
          weatherJson.list[weatherJson.list.length - 1].weather[0].description,
        icon: weatherJson.list[weatherJson.list.length - 1].weather[0].icon,
        minTemp: Math.round(minTemp),
        maxTemp: Math.round(maxTemp),
      };
      weatherData.push(weather);
    }

    return weatherData;
  } catch (error) {
    console.error(`Error getting weather data for ${city}:`, error);
    return null;
  }
}

module.exports = getWeather;
