
// A $( document ).ready() block.
window.onload = () => {
    

let latInput = document.getElementById('lat');
let lngInput = document.getElementById('lng');

latInput.oninput = () => calculateResults();
lngInput.oninput = () => calculateResults();

let timer;
let observedDate = new Date();
const solsticeDate = new Date(2023, 5, 21, 0, 0, 0, 0)

let getDaylightDay = (aDate) => {
  let sunriseTimes = SunCalc.getTimes(aDate, latInput.value, lngInput.value);
  let diff = sunriseTimes.sunset - sunriseTimes.sunrise;
  let diffS = diff / 1000;
  sunriseTimes.dayLightS = diffS;
  return sunriseTimes;
}

let setSunSize = () => {
  const lSize = Math.min(window.innerWidth, window.innerHeight) * 0.6;
  $('#wheel').css({"width": lSize + "px", "height": lSize + "px", "left":lSize * 0.12 + "px"});
}

let calculateResults =  () => {

  let resultHowMuchMore = document.getElementById('howmuchmore');
  let resultHowMuch = document.getElementById('howmuch');
  let resultMoreOrLess = document.getElementById('moreorless');
  let resultSunrise = document.getElementById('sunrise');
  let resultSunset = document.getElementById('sunset');

  // Create new Date instance
  var today = new Date(observedDate);

  const dayLightToday = getDaylightDay(today);
  const dayLightJuneSolstice = getDaylightDay(solsticeDate);
  const dayLightDecemberSolstice = getDaylightDay(new Date(2023, 11, 21, 0, 0, 0, 0));
  const dayLightDurationS = dayLightToday.dayLightS;

  let yday = today;// Add a day
  yday.setDate(today.getDate() - 1);
  const dayLightYday = getDaylightDay(yday).dayLightS;;


  const diff = dayLightDurationS - dayLightYday;
  const diffAbs = Math.abs(diff);
  const diffMin = Math.floor(diffAbs / 60);
  const diffSec = Math.round(diffAbs - (diffMin * 60));
  
  const howMuchMax = resultHowMuch.textContent = getTextDurationFromSeconds(dayLightJuneSolstice.dayLightS);
  const howMuchMin = resultHowMuch.textContent = getTextDurationFromSeconds(dayLightDecemberSolstice.dayLightS);
  resultHowMuch.textContent = getTextDurationFromSeconds(dayLightDurationS);
  resultHowMuchMore.textContent = diffMin < 0 ? "-" : "+" + diffMin + "min" + diffSec + "";
  resultSunrise.textContent = "↑" + getHourTextDromDate(dayLightToday.sunrise);
  resultSunset.textContent = "↓" + getHourTextDromDate(dayLightToday.sunset);

  const lSizeYellow = 10 + 90 * (dayLightDurationS - dayLightDecemberSolstice.dayLightS) / (dayLightJuneSolstice.dayLightS - dayLightDecemberSolstice.dayLightS);
  $('#svgSunYellow').css({
    "width": lSizeYellow + "%", 
    "height": lSizeYellow + "%", 
    "left": (50 - lSizeYellow * 0.5) + "%", 
    "top": (50 - lSizeYellow * 0.5) + "%"});

  window.clearTimeout(timer);
  timer = window.setTimeout(calculateResults, 1000);
}

let updateTime = () => {
  calculateResults();
}

let getTextDurationFromSeconds = (aSeconds) => {
  const lDate = new Date(aSeconds * 1000);
  const lH = lDate.getHours().toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false
  });
  const lMin = lDate.getMinutes().toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false
  });

  return lH + "h " + lMin + "min";
}

let getHourTextDromDate = (aDate) => {
  return aDate.getHours().toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false
  }) + "h" + aDate.getMinutes().toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false
  });
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

getCurrentLocation();
calculateResults();
setSunSize();

///////////////////////////////
// -------  rotate  -------- //
///////////////////////////////

(function() {
  var init, rotate, start, stop,
    active = false,
    angle = 0,
    rotation = 0,
    startAngle = 0,
    rotationWheel = 0,
    rotationNowMarker = 0;
    center = {
      x: 0,
      y: 0
    },
    R2D = 180 / Math.PI,
    rot = document.getElementById('wheel');

  init = function() {
    setInitRotation();
    rot.addEventListener("mousedown", start, false);
    $(document).bind('mousemove', function(event) {
      if (active === true) {
        event.preventDefault();
        rotate(event);
      }
    });
    $(document).bind('mouseup', function(event) {
      rotationWheel += rotation;
      event.preventDefault();
      stop(event);
    });
  };

  setInitRotation = function() {
    let now = new Date();
    const solstice = solsticeDate;
    // const now2 = new Date(now.getFullYear(), 2, 6, 0, 0, 0, 0);
    
    const diffTime = solstice - now;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    rotationNowMarker = -2 * Math.PI * diffDays / 365.2422;
    rotationWheel = -rotationNowMarker;
    applyRotation(0);
  };

  getCssForAngle = function(aAngle) {
    let css = {
      "top": 50 * (1 + Math.sin(aAngle)) + "%",
      "left":50 * (1 + Math.cos(aAngle)) + "%",
    }
    return css;
  }

  start = function(e) {
    e.preventDefault();
    var bb = this.getBoundingClientRect(),
      t = bb.top,
      l = bb.left,
      h = bb.height,
      w = bb.width,
      x, y;
    center = {
      x: l + (w / 2),
      y: t + (h / 2)
    };
    x = e.clientX - center.x;
    y = e.clientY - center.y;
    startAngle = Math.atan2(y, x);
    return active = true;
  };

  rotate = function(e) {
    e.preventDefault();
    var x = e.clientX - center.x,
      y = e.clientY - center.y,
      d = Math.atan2(y, x);
    applyRotation(d - startAngle);
  }

  applyRotation = function(aRotation) {
    rotation = aRotation;

    let angle = Math.PI * 0 + rotation + rotationWheel;
    $("#summerMarker").css(getCssForAngle(angle));

    angle = Math.PI * 0.5 + rotation + rotationWheel;
    $("#springMarker").css(getCssForAngle(angle));

    angle = Math.PI * 1 + rotation + rotationWheel;
    $("#winterMarker").css(getCssForAngle(angle));

    angle = Math.PI * 1.5 + rotation + rotationWheel;
    $("#autumnMarker").css(getCssForAngle(angle));

    angle = rotationNowMarker + rotation + rotationWheel;
    $("#nowMarker").css(getCssForAngle(angle));

    // difference of days between the solstice and the observed date.
    const daysGap = 365 * (rotation + rotationWheel) / (2 * Math.PI);

    var date = new Date(solsticeDate);
    date.setDate(solsticeDate.getDate() + daysGap);
    observedDate = date;
    updateTime();
  };

  stop = function() {
    angle += rotation;
    return active = false;
  };

  init();

}).call(this);

};