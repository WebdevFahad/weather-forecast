


let forcast = async (val) => {
   
    
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${val}`;
    let respone = await fetch(geoUrl);
    console.log(respone);
    let data = await respone.json();
    let div1 = document.querySelector(".boxes");
    let namer = document.querySelector(".name")
    namer.innerHTML = "";
    div1.innerHTML = "";


    if (!data.results || data.results.length === 0) {

        div1.innerHTML = "<h2>No country or city found</h2>";
        return

    }
    else {
        let { latitude, longitude, country, name } = data.results[0];

        let timezonenew = Intl.DateTimeFormat().resolvedOptions().timeZone;

        let url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=sunrise,sunset,weather_code,temperature_2m_max,temperature_2m_min,rain_sum&hourly=temperature_2m&models=icon_seamless&current=temperature_2m,relative_humidity_2m,weather_code,precipitation,rain&timezone=${timezonenew}`;
        let responeee = await fetch(url);
        let data1 = await responeee.json();
       
    
        let sunrise = data1.daily.sunrise;
      
        let sunset = data1.daily.sunset;

        let temp = data1.daily.temperature_2m_min;

        let date = data1.daily.time;
 
        let weathercode = data1.daily.weather_code;
     
        let humidity = data1.current.relative_humidity_2m;
    

        namer.innerHTML += `
  <h1> ${name} </h1>
   `
        for (let i = 0; i < weathercode.length; i++) {
            let icon = getWeatherIcon(weathercode[i]);
            let newrise = formattime(sunrise[i]);
            let newset = formattime(sunset[i]);
           
            let dayName = getDayName(date[i]);




            div1.innerHTML += `
       
  <div class="boxes">
        <div class="box1">
            <div class="date-time">
                <div class="day">${dayName}</div>
                <div class="time">${date[i]}</div>

            </div>

            <div class="temp-icon">
                <div class="temp">
                    ${temp[i]} °C
                </div>
                <div class="icons">
                    ${icon}
                </div>
            </div>
            <div class="side">
            <div class="left-side">
                <div>Country <span>${country}</span></div>
                <div>Humidity = <span>${humidity}%</span></div>


            </div>
            <div class="Right-side">
                <div> Sunrise = <span>${newrise}</span></div>
                <div>Sunset =<span>${newset}</span></div>


            </div>
            </div>
        </div>
        </div>

          

       
          `;

            if (weathercode[0] === 0) {
               document.body.style.backgroundImage = 
  "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('image/sunny.webp')";
            } else if (weathercode[0] === 1 || weathercode[0] === 2) {
            document.body.style.backgroundImage = 
  "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('image/weather2.webp')";
            } else if (weathercode[0] === 3) {
                document.body.style.backgroundImage = 
  "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.2)), url('image/weather3.webp')";
         
            } else if (weathercode[0] >= 45 && weathercode[0] <= 48) {
                document.body.style.backgroundImage = 
  "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('image/weather-foggy.webp')";
            
            } else if (weathercode[0] >= 51 && weathercode[0] <= 67) {
                 document.body.style.backgroundImage = 
  "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('image/weather7.webp')";
                
            
            } else if (weathercode[0] >= 71 && weathercode[0] <= 77) {
                                 document.body.style.backgroundImage = 
  "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.5)), url('image/weather6.webp')";
                
               
            } else if (weathercode[0] >= 80 && weathercode[0] <= 82) {
                                 document.body.style.backgroundImage = 
  "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('image/rainy.webp')";
              
            } else if (weathercode[0] >= 95 && weathercode[0] <= 99) {
                                 document.body.style.backgroundImage = 
  "linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.4)), url('image/weather8.webp')";
           
            } else {
                console.log("no image found")
            }
        }
    };
};

    function getWeatherIcon(code) {
        
        if (code === 0) return "☀️"; // Clear sky
        if (code === 1 || code === 2) return "🌤️"; // Mainly clear, partly cloudy
        if (code === 3) return "☁️"; // Overcast
        if (code >= 45 && code <= 48) return "🌫️"; // Fog
        if (code >= 51 && code <= 67) return "🌦️"; // Drizzle
        if (code >= 71 && code <= 77) return "❄️"; // Snow
        if (code >= 80 && code <= 82) return "🌧️"; // Rain showers
        if (code >= 95 && code <= 99) return "⛈️"; // Thunderstorm
        return "❔"; // Unknown
    }
    let formattime = (iso) => {
        let date = new Date(iso);
        return date.toLocaleDateString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };


    function getDayName(iso) {
        let date = new Date(iso);
        return date.toLocaleDateString("en-US", { weekday: "long" });
    }

    let inputs = document.querySelector(".input-city");
     let loaddiv=document.querySelector(".loaderdiv");

     let loadshow=()=>{
        loaddiv.classList.remove("hide")
     }
     let loadhide=()=>{
        loaddiv.classList.add("hide")
     }

    let hanldeinput = async () => {
         let div1 = document.querySelector(".boxes");
     
        let val = inputs.value.trim().toLowerCase();
        if (val.length >= 2) {
            loadshow();
            await forcast(val);
            loadhide();
          
        } else {

               div1.innerHTML = "<h2>No country or city found</h2>";
        }
    };
       
    document.querySelector(".btn").addEventListener("click", () => {
    
      hanldeinput();
    });
    inputs.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
        hanldeinput();
        }
    });


    window.addEventListener("load",()=>{
        let loadonwindow=document.querySelector(".loadonwindow")

        setTimeout(()=>{
            loadonwindow.classList.add("hide")
        },2000)
    })

 