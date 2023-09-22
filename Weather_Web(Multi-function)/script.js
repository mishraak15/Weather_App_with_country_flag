let btn = document.querySelectorAll(".btn");
let grant_access = document.querySelector(".grant_access");
let search_bar = document.querySelector(".search_bar");
let search_btn = document.querySelector(".search_btn");
let weather_info = document.querySelector(".weather_info");
let loading_element = document.querySelector(".loading_element");
let inp = document.querySelector("#inp");
let city = document.querySelector("#city");
let country_flag = document.querySelector("#country_flag");
let weather_condition = document.querySelector("#weather_condition");
let weather_img = document.querySelector("#weather_img");
let temp = document.querySelector("#temp");
let windspeed = document.querySelector("#windspeed");
let humidity = document.querySelector("#humidity");
let clouds = document.querySelector("#clouds");
let container = document.querySelector(".container");
let not_found = document.querySelector(".not_found");

const api_key = "3e5066fd3f291cd7bfcf665fdff1ca9b";
btn[1].style.cssText = "background:transparent;";
let flag = 0;

getfromlocalstorage();

function getfromlocalstorage() {
  let local = sessionStorage.getItem("currentlocation");
  if (!local) {
    weather_info.style.display = "none";
    grant_access.style.display = "flex";
    flag = 0;
  } else {
    // present in local storage
    grant_access.style.display = "none";
    loading_element.style.display = "none";
    let coordinates = JSON.parse(local);
    fetchweatherdata(coordinates);

    weather_info.style.display = "flex";
    flag = 1;
  }
}

async function fetchweatherdata(coordinates) {
  const { lat, lon } = coordinates;
  grant_access.style.display = "none";
  weather_info.style.display = "none";
  loading_element.style.display = "flex";

  // Api call
  try {
    let info = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`
    );
    let data = await info.json();
    if (data.cod == "404") {
      loading_element.style.display = "none";
      not_found.style.display = "flex";
    } else {
      renderdata(data);
      loading_element.style.display = "none";
      weather_info.style.display = "flex";
    }
  } catch (err) {
    weather_info.style.display = "none";
    loading_element.style.display = "flex";
    console.log("Error in Handling the data");
  }
}

function renderdata(data) {
  console.log(data);
  let countryCode = data?.sys?.country.toLowerCase();
  country_flag.src = `https://flagcdn.com/h20/${countryCode}.png`;
  city.innerText = data?.name;
  weather_condition.innerText = data?.weather?.[0]?.description;
  let w_code = data?.weather?.[0]?.icon;
  weather_img.src = ` https://openweathermap.org/img/wn/${w_code}@2x.png`;
  let t = data?.main?.temp;
  t = t - 273.15;
  temp.innerText = t.toFixed(2);
  windspeed.innerText = `${data?.wind?.speed} Km/h`;
  humidity.innerText = `${data?.main?.humidity} %`;
  clouds.innerText = `${data?.clouds?.all} %`;
}

getfromlocalstorage();

btn[0].addEventListener("click", () => {
  getfromlocalstorage();
  search_bar.style.display = "none";
  weather_info.style.display = "none";
  not_found.style.display = "none";
  if (btn[0].style.background === "transparent") {
    loading_element.style.display = "flex";
  }
  btn[0].style.background = "#c8dce37d";
  btn[1].style.background = "transparent";
  setTimeout(() => {
    loading_element.style.display = "none";
    if (flag === 1) {
      grant_access.style.display = "none";
      weather_info.style.display = "flex";
    } else {
      weather_info.style.display = "none";
      grant_access.style.display = "flex";
    }
  }, 300);
});

btn[1].addEventListener("click", () => {
  grant_access.style.display = "none";
  weather_info.style.display = "none";
  if (btn[1].style.background === "transparent") {
    loading_element.style.display = "flex";
  }
  btn[1].style.background = "#c8dce37d";
  btn[0].style.background = "transparent";
  setTimeout(() => {
    loading_element.style.display = "none";
    search_bar.style.display = "flex";
  }, 300);
});

search_btn.addEventListener("click", (e) => {
  e.preventDefault();
  if (inp.value.length == 0) {
    return;
  }
  searchedcityweather(inp.value);
});

async function searchedcityweather(city) {
  grant_access.style.display = "none";
  weather_info.style.display = "none";
  not_found.style.display = "none";
  loading_element.style.display = "flex";

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`
    );
    let d = await response.json();
    if (d.cod == "404") {
      loading_element.style.display = "none";
      not_found.style.display = "flex";
    } else {
      loading_element.style.display = "none";
      weather_info.style.display = "flex";
      renderdata(d);
    }
  } catch (err) {
    not_found.style.display = "flex";
    console.log("Error in searching");
  }
}

let access_btn = document.querySelector(".access_btn");

access_btn.addEventListener("click", getlocation());

function getlocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showposition);
  } else {
    alert("Geolocation is not available");
  }
}

function showposition(position) {
  const coordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  };
  sessionStorage.setItem("currentlocation", JSON.stringify(coordinates));
  fetchweatherdata(coordinates);
}
