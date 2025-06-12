const apiKey = 'fa2d9f3da36ac1a7b56d308c89903fab';

async function getWeather() {
  
  const resultDiv = document.getElementById('result');
  const input = document.getElementById('samuel');
  let city = input.value;

  // if (!city) {
  //   resultDiv.innerText = 'Por favor ingresa una ciudad.';
  //   return;
  // }

  try {
    resultDiv.innerText = 'Buscando...';

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=es`
    );

    // if (!response.ok) throw new Error('Ciudad no encontrada.');

    const data = await response.json();
    const { name, main, weather } = data;

    const sunrisetime = data.sys.sunrise
    const sunsettime = data.sys.sunset

    var datesunrise = new Date(sunrisetime * 1000);
    var datesunset = new Date(sunsettime * 1000);

    console.log(sunrise)

    resultDiv.innerHTML = `
      <p><strong>Ciudad:</strong> ${name}</p>
      <p><strong>Temperatura:</strong> ${main.temp}°C</p>
      <p><strong>Clima:</strong> ${weather[0].description}</p>
      <p><strong>Amanece a las:</strong> ${datesunrise}</p>
      <p><strong>Anochece a las:</strong> ${datesunset}</p>
    `;
  } catch (error) {
    console.log(error)
    resultDiv.innerText = error.message;
  }
}

getWeather()
