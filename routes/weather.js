const express = require("express");
const axios = require("axios");
const CityModel = require("../models/city");
const getWeather = require("../utils/weather");
const { body, validationResult } = require("express-validator");

const router = express.Router();

const apiKey = process.env.API_KEY;

router.get("/", async function (req, res) {
  try {
    const cities = await CityModel.find({});

    if (cities && cities.length > 0) {
      const result = await getWeather(cities[0].name);
      const { weatherData } = result;
      res.render("weather", {
        weather_data: weatherData,
        messages: req.flash("error"),
      });
    } else {
      res.render("weather", { weather_data: [], messages: req.flash("error") });
    }
  } catch (err) {
    console.error("Error fetching cities:", err);
  }
});

router.post(
  "/",
  [
    body("city_name")
      .notEmpty()
      .withMessage("City name is required")
      .custom(async (value) => {
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${value}&units=metric&cnt=11&appid=${apiKey}`;

        try {
          const response = await axios.get(url);
          const weatherJson = response.data;

          if (weatherJson.cod === "404") {
            throw new Error("City not found, please enter a valid city name.");
          }

          return true;
        } catch (error) {
          console.error(`Error getting weather data for ${value}:`, error);
          throw new Error("City not found, please enter a valid city name.");
        }
      }),
  ],
  function (req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      req.flash("error", errors.array()[0].msg);
      res.redirect("/");
      return;
    }

    const city = req.body.city_name;

    getWeather(city).then(function (result) {
      const weatherData = result;
      res.render("weather", {
        weather_data: weatherData,
        messages: req.flash("error"),
      });
    });
  }
);

module.exports = router;
