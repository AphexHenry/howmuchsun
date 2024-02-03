
// A $( document ).ready() block.
window.onload = () => {
    

let latInput = document.getElementById('lat');
let lngInput = document.getElementById('lng');

latInput.oninput = () => calculateResults();
lngInput.oninput = () => calculateResults();

let timer;

let getDaylightDay = (aDate) => {
  let sunriseTimes = SunCalc.getTimes(aDate, latInput.value, lngInput.value);
  let diff = sunriseTimes.sunset - sunriseTimes.sunrise;
  let diffS = diff / 1000;
  sunriseTimes.dayLightS = diffS;
  return sunriseTimes;
}

let calculateResults =  () => {

  let resultHowMuchMore = document.getElementById('howmuchmore');
  let resultHowMuch = document.getElementById('howmuch');
  let resultMoreOrLess = document.getElementById('moreorless');
  let resultSunrise = document.getElementById('sunrise');
  let resultSunset = document.getElementById('sunset');

  // Create new Date instance
  var today = new Date()

  const dayLightToday = getDaylightDay(today);
  const dayLightJuneSolstice = getDaylightDay(new Date(2023, 6, 21, 0, 0, 0, 0));
  const dayLightDecemberSolstice = getDaylightDay(new Date(2023, 12, 21, 0, 0, 0, 0));
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
  resultHowMuch.textContent = "⧖" + getTextDurationFromSeconds(dayLightDurationS);
  resultHowMuchMore.textContent = diffMin < 0 ? "-" : "+" + diffMin + "min" + diffSec + "";
  resultSunrise.textContent = "↑" + getHourTextDromDate(dayLightToday.sunrise);
  resultSunset.textContent = "↓" + getHourTextDromDate(dayLightToday.sunset);

  $('#svgSunYellow').css("scale", Math.sqrt((dayLightDurationS - dayLightDecemberSolstice.dayLightS) / dayLightJuneSolstice.dayLightS));

  window.clearTimeout(timer);
  timer = window.setTimeout(calculateResults, 1000);
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

  return lH + "h" + lMin + "min";
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
    center = {
      x: 0,
      y: 0
    },
    R2D = 180 / Math.PI,
    rot = document.getElementById('wheel');

  init = function() {
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
    rotation = d - startAngle;

let angle = Math.PI * 0 + rotation + rotationWheel;
let css = {
  "top": 50 * (1 + Math.sin(angle)) + "%",
  "left":50 * (1 + Math.cos(angle)) + "%",
};
$("#summerMarker").css(css);

angle = Math.PI * 0.5 + rotation + rotationWheel;
css = {
  "top": 50 * (1 + Math.sin(angle)) + "%",
  "left":50 * (1 + Math.cos(angle)) + "%",
};
$("#winterMarker").css(css);

angle = Math.PI * 1 + rotation + rotationWheel;
css = {
  "top": 50 * (1 + Math.sin(angle)) + "%",
  "left":50 * (1 + Math.cos(angle)) + "%",
};
$("#springMarker").css(css);

angle = Math.PI * 1.5 + rotation + rotationWheel;
css = {
  "top": 50 * (1 + Math.sin(angle)) + "%",
  "left":50 * (1 + Math.cos(angle)) + "%",
};
$("#autumnMarker").css(css);

    // return rot.style.webkitTransform = "rotate(" + (angle + rotation) + "deg)";
  };

  stop = function() {
    angle += rotation;
    return active = false;
  };

  init();

}).call(this);

};