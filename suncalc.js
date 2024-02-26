
// A $( document ).ready() block.
window.onload = () => {
    
let latInput = document.getElementById('lat');
let lngInput = document.getElementById('lng');

latInput.oninput = () => updateManualButton();
  lngInput.oninput = () => updateManualButton();
  
  function updateManualButton() {
    if (latInput.value.length == 0 || lngInput.value.length == 0) {
      $("buttonmanual").prop('disabled', true); 
    }
    else {
      $("buttonmanual").prop('disabled', true);
      const ldis = $('#buttonmanual').prop('disabled');
      ldis;
    }
  }
  

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
  }
  else { // phone
    lSize = window.outerWidth * 0.8;
    lLeft = (window.outerWidth - lSize) * 0.5;
    // let lTop = - lSize * 0.5;
    $("#mainContainer").css({ "height": "40%" });
    $("h3").css({ "font-size": "1em" });
    $("#dancingSun").css({ "width": lSize + "px", "left": lLeft + "px", "bottom": "5%" });
    $("main").css({ "width": "80%" });
    
    $("#inputs h3").css({"font-size":"1em"})
  }
}

window.addEventListener("resize", setSunSize);

let calculateResults =  () => {

  let resultTopText = document.getElementById('topTimeText');
  let resultSubText = document.getElementById('subTimeText');
  let resultHowMuch = document.getElementById('howmuch');
  let resultHowMuchMore = document.getElementById('howmuchmore');
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
  const minDiffText = (diffMin > 0) ? diffMin + " minutes and " : ""
  resultMoreOrLess.textContent = diff < 0 ? " less" : " more";
  if(diff > 0) {
    $(resultMoreOrLess).addClass("isMore");
  }
  resultHowMuchMore.textContent = minDiffText  + diffSec + " seconds";

  resultSunrise.textContent = getHourTextDromDate(dayLightToday.sunrise);
  resultSunset.textContent = getHourTextDromDate(dayLightToday.sunset);

  resultthanyesterday.textContent = (observedDate.getDate() == todayDate.getDate()) ? "than yesterday.": "each day."

  resultMinSun.textContent = getTextDurationFromSeconds(dayLightDecemberSolstice.dayLightS);
  resultMaxSun.textContent = getTextDurationFromSeconds(dayLightJuneSolstice.dayLightS);

  $("#buttonmanual").on("click", function () {
    locationReceived();
    $("#inputs").css("visibility","hidden")
  })


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
  const lMin = lDate.getMinutes()//.toLocaleString('en-US', {
    // minimumIntegerDigits: 2,
    // useGrouping: false
  // });

  return lH + " hours and " + lMin + " minutes";
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
  
  let locationReceived = () => {
    calculateResults();
    $("#waitingForLocationText").hide();
    $("#speechSun").css({ "visibility": "hidden" });
    $("#speechSunText").css({ "visibility": "hidden" });
    sAnimator.loadAnimation("raisehands").then("handraisedloop");
    setTimeout(function () {
    $("#mainContainer").css("transform", "scaleY(1)");
    }, 750);
  }
    
  let getCurrentLocation = () => {
  
    const lTimer = setTimeout(function () {
      $("#speechSunText").css({ "visibility": "visible" });
    }, 5000)
    
   navigator.geolocation.getCurrentPosition(
     (data) => {
       clearTimeout(lTimer);
      latInput.value = data.coords.latitude;
       lngInput.value = data.coords.longitude;
       console.log(data);
       locationReceived();
       
    },
     (error) => {
       clearTimeout(lTimer);
       $("#speechSunText").css({ "visibility": "visible" });
      console.log(error);
      $("#speechSunText").html("no location, no sun...");
      setTimeout(function () {
        $("#speechSunText").css({ "visibility": "hidden" });
        $("#inputs").css({ "visibility": "visible" });
      }, 3000);
      
      switch(error.code) {
        case GeolocationPositionError.PERMISSION_DENIED: {

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
setSunSize();

  sAnimator = new animator();
  sAnimator.addLoop("danceloop", 6, ".jpg");
  sAnimator.addLoop("handraisedloop", 6, ".jpg");
  sAnimator.addLoop("raisehands", 7, ".jpg");
  sAnimator.loadAnimation("danceloop");
  sAnimator.play();
};