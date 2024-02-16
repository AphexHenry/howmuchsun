
// A $( document ).ready() block.
window.onload = () => {
    
let latInput = document.getElementById('lat');
let lngInput = document.getElementById('lng');

latInput.oninput = () => calculateResults();
lngInput.oninput = () => calculateResults();

let timer;
let observedDate = new Date();
const solsticeDate = new Date(2023, 5, 21, 0, 0, 0, 0);
const todayDate = new Date();
todayDate.setFullYear(2023);
let timeoutSub = 0;

let angleToRead = 0; // angle of the wheel for which we read current value.

let getDaylightDay = (aDate) => {
  let sunriseTimes = SunCalc.getTimes(aDate, latInput.value, lngInput.value);
  let diff = sunriseTimes.sunset - sunriseTimes.sunrise;
  let diffS = diff / 1000;
  sunriseTimes.dayLightS = diffS;
  return sunriseTimes;
}

let setSunSize = () => {
  let lSize;  
  let lLeft;
  const widthMarker = 3;

  if(window.outerWidth > window.outerHeight) {
      lSize = document.body.clientWidth * 0.5;
      lLeft = document.body.clientWidth * 0.05;
      $('#wheel').css({"width": lSize + "px", "height": lSize + "px", "left":lLeft + "px", "top":(0.5 * ($("#background").height() - lSize))   + "px"});
      const top = $("#wheel").last().offset().top ;
      $("#mainContainer").css({"width":(document.body.clientWidth - lSize - lLeft - 30) + "px", "height":lSize + "px", "top":top + "px"}); 
      $("#observedTimeMarker").css({"top":(top + lSize * 0.5) + "px", "left": $("#wheel").last().offset().left + lSize * 1.03 + "px", "width":$("main").css("margin-left")});
      angleToRead = 0;
  }
  else { // phone
      lSize = window.outerWidth * 1;
      lLeft = (window.outerWidth - lSize) * 0.5;
      let lTop = - lSize * 0.5;
      $('#wheel').css({"width": lSize + "px", "height": lSize + "px", "left": lLeft + "px", "top":lTop + "px"});
      const topMain = 0.55 * lSize;
      const widthMain = (document.body.clientWidth - lSize - lLeft);
      $("#mainContainer").css({"height":lSize + "px", "top":topMain + "px", "left":(window.outerWidth - widthMain) * 0}); 
      const bottomMain = $("main").last().offset().top + $("main").outerHeight(false);
      $("#observedTimeMarker").css({"width":widthMarker + "px", "top":(bottomMain) + "px", "left": 0.5 * (window.outerWidth - widthMarker) + "px", "height":($('#wheel').last().offset().top - bottomMain) + "px"});
      angleToRead = Math.PI * 0.5;
  }
}

window.addEventListener("resize", setSunSize);

let calculateResults =  () => {

  let resultTopText = document.getElementById('topTimeText');
  let resultSubText = document.getElementById('subTimeText');
  let resultHowMuchMore = document.getElementById('howmuchmore');
  let resultHowMuch = document.getElementById('howmuch');
  let resultMoreOrLess = document.getElementById('moreorless');
  let resultMinSun = document.getElementById('minsun');
  let resultMaxSun = document.getElementById('maxsun');
  let resultSunrise = document.getElementById('sunrise');
  let resultSunset = document.getElementById('sunset');
  let resultthanyesterday = document.getElementById("thanyesterday");

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
  let diffSec = Math.round(diffAbs - (diffMin * 60));
  if(diffSec < 10) {
    diffSec = "0" + diffSec;
  }

  // resultHowMuch.textContent = getTextDurationFromSeconds(dayLightJuneSolstice.dayLightS);
  // resultHowMuch.textContent = getTextDurationFromSeconds(dayLightDecemberSolstice.dayLightS);

  resultTopText.textContent = getTextForDate(observedDate);
  resultHowMuch.textContent = getTextDurationFromSeconds(dayLightDurationS);
  $("#durationLevel").html(getTextDurationFromSeconds(dayLightDurationS));
  const minDiffText = (diffMin > 0) ? diffMin + "min" : ""
  resultMoreOrLess.textContent = diff < 0 ? " less" : " more";
  if(diff > 0) {
    $(resultMoreOrLess).addClass("isMore");
  }
  resultHowMuchMore.textContent = minDiffText  + diffSec + "s";

  resultSunrise.textContent = getHourTextDromDate(dayLightToday.sunrise);
  resultSunset.textContent = getHourTextDromDate(dayLightToday.sunset);

  resultthanyesterday.textContent = (observedDate.getDate() == todayDate.getDate()) ? "each day" : "each day"

  resultMinSun.textContent = getTextDurationFromSeconds(dayLightDecemberSolstice.dayLightS);
  resultMaxSun.textContent = getTextDurationFromSeconds(dayLightJuneSolstice.dayLightS);


  const lTextSub = getSubTime(observedDate);
  const wasFull = resultSubText.textContent.length;
  
  if(lTextSub.length && (!wasFull || (timeoutSub <= 0))) {
    $("#subTimeText").css({"transform": "rotateX(0deg)"});
    resultSubText.textContent = lTextSub;
    clearTimeout(timeoutSub);
  }
  else if(!lTextSub.length && wasFull && (timeoutSub <= 0)) {
    $("#subTimeText").css({"transform": "rotateX(90deg)"});
    clearTimeout(timeoutSub);
    timeoutSub = setTimeout(function() {
      resultSubText.textContent = "";
      timeoutSub = -1;
    }, 300);
  }

  const ratioSunMinMax = (dayLightDurationS - dayLightDecemberSolstice.dayLightS) / (dayLightJuneSolstice.dayLightS - dayLightDecemberSolstice.dayLightS);;
  const lSizeYellow = 10 + 90 * ratioSunMinMax;
  const valueCss = "linear-gradient(80deg, white 0%, white " + (Math.round(ratioSunMinMax * 100) - 1 )+ "%, #FDC46D " + Math.round(ratioSunMinMax * 100) + "%, #FDC46D 100%)";
  $("#levelSun").css("background",valueCss);

  $('#svgSunYellow').css({
    "width": lSizeYellow + "%", 
    "height": lSizeYellow + "%", 
    "left": (50 - lSizeYellow * 0.5) + "%", 
    "top": (50 - lSizeYellow * 0.5) + "%"});

  $("#background2").css("opacity", (lSizeYellow / 100));
  $("#svgSunWhiteLine").css("opacity", Math.sqrt(1 - (lSizeYellow / 100)));

}

let getTextForDate = () => {
  if((observedDate.getDate() == todayDate.getDate()) && (observedDate.getMonth() == todayDate.getMonth())) {
    return "today";
  }
  return observedDate.getDate().toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false
  }) + " " + observedDate.toLocaleString('default', { month: 'short' });
}

