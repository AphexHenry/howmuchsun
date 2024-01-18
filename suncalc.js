let latInput = document.getElementById('lat');
let lngInput = document.getElementById('lng');

window.onload = () => {
  getCurrentLocation();
  calculateResults();
};

latInput.oninput = () => calculateResults();
lngInput.oninput = () => calculateResults();

let timer;

let getDaylightDayS = (aDate) => {
    // let sunrisePos = SunCalc.getPosition(new Date(), latInput.value, lngInput.value);
  let sunriseTimes = SunCalc.getTimes(aDate, latInput.value, lngInput.value);
  let diff = sunriseTimes.sunset - sunriseTimes.sunrise;
  let diffS = diff / 1000;
  return diffS;
}

let calculateResults =  () => {

  let resultHowMuchMore = document.getElementById('howmuchmore');
  let resultHowMuch = document.getElementById('howmuch');
  let resultMoreOrLess = document.getElementById('moreorless');

  // Create new Date instance
  var today = new Date()

  const dayLightToday = getDaylightDayS(today);

  let yday = today;// Add a day
  yday.setDate(today.getDate() - 1);
  const dayLightYday = getDaylightDayS(yday);

  const diff = dayLightToday - dayLightYday;
  const diffAbs = Math.abs(diff);
  const diffMin = Math.floor(diffAbs / 60);
  const diffSec = Math.round(diffAbs - (diffMin * 60));
  
  resultHowMuch.textContent = new Date(dayLightToday * 1000).getHours() + "h" + new Date(dayLightToday * 1000).getMinutes() + "min";
  resultHowMuchMore.textContent = "" + diffMin + " minutes and " + diffSec + " seconds ";
  resultMoreOrLess.textContent = diff < 0 ? "less" : "more";
  window.clearTimeout(timer);
  timer = window.setTimeout(calculateResults, 1000);
}
    
let getCurrentLocation = () => {
    console.log("getting location data");
   navigator.geolocation.getCurrentPosition(
    (data) => {
      console.log(data);
      latInput.value = data.coords.latitude;
      lngInput.value = data.coords.longitude;
    },
    (error) => {
      console.log(error);
    }
  )
}

