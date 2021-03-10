document.addEventListener("DOMContentLoaded", () => {
  for (let i = 0; i < 3; i++) {
    document.querySelectorAll(".btn-green")[i].onclick = function () {
      document.querySelectorAll(".item").forEach((item) => {
        item.classList.remove("show");
      });
      document.querySelectorAll(".item")[i].classList.add("show");
    };
  }
  let timeZone = 0;

  document.querySelector(".search-weather-js").onclick = function () {
    let input = document.querySelector("input");
    input.value = input.value.replace(/[^A-Za-z\s]/g, "");
    input.value = input.value.replace(/\s+/g, " ");
    input.value = input.value[0].toUpperCase() + input.value.slice(1);
    document.querySelector(".time-city-js").textContent = `${input.value}`;
    getWeather(input.value)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        timeZone = Math.round(data.timezone / 3600) - 4;
        document.querySelector(".temp-js").textContent = `Текущее температа: ${data.main.temp}°C`;
        document.querySelector(".wind-js").textContent = `Скорость ветра: ${data.wind.speed}°C`;
        document.querySelector(".wrap-img img").setAttribute("src", `http://openweathermap.org/img/w/${data.weather[0].icon}.png`);
        setInterval(function () {
          time(timeZone);
        }, 1000);
      });
    let links = "";
    let linkHTML = "";
    getWiki(input.value)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        document.querySelector(".city-js").innerHTML = "";
        for (let i = 0; i < data[3].length; i++) {
          linkHTML = `<a href="${data[3][i]}" class="link">${data[1][i]}</a>`;
          document.querySelector(".city-js").innerHTML += linkHTML;
        }
      });
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
  document.querySelector(".time-js").textContent = `
    ${time.getHours() + timeZone < 10 ? "0" + time.getHours() + timeZone : time.getHours() + timeZone}:
    ${time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes()}:
    ${time.getSeconds() < 10 ? "0" + time.getSeconds() : time.getSeconds()}`;
}