let updateTime = () => {
  calculateResults();
}

  getSubTime = function(aDate) {
    if(aDate.getMonth() == 5 && (aDate.getDate() >= 19 && aDate.getDate() <= 24)) {
      return "(summer solstice)";
    }

    if(aDate.getMonth() == 11 && (aDate.getDate() >= 19 && aDate.getDate() <= 24)) {
      return "(winter solstice)";
    }
    if(aDate.getMonth() == 2 && (aDate.getDate() >= 19 && aDate.getDate() <= 22)) {
      return "(spring equinox)";
    }
    if(aDate.getMonth() == 8 && (aDate.getDate() == 21 || aDate.getDate() == 22 || aDate.getDate() == 23)) {
      return "(autumn equinox)";
    }
    return "";
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
   navigator.geolocation.getCurrentPosition(
    (data) => {
      latInput.value = data.coords.latitude;
      lngInput.value = data.coords.longitude;
      calculateResults();
      console.log(data);
    },
    (error) => {
      console.log(error);
      switch(error.code) {
        case GeolocationPositionError.PERMISSION_DENIED: {
          $("#inputs").css({"visibility":"visible"});
          break;
        }
      }
    }
  )
}

/*
* normalise an angle to the rangle [-PI, PI];
*/ 
let normaliseAngle = (aAngle) => {
  return Math.atan2(Math.sin(aAngle), Math.cos(aAngle));
}

getCurrentLocation();
calculateResults();
// setSunSize();

  sAnimator = new animator();
  sAnimator.addLoop("danceloop", 6);
  sAnimator.addLoop("handraisedloop", 2);
  sAnimator.addLoop("raisehands", 4);
  sAnimator.loadAnimation("danceloop");
  sAnimator.play();
};