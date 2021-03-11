document.addEventListener("DOMContentLoaded", () => {
  geoFind();
  setTimeout(() => {
    getData(geoData.list[0].name);
  }, 1500);

  for (let i = 0; i < 3; i++) {
    document.querySelectorAll(".btn-green")[i].onclick = function () {
      document.querySelectorAll(".item").forEach((item) => {
        item.classList.remove("show");
      });
      document.querySelectorAll(".item")[i].classList.add("show");
    };
  }

  document.querySelector(".search-weather-js").onclick = function () {
    let input = document.querySelector("input");
    input.value = input.value.replace(/[^A-Za-z\s]/g, "");
    input.value = input.value.replace(/\s+/g, " ");
    if (!input.value) return;
    input.value = input.value[0].toUpperCase() + input.value.slice(1);
    document.querySelector(".time-city-js").textContent = `${input.value}`;
    getData(input.value);
  };
});

async function getWeather(city = Samara) {
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=2d8cec61e4e1d4c1c6ce59fc3b4e5907&units=metric`;
  const response = await fetch(url, {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    redirect: "follow",
    referrerPolicy: "no-referrer",
  });
  return await response;
}

async function getWeatherGeo(lat, lon) {
  let url = `https://api.openweathermap.org/data/2.5/find?lat=${lat}&lon=${lon}&cnt=10&appid=2d8cec61e4e1d4c1c6ce59fc3b4e5907&units=metric`;
  const response = await fetch(url, {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    redirect: "follow",
    referrerPolicy: "no-referrer",
  });
  return await response;
}

async function getWiki(city = Samara) {
  let url = `https://en.wikipedia.org/w/api.php?origin=*&action=opensearch&search=${city}`;
  const response = await fetch(url, {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    redirect: "follow",
    referrerPolicy: "no-referrer",
  });
  return await response;
}

function time(timeZone = 0) {
  let time = new Date();
  let hours = time.getHours() + timeZone;
  hours <= 24 ? hours : (hours = hours - 24);
  document.querySelector(".time-js").textContent = `
    ${hours < 10 ? "0" + hours : hours}:
    ${time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes()}:
    ${time.getSeconds() < 10 ? "0" + time.getSeconds() : time.getSeconds()}`;
}

let geoData;
let timeZone = 0;

function geoFind() {
  function success(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    getWeatherGeo(latitude, longitude)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        geoData = data;
      });
  }
  function error() {
    console.log("Не удалось определить локацию");
  }
  navigator.geolocation.getCurrentPosition(success, error);
}

function getData(city) {
  document.querySelector(".time-city-js").textContent = `${city}`;
  getWeather(city)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.cod == "404") {
        document.querySelectorAll(".btn-green").forEach((item) => {
          item.disabled = true;
        });
        document.querySelectorAll(".item").forEach((item) => {
          item.classList.remove("show");
        });
        return;
      }
      document.querySelectorAll(".btn-green").forEach((item) => {
        item.disabled = false;
      });
      timeZone = Math.round(data.timezone / 3600) - 4;
      document.querySelector(".temp-js").textContent = `Текущее температура: ${data.main.temp}°C`;
      document.querySelector(".wind-js").textContent = `Скорость ветра: ${data.wind.speed}°C`;
      document.querySelector(".wrap-img img").setAttribute("src", `http://openweathermap.org/img/w/${data.weather[0].icon}.png`);
      setInterval(function () {
        time(timeZone);
      }, 100);
    });
  let linkHTML = "";

  getWiki(city)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (!data[1].length) {
        document.querySelectorAll(".btn-green").forEach((item) => {
          item.disabled = true;
        });
        document.querySelectorAll(".item").forEach((item) => {
          item.classList.remove("show");
        });
        return;
      }
      document.querySelectorAll(".btn-green").forEach((item) => {
        item.disabled = false;
      });
      document.querySelector(".city-js").innerHTML = "";
      for (let i = 0; i < data[3].length; i++) {
        linkHTML = `<a href="${data[3][i]}" class="link">${data[1][i]}</a>`;
        document.querySelector(".city-js").innerHTML += linkHTML;
      }
    });
  document.querySelectorAll(".item").forEach((item) => {
    item.classList.remove("show");
  });
  document.querySelectorAll(".item")[0].classList.add("show");
}
