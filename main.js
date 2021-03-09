document.addEventListener("DOMContentLoaded", () => {
  for (let i = 0; i < 3; i++) {
    document.querySelectorAll(".btn-green")[i].onclick = function () {
      document.querySelectorAll(".item").forEach((item) => {
        item.classList.remove("show");
      });
      document.querySelectorAll(".item")[i].classList.add("show");
    };
  }
  let timeZone = -4;
  setInterval(function() {time(timeZone)}, 1000);

  document.querySelector(".search-weather-js").onclick = function () {
    let input = document.querySelector("input");
    document.querySelector(".city-js").textContent = `${input.value}`;
    getWeather(input.value)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log("data -", data);
        console.log("data.timezone -", data.timezone);
        timeZone = Math.round(data.timezone / 3600);
      });
  };
});

async function getWeather(city = Samara) {
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=2d8cec61e4e1d4c1c6ce59fc3b4e5907&units=metric`;
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
    ${time.getHours() + timeZone < 10 ? "0" + time.getHours() + timeZone  : time.getHours()  + timeZone }:
    ${time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes()}:
    ${time.getSeconds() < 10 ? "0" + time.getSeconds() : time.getSeconds()}`;
}
