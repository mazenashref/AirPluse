async function getWeather() {
  const lat = document.getElementById("lat").value;
  const lon = document.getElementById("lon").value;
  const date = document.getElementById("date").value.replaceAll("-", "");
  const result = document.getElementById("result");

  if (!lat || !lon || !date) {
    alert("Please fill all fields!");
    return;
  }

  const url = `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=T2M,RH2M,PRECTOTCORR&community=RE&longitude=${lon}&latitude=${lat}&start=${date}&end=${date}&format=JSON`;

  result.style.display = "block";
  result.innerHTML = "Fetching real data from NASA... 🌎";

  try {
    const response = await fetch(url);
    const data = await response.json();

    const params = data.properties?.parameter;
    if (!params) {
      result.innerHTML = "⚠️ No weather data available for this date.";
      return;
    }

    const temp = params.T2M[date];
    const humidity = params.RH2M[date];
    const rain = params.PRECTOTCORR[date];

    if (temp === undefined || humidity === undefined || rain === undefined) {
      result.innerHTML = "⚠️ No valid data found for this date or location.";
      return;
    }

    let comfort = "";
    if (temp > 35) comfort = "🔥 Very Hot";
    else if (temp < 10) comfort = "❄️ Very Cold";
    else if (rain > 5) comfort = "🌧️ Rainy";
    else if (humidity > 80) comfort = "💦 Humid";
    else comfort = "🌤️ Comfortable";

    result.innerHTML = `
      <h2><i class="fa-solid fa-chart-line"></i> Weather Report</h2>
      <p><b>🌡️ Temperature:</b> ${temp.toFixed(1)} °C</p>
      <p><b>💧 Humidity:</b> ${humidity.toFixed(1)}%</p>
      <p><b>🌧️ Rainfall:</b> ${rain.toFixed(1)} mm</p>
      <h3>Status: ${comfort}</h3>
    `;
  } catch (error) {
    result.innerHTML = "❌ Error fetching data from NASA API";
    console.error(error);
  }
}
