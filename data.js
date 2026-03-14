const apiKey = "4b427b08ee9a0f90168aaa1628a1d4cd";

const districts = [
"Aurangabad","Beed","Jalna","Osmanabad","Nanded","Parbhani","Hingoli","Latur",
"Mumbai","Mumbai Suburban","Thane","Palghar","Raigad","Ratnagiri","Sindhudurg",
"Pune","Satara","Sangli","Kolhapur","Solapur",
"Ahmednagar","Nashik","Dhule","Jalgaon","Nandurbar",
"Akola","Amravati","Buldhana","Washim","Yavatmal",
"Nagpur","Wardha","Bhandara","Gondia","Chandrapur","Gadchiroli"
];

async function getWeather() {
  for (const city of districts) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},IN&appid=${apiKey}&units=metric`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      console.log({
        district: city,
        temperature: data.main?.temp,
        weather: data.weather?.[0]?.description
      });

    } catch (error) {
      console.log("Error fetching", city);
    }
  }
}

getWeather();