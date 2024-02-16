
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
      lLeft = document.body.clientWidth * 0.1;
      $('#wheel').css({"width": lSize + "px", "height": lSize + "px", "left":lLeft + "px", "top":(0.5 * ($("#background").height() - lSize))   + "px"});
      const top = $("#wheel").last().offset().top ;
      $("#mainContainer").css({"width":(document.body.clientWidth - lSize - lLeft - 30) + "px", "height":lSize + "px", "top":top + "px"}); 
      $("#observedTimeMarker").css({"top":(top + lSize * 0.5) + "px", "left": $("#wheel").last().offset().left + lSize + "px", "width":$("main").css("margin-left")});
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
setSunSize();

/////////////////////////////////////////
// -------  touch and clicks  -------- //
/////////////////////////////////////////
(function() {
  var init, rotate, start, stop,
    active = false,
    startAngle = 0,
    lastAngleRotated = 0,
    rotationWheel = 0,
    rotationNowMarker = 0,
    isInteractingWithWheel = false,
    lastRotateFrame = Date.now(),
    speedWheel = 0,
    idAnimationMomentum = -1,
    timeoutSpeedIds = [],
    center = {
      x: 0,
      y: 0
    },
    R2D = 180 / Math.PI,
    rot = document.getElementById('wheel');

  $("#summerMarker").on("touchend mouseup", function() {
      if(isInteractingWithWheel) {return;}

      startAnimation(0);
  })

  $("#winterMarker").on("touchend mouseup", function() {
    if(isInteractingWithWheel) {return;}
      startAnimation(Math.PI);
  })

  $("#autumnMarker").on("touchend mouseup", function() {
    if(isInteractingWithWheel) {return;}
      startAnimation(Math.PI * 1.5);
  })

  $("#springMarker").on("touchend mouseup", function() {
    if(isInteractingWithWheel) {return;}
      startAnimation(Math.PI * 0.5);
  })

  $("#nowMarker").on("click", function() {
    if(isInteractingWithWheel) {return;}
      startAnimation(-rotationNowMarker);
  })

  init = function() {
    setInitRotation();
    rot.addEventListener("mousedown", start, false);
    rot.addEventListener("touchstart", start, false);

    $(document).bind('mousemove', function(event) {
      if (active === true) {
        event.preventDefault();
        rotate(event);
      }
    });

    $(document).bind('touchmove', function(event) {
      if (active === true) {
        event.preventDefault();
        if(event.touches) {
          event = event.touches[0];
        }
        rotate(event);
      }
    });

    $(document).bind('mouseup', function(event) {
      event.preventDefault();
      stop(event);
    });

    $(document).bind('touchend', function(event) {
      event.preventDefault();
      if(event.touches) {
        event = event.touches[0];
      }
      stop(event);
    });

  };

  setInitRotation = function() {
    let now = new Date();
    const solstice = solsticeDate;
    // const now2 = new Date(now.getFullYear(), 2, 6, 0, 0, 0, 0);
    
    const diffTime = solstice - now;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    const brutAngle = -2 * Math.PI * diffDays / 365;
    rotationNowMarker = brutAngle;
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

    clearInterval(idAnimationMomentum);
    speedWheel = 0;

    e.preventDefault();
    if(e.touches) {
      e = e.touches[0];
    }
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
    lastRotateFrame = Date.now();
    return active = true;
  };

  rotate = function(e) {

    $("#svgSunYellow").removeClass("withTransition");
    isInteractingWithWheel = true;
    var x = e.clientX - center.x,
      y = e.clientY - center.y,
      d = Math.atan2(y, x);

    var frameNow = Date.now();
    const timeSinceLastRotate = Math.max((lastRotateFrame - frameNow) / 1000, 0.01);
    lastRotateFrame = frameNow;

    applyRotation(d - startAngle);
    var newAngle = d - startAngle;
    let currentSpeed = (newAngle - lastAngleRotated) / timeSinceLastRotate;
    if(Math.abs(currentSpeed) < 0.3) {
      currentSpeed = 0;
    }

    let timeoutTime = 0;
    if(Math.abs(currentSpeed) > 7) {
      for (i in timeoutSpeedIds) {
        clearTimeout(timeoutSpeedIds[i]);
      }
      timeoutSpeedIds = [];
    }
    else {
      timeoutTime = 50;
    }
    const lThisTimeoutId = setTimeout(function() {

      {const index = timeoutSpeedIds.indexOf(lThisTimeoutId);
      if (index > -1) { // only splice array when item is found
        timeoutSpeedIds.splice(index, 1); // 2nd parameter means remove one item only
      }}

      if(!active) {
        return;
      }
      // prevent getting speed while removing finger.
      if(Math.abs(currentSpeed) > Math.abs(speedWheel)) {
        var lCoeff = 0.7;//Math.min(Math.abs(speedWheel), 1);
        speedWheel = speedWheel * lCoeff + (1 - lCoeff) * currentSpeed;
      }
      else {
        speedWheel = currentSpeed;
      }
    }, timeoutTime);
    timeoutSpeedIds.push(lThisTimeoutId);

    lastAngleRotated = newAngle;
  }

  applyRotation = function(aRotation) {
    // rotation = aRotation;
    let angle = aRotation + rotationWheel + angleToRead;
    $("#summerMarker").css(getCssForAngle(angle));

    $("#springMarker").css(getCssForAngle(angle + Math.PI * 1.5));

    $("#winterMarker").css(getCssForAngle(angle + Math.PI * 1));

    $("#autumnMarker").css(getCssForAngle(angle + Math.PI * 0.5));

    $("#nowMarker").css(getCssForAngle(angle + rotationNowMarker));

    $("#observedMarker").css(getCssForAngle(angleToRead));

    // difference of days between the solstice and the observed date.
    const daysGap = -365 * (aRotation + rotationWheel) / (2 * Math.PI);

    var date = new Date(solsticeDate);
    date.setDate(solsticeDate.getDate() + daysGap);
    observedDate = date;
    updateTime();
  };

  stop = function(e) {
    var frameNow = Date.now();
    const timeSinceLastRotate = Math.max((frameNow - lastRotateFrame) / 1000, 0.01);
    if(timeSinceLastRotate > 0.5) {
      speedWheel = 0;
    }

    rotationWheel += lastAngleRotated;
    $("#svgSunYellow").addClass("withTransition");
    active = false;
    isInteractingWithWheel = false;
    startAnimationMomentum(-speedWheel);
    return ;
  };

  init();

function startAnimationMomentum(speedInit) {

  idAnimationMomentum = setInterval(frame, 20);
  var lastFrame = Date.now();
  
  function frame() {
    var newFrame = Date.now();
    var diffFrames = (lastFrame - newFrame) / 1000; // convert in seconds.
    lastFrame = newFrame;
    if (Math.abs(speedInit) <= 0.01) {
        clearInterval(idAnimationMomentum);
      } else {
        speedInit *= 0.96;
        rotationWheel += speedInit * diffFrames;
        applyRotation(0);
      }
    }

}

function startAnimation(rotationDesired) {
  const rotationInitial = normaliseAngle(rotationWheel);
  let normalisedProgression = 0;
  var id = setInterval(frame, 20);

  function frame() {
    if (normalisedProgression >= 1) {
        rotationWheel = rotationDesired;
        applyRotation(0);
        clearInterval(id);
      } else {
        normalisedProgression += 0.05;
        const smoothedProgression = (0.5 - 0.5 * Math.cos(normalisedProgression * Math.PI));
        rotationWheel = rotationInitial + smoothedProgression * (rotationDesired - rotationInitial);
        applyRotation(0);
      }
    }
}


}).call(this);

};