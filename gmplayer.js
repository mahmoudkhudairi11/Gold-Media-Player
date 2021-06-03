const GoldMedia = {
  get version() {
    return "1.0"
  }
}
GoldMedia.randomHex = function (len) {
  var content = "0123456789ABCDEF";
  return Array(len).fill().map(() => content[Math.floor(Math.random() * content.length)]).join("");
}
GoldMedia.Player = function (config) {
  if (!(this instanceof GoldMedia.Player)) throw new TypeError("[GMPLAYER]: To use GMPlayer create an object as constructor: 'new Goldmedia.Player()'");
  const TARGET = this;
  TARGET.__defineGetter__(Symbol.toStringTag, function () {
    return "gmplayer"
  });
  const CONFIG = {...config};
  let PARENT;
  if (!((PARENT = config.parent) instanceof HTMLDivElement) && !((PARENT = document.querySelector(config.parent)) instanceof HTMLDivElement)) {
    throw new TypeError("[GMPLAYER]: No Div Parent Selected");
  }
  if (!config.source) return;
  const PLAYERID = GoldMedia.randomHex(6);
  const SVG = {
    PLAY:       `<svg version="1.1" viewBox="0 0 36 36" width="100%" height="100%"><path d="M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z"></path></svg>`,
    PAUSE:      `<svg version="1.1" viewBox="0 0 36 36" width="100%" height="100%"><path d="M 12,26 16,26 16,10 12,10 z M 21,26 25,26 25,10 21,10 z"></path></svg>`,
    REPLAY:     `<svg version="1.1" viewBox="0 0 36 36" width="100%" height="100%"><path d="M 18,11 V 7 l -5,5 5,5 v -4 c 3.3,0 6,2.7 6,6 0,3.3 -2.7,6 -6,6 -3.3,0 -6,-2.7 -6,-6 h -2 c 0,4.4 3.6,8 8,8 4.4,0 8,-3.6 8,-8 0,-4.4 -3.6,-8 -8,-8 z"></path></svg>`,
    MUTE:       `<svg version="1.1" viewBox="0 0 36 36" width="100%" height="100%"><defs><clipPath><path d="m 14.35,-0.14 -5.86,5.86 20.73,20.78 5.86,-5.91 z"></path><path d="M 7.07,6.87 -1.11,15.33 19.61,36.11 27.80,27.60 z"></path><path d="M 9.09,5.20 6.47,7.88 26.82,28.77 29.66,25.99 z" transform="translate(0, 0)"></path></clipPath><clipPath><path d="m -11.45,-15.55 -4.44,4.51 20.45,20.94 4.55,-4.66 z" transform="translate(0, 0)"></path></clipPath></defs><path d="M8,21 L12,21 L17,26 L17,10 L12,15 L8,15 L8,21 Z M19,14 L19,22 C20.48,21.32 21.5,19.77 21.5,18 C21.5,16.26 20.48,14.74 19,14 ZM19,11.29 C21.89,12.15 24,14.83 24,18 C24,21.17 21.89,23.85 19,24.71 L19,26.77 C23.01,25.86 26,22.28 26,18 C26,13.72 23.01,10.14 19,9.23 L19,11.29 Z"></path></svg>`,
    UNMUTE:     `<svg version="1.1" viewBox="0 0 36 36" width="100%" height="100%"><defs><clipPath><path d="m 14.35,-0.14 -5.86,5.86 20.73,20.78 5.86,-5.91 z"></path><path d="M 7.07,6.87 -1.11,15.33 19.61,36.11 27.80,27.60 z"></path><path d="M 9.09,5.20 6.47,7.88 26.82,28.77 29.66,25.99 z" transform="translate(0, 0)"></path></clipPath><clipPath><path d="m -11.45,-15.55 -4.44,4.51 20.45,20.94 4.55,-4.66 z" transform="translate(0, 0)"></path></clipPath></defs><path d="M8,21 L12,21 L17,26 L17,10 L12,15 L8,15 L8,21 Z M19,14 L19,22 C20.48,21.32 21.5,19.77 21.5,18 C21.5,16.26 20.48,14.74 19,14 ZM19,11.29 C21.89,12.15 24,14.83 24,18 C24,21.17 21.89,23.85 19,24.71 L19,26.77 C23.01,25.86 26,22.28 26,18 C26,13.72 23.01,10.14 19,9.23 L19,11.29 Z"></path><path d="M 9.25,9 7.98,10.27 24.71,27 l 1.27,-1.27 Z"></path></svg>`,
    SETTINGS:   `<svg version="1.1" viewBox="0 0 36 36" width="100%" height="100%"><path d="m 23.94,18.78 c .03,-0.25 .05,-0.51 .05,-0.78 0,-0.27 -0.02,-0.52 -0.05,-0.78 l 1.68,-1.32 c .15,-0.12 .19,-0.33 .09,-0.51 l -1.6,-2.76 c -0.09,-0.17 -0.31,-0.24 -0.48,-0.17 l -1.99,.8 c -0.41,-0.32 -0.86,-0.58 -1.35,-0.78 l -0.30,-2.12 c -0.02,-0.19 -0.19,-0.33 -0.39,-0.33 l -3.2,0 c -0.2,0 -0.36,.14 -0.39,.33 l -0.30,2.12 c -0.48,.2 -0.93,.47 -1.35,.78 l -1.99,-0.8 c -0.18,-0.07 -0.39,0 -0.48,.17 l -1.6,2.76 c -0.10,.17 -0.05,.39 .09,.51 l 1.68,1.32 c -0.03,.25 -0.05,.52 -0.05,.78 0,.26 .02,.52 .05,.78 l -1.68,1.32 c -0.15,.12 -0.19,.33 -0.09,.51 l 1.6,2.76 c .09,.17 .31,.24 .48,.17 l 1.99,-0.8 c .41,.32 .86,.58 1.35,.78 l .30,2.12 c .02,.19 .19,.33 .39,.33 l 3.2,0 c .2,0 .36,-0.14 .39,-0.33 l .30,-2.12 c .48,-0.2 .93,-0.47 1.35,-0.78 l 1.99,.8 c .18,.07 .39,0 .48,-0.17 l 1.6,-2.76 c .09,-0.17 .05,-0.39 -0.09,-0.51 l -1.68,-1.32 0,0 z m -5.94,2.01 c -1.54,0 -2.8,-1.25 -2.8,-2.8 0,-1.54 1.25,-2.8 2.8,-2.8 1.54,0 2.8,1.25 2.8,2.8 0,1.54 -1.25,2.8 -2.8,2.8 l 0,0 z"></path></svg>`,
    FULLSCREEN: `<svg version="1.1" viewBox="0 0 36 36" width="100%" height="100%"><g><path d="m 10,16 2,0 0,-4 4,0 0,-2 L 10,10 l 0,6 0,0 z"></path></g><g><path d="m 20,10 0,2 4,0 0,4 2,0 L 26,10 l -6,0 0,0 z"></path></g><g><path d="m 24,24 -4,0 0,2 L 26,26 l 0,-6 -2,0 0,4 0,0 z"></path></g><g><path d="M 12,20 10,20 10,26 l 6,0 0,-2 -4,0 0,-4 0,0 z"></path></g></svg>`,
    WINDOWN:    `<svg version="1.1" viewBox="0 0 36 36" width="100%" height="100%"><g><path d="m 14,14 -4,0 0,2 6,0 0,-6 -2,0 0,4 0,0 z"></path></g><g><path d="m 22,14 0,-4 -2,0 0,6 6,0 0,-2 -4,0 0,0 z"></path></g><g><path d="m 20,26 2,0 0,-4 4,0 0,-2 -6,0 0,6 0,0 z"></path></g><g><path d="m 10,22 4,0 0,4 2,0 0,-6 -6,0 0,2 0,0 z"></path></g></svg>`
  };
  const BODY =
  `<div class="gmplayer" data-player_id="${PLAYERID}">
  <div class="gmplayer-head"></div>
  <div class="gmplayer-body">
    <div class="gmplayer-p">
      <video src="${config.source}" ${config.autoplay ? "autoplay" : ""}></video>
    </div>
    <div class="gmplayer-ls gmplayer-s-h"><div class="gmplayer-ls-p"></div><div class="gmplayer-ls-p"></div><div class="gmplayer-ls-p"></div><div class="gmplayer-ls-p"></div><div class="gmplayer-ls-p"></div><div class="gmplayer-ls-p"></div><div class="gmplayer-ls-p"></div><div class="gmplayer-ls-p"></div><div class="gmplayer-ls-p"></div><div class="gmplayer-ls-p"></div><div class="gmplayer-ls-p"></div><div class="gmplayer-ls-p"></div></div>
    <div class="gmplayer-m"></div>
    <div class="gmplayer-sb">
      <div class="gmplayer-sb-c">
        <div class="gmplayer-bar gmplayer-bar-b"></div>
        <div class="gmplayer-bar gmplayer-bar-t"></div>
      </div>
    </div>
    <div class="gmplayer-cb">
      <div class="gmplayer-cb-l">
        <div class="gmplayer-btn gmplayer-btn-p">${SVG.PLAY}</div>
        <div class="gmplayer-va">
          <div class="gmplayer-btn gmplayer-btn-m">${SVG.MUTE}</div>
          <div class="gmplayer-vba">
            <div class="gmplayer-vb"></div>
            <div class="gmplayer-vv"></div>
          </div>
        </div>
        <div class="gmplayer-ta">
          <span class="gmplayer-t-c" data-mode="elapsed">00:00</span><span class="gmplayer-t-h"></span> / <span class="gmplayer-t-d">--:--</span>
        </div>
      </div>
      <div class="gmplayer-cb-r">
        <div class="gmplayer-btn gmplayer-btn-f">${SVG.FULLSCREEN}</div>
      </div>
    </div>
  </div>
  </div>`;
  PARENT.innerHTML = BODY;
  var parentStyle = getComputedStyle(PARENT);
  if (parseInt(parentStyle.width) == 0) {
    PARENT.style.width = "640px";
  }
  if (parseInt(parentStyle.height) == 0) {
    PARENT.style.height = "360px";
  }
  let
    GMPlayer       = PARENT.querySelector(`.gmplayer[data-player_id="${PLAYERID}"]`),
    playerHaed     = GMPlayer.querySelector(".gmplayer-head"),
    playerBody     = GMPlayer.querySelector(".gmplayer-body"),
    video          = GMPlayer.querySelector(".gmplayer-p video"),
    loadingSpinner = GMPlayer.querySelector(".gmplayer-ls"),
    overlayMask    = GMPlayer.querySelector(".gmplayer-m"),
    seekBar        = GMPlayer.querySelector(".gmplayer-sb"),
    bufferBar      = seekBar.querySelector(".gmplayer-bar-b"),
    timeBar        = seekBar.querySelector(".gmplayer-bar-t"),
    controlsBar    = GMPlayer.querySelector(".gmplayer-cb"),
    leftControls   = controlsBar.querySelector(".gmplayer-cb-l"),
    rightControls  = controlsBar.querySelector(".gmplayer-cb-r"),
    playBtn        = leftControls.querySelector(".gmplayer-btn-p"),
    volumeArea     = leftControls.querySelector(".gmplayer-va"),
    muteBtn        = volumeArea.querySelector(".gmplayer-btn-m"),
    volumeBarArea  = volumeArea.querySelector(".gmplayer-vba"),
    volumeBar      = volumeArea.querySelector(".gmplayer-vb"),
    volumeValue    = volumeArea.querySelector(".gmplayer-vv"),
    timeArea       = leftControls.querySelector(".gmplayer-ta"),
    currentTime    = timeArea.querySelector(".gmplayer-t-c"),
    hoverTime      = timeArea.querySelector(".gmplayer-t-h"),
    durationTime   = timeArea.querySelector(".gmplayer-t-d"),
    fullscreenBtn  = rightControls.querySelector(".gmplayer-btn-f");
  if (config.type == "mp4") {
    video.src = config.source;
    loadingSpinner.classList.remove("gmplayer-s-h");
  }
  video.addEventListener("loadeddata", function () {
    if (this.readyState == 4) PlayerReady();
  });
  function PlayerReady() {
    // Functions
    function playPause() {
      if (video.paused) {
        video.play();
        playerBody.classList.remove("gmplayer-s-fa");
      } else {
        video.pause();
        playerBody.classList.add("gmplayer-s-fa");
      }
    }
    function setMovingClick(element, callback, finalCallback, ondown = null, onup = null, onabort = null) {
      var finalResult = null;
      var active = null;
      function moveFunction(e) {
        var rect = element.getBoundingClientRect();
        var bord = parseInt(getComputedStyle(element).borderWidth);
        if (e.x - bord <= rect.x) {
          callback(finalResult = 0);
        } else if (e.x + bord >= rect.x + rect.width) {
          callback(finalResult = 1);
        } else {
          callback(finalResult = (e.x - bord - rect.x) / (rect.width - 2 * bord));
        }
      }
      element.addEventListener("mousedown", function (e) {
        if (e.button != 0) return;
        active = true;
        window.addEventListener("mousemove", moveFunction);
        if (active) {
          if (ondown) ondown();
        }
      });
      window.addEventListener("mouseup", function () {
        if (!active) return;
        window.removeEventListener("mousemove", moveFunction);
        if (onup) onup();
        if (finalCallback) finalCallback(finalResult);
        active = false;
      });
      window.addEventListener("blur", function () {
        if (!active) return;
        window.removeEventListener("mousemove", moveFunction);
        if (onup) onup();
        if (finalCallback) finalCallback(finalResult);
        active = false;
      });
      window.addEventListener("keydown", function (e) {
        if (e.code != "Escape" || !active) return;
        window.removeEventListener("mousemove", moveFunction);
        if (onabort) onabort();
        active = false;
      });
    }
    function getBufPos() {
      var buf = video.buffered;
      if (buf.length <= 1) return buf.length - 1;
      var ct = video.currentTime;
      for (let i = 0; i < buf.length; i++) {
        if (ct >= buf.start(i) && ct <= buf.end(i)) return i;
      }
    }
    function secToHMS(sec) {
      var h = Math.floor(sec / 3600);
      var m = Math.floor((sec - (h * 3600)) / 60);
      var s = Math.round(sec - (h * 3600) - (m * 60));
      if (s > 59) {s = 0; m++}
      if (m > 59) {m = 0; h++}
      if (m < 10) m = `0${m}`;
      if (s < 10) s = `0${s}`;
      return `${h ? `${h}:` : ""}${m}:${s}`;
    }
    function setCurrentTime() {
      currentTime.innerText = secToHMS(currentTime.dataset["mode"] == "left" ? video.duration - video.currentTime : video.currentTime);
    }
    var fullscreenEnabled = false;
    function isFullscreen() {
      if (document.fullscreenElement === playerBody || document.webkitFullscreenElement === playerBody || document.mozFullScreenElement === playerBody/*  || document.msFullscreenElement === playerBody */) {
        return true;
      } else {
        return false;
      }
    }
    function goFullscreen() {
      if (!fullscreenEnabled) return false;
      if (playerBody.requestFullscreen) {
        return playerBody.requestFullscreen();
      } else if (playerBody.webkitRequestFullscreen) {
        return playerBody.webkitRequestFullscreen();
      } else if (playerBody.mozRequestFullScreen) {
        return playerBody.mozRequestFullScreen();
      }/* else if (playerBody.msRequestFullscreen) {
        playerBody.msRequestFullscreen();
      }*/
    }
    function exitFullscreen() {
      if (document.exitFullscreen) {
        return document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        return document.webkitExitFullscreen();
      }/* else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }*/
    }
    function toggleFullscreen() {
      if (isFullscreen()) {
        exitFullscreen();
      } else {
        goFullscreen();
      }
    }
    function changeFullscreenBtnIcon() {
      if (isFullscreen()) {
        fullscreenBtn.innerHTML = SVG.WINDOWN;
      } else {
        fullscreenBtn.innerHTML = SVG.FULLSCREEN;
      }
    }
    seekBar.addEventListener("click", function (e) {
      video.currentTime = (e.offsetX / this.clientWidth) * video.duration
    });
    var wasPaused = null;
    setMovingClick(seekBar, function (v) {
      timeBar.style.width = `${v * 100}%`;
      timeArea.classList.add("gmplayer-s-h");
      hoverTime.innerText = secToHMS(v * video.duration);
    }, function (v) {
      video.currentTime = v * video.duration;
    }, function () {
      wasPaused = video.paused;
      video.pause();
      seekBar.classList.add("gmplayer-s-a");
      video.classList.add("gmplayer-v-s");
      playerBody.classList.add("gmplayer-s-fa");
      timeArea.classList.add("gmplayer-s-h");
    }, function () {
      if (!wasPaused) video.play();
      seekBar.classList.remove("gmplayer-s-a");
      video.classList.remove("gmplayer-v-s");
      playerBody.classList.remove("gmplayer-s-fa");
      timeArea.classList.remove("gmplayer-s-h");
    }, function () {
      timeBar.style.width = `${(video.currentTime / video.duration) * 100}%`;
      seekBar.classList.remove("gmplayer-s-a");
      video.classList.remove("gmplayer-v-s");
      playerBody.classList.remove("gmplayer-s-fa");
    });
    seekBar.addEventListener("mouseover", function () {
      timeArea.classList.add("gmplayer-s-h");
    });
    seekBar.addEventListener("mousemove", function (e) {
      hoverTime.innerText = secToHMS((e.offsetX / this.clientWidth) * (video.duration ? video.duration : 0));
    });
    seekBar.addEventListener("mouseleave", function () {
      timeArea.classList.remove("gmplayer-s-h");
    });
    playBtn.addEventListener("click", playPause);
    var lastVideoVolume;
    muteBtn.addEventListener("click", function () {
      if (video.volume == 0) {
        video.volume = lastVideoVolume ? lastVideoVolume : 1;
      } else {
        lastVideoVolume = video.volume;
        video.volume = 0;
      }
    });
    volumeBarArea.addEventListener("click", function (e) {
      video.volume = e.offsetX / this.clientWidth;
    });
    setMovingClick(volumeBarArea, function (v) {
      video.volume = v;
    }, null, function () {
      volumeArea.classList.add("gmplayer-s-a");
      playerBody.classList.add("gmplayer-s-fa");
    }, function () {
      volumeArea.classList.remove("gmplayer-s-a");
      playerBody.classList.remove("gmplayer-s-fa");
    }, function () {
      volumeArea.classList.remove("gmplayer-s-a");
      playerBody.classList.remove("gmplayer-s-fa");
    });
    currentTime.addEventListener("dblclick", function () {
      if (this.dataset["mode"] == "left") {
        this.dataset["mode"] = "elapsed";
      } else {
        this.dataset["mode"] = "left";
      }
      setCurrentTime();
    });
    if (!document.fullscreenEnabled && !playerBody.requestFullscreen && !playerBody.webkitRequestFullscreen && playerBody.mozRequestFullScreen && playerBody.msRequestFullscreen) {
      fullscreenBtn.title = "Fullscreen Mode Blocked By Host";
      fullscreenBtn.classList.add("gmplayer-btn-s-d");
      
    } else if (config.blockFullscreen) {
      fullscreenBtn.title = "Fullscreen Mode Blocked in Player Initialization Config";
      fullscreenBtn.classList.add("gmplayer-btn-s-d");
    } else {
      fullscreenEnabled = true;
    }
    fullscreenBtn.addEventListener("click", toggleFullscreen);
    if (fullscreenEnabled) {
      document.addEventListener("fullscreenchange", changeFullscreenBtnIcon);
      document.addEventListener("webkitfullscreenchange", changeFullscreenBtnIcon);
      document.addEventListener("mozfullscreenchange", changeFullscreenBtnIcon);
      //document.addEventListener("msfullscreenchange", changeFullscreenBtnIcon);
    }
    // Video Changes Events
    video.addEventListener("canplay", function () {
      setCurrentTime();
      durationTime.innerText = secToHMS(this.duration);
      loadingSpinner.classList.add("gmplayer-s-h");
      var bp = getBufPos();
      bufferBar.style.width = `${((bp >= 0 ? video.buffered.end(bp) : 0) / video.duration) * 100}%`;
    });
    video.addEventListener("click", playPause);
    overlayMask.addEventListener("click", playPause);
    video.addEventListener("timeupdate", function () {
      var bp = getBufPos();
      bufferBar.style.width = `${((bp >= 0 ? video.buffered.end(bp) : 0) / video.duration) * 100}%`;
      timeBar.style.width = `${(video.currentTime / video.duration) * 100}%`;
      setCurrentTime();
    });
    video.addEventListener("progress", function () {
      var bp = getBufPos();
      bufferBar.style.width = `${((bp >= 0 ? video.buffered.end(bp) : 0) / video.duration) * 100}%`;
    });
    video.addEventListener("waiting", function () {
      loadingSpinner.classList.remove("gmplayer-s-h");
    });
    video.addEventListener("playing", function () {
      loadingSpinner.classList.add("gmplayer-s-h");
    });
    video.addEventListener("seeking", function () {
      timeBar.classList.add("gmplayer-bar-e-sk");
      loadingSpinner.classList.remove("gmplayer-s-h");
      if (video.paused) {
        playBtn.innerHTML = SVG.PLAY;
      } else {
        playBtn.innerHTML = SVG.PAUSE;
      }
    });
    video.addEventListener("seeked", function () {
      timeBar.classList.remove("gmplayer-bar-e-sk");
      loadingSpinner.classList.add("gmplayer-s-h");
    });
    video.addEventListener("play", function () {
      playBtn.innerHTML = SVG.PAUSE;
    });
    video.addEventListener("pause", function () {
      playBtn.innerHTML = SVG.PLAY;
    });
    video.addEventListener("volumechange", function () {
      if (this.volume == 0) {
        muteBtn.innerHTML = SVG.UNMUTE;
      } else {
        muteBtn.innerHTML = SVG.MUTE;
      }
      volumeValue.style.width = `${video.volume / 1 * 100}%`;
    });
    video.addEventListener("pause", function () {
      playerBody.classList.remove("gmplayer-s-s");
    });
    video.addEventListener("ended", function () {
      playBtn.innerHTML = SVG.REPLAY;
      playerBody.classList.remove("gmplayer-s-s");
    });
    // Player Sleeping
    var lastTimeout;
    function isHoverControls() {
      return seekBar.matches(":hover") || controlsBar.matches(":hover");
    }
    function setHideTime() {
      playerBody.classList.remove("gmplayer-s-s");
      if (!video.paused && !isHoverControls()) {
        clearTimeout(lastTimeout);
        lastTimeout = setTimeout(function () {
          if (!video.paused && !isHoverControls()) playerBody.classList.add("gmplayer-s-s");
        }, 1500);
      }
    }
    video.addEventListener("canplay", setHideTime, {once: true});
    video.addEventListener("mousemove", setHideTime);
    seekBar.addEventListener("mouseenter", function () {
      clearTimeout(lastTimeout);
      playerBody.classList.remove("gmplayer-s-s");
    });
    controlsBar.addEventListener("mouseenter", function () {
      clearTimeout(lastTimeout);
      playerBody.classList.remove("gmplayer-s-s");
    });
    playerBody.addEventListener("mouseleave", function () {
      if (!video.paused) {
        playerBody.classList.add("gmplayer-s-s");
      }
    });
    // Player Addition Configs
    if (config.disableContextMenu) {
      playerBody.addEventListener("contextmenu", function (e) {
        e.preventDefault();
        return false;
      });
    }
    if (config.targetControls) {
      // Methods
      TARGET.play = function () {
        return video.paused ? video.play() : false;
      }
      TARGET.pause = function () {
        return video.paused ? false : video.pause();
      }
      TARGET.playToggle = function () {
        return video.paused ? video.play() : video.pause();
      }
      TARGET.mute = function () {
        if (video.volume > 0) {
          lastVideoVolume = video.volume;
          return video.volume = 0;
        } else {
          return false;
        }
      }
      TARGET.unmute = function () {
        if (video.volume == 0) {
          return video.volume = lastVideoVolume ? lastVideoVolume : 1;
        } else {
          return false;
        }
      }
      TARGET.muteToggle = function () {
        if (video.volume == 0) {
          return video.volume = lastVideoVolume ? lastVideoVolume : 1;
        } else {
          lastVideoVolume = video.volume;
          return video.volume = 0;
        }
      }
      TARGET.goFullscreen = function () {
        if (!isFullscreen()) {
          return goFullscreen();
        } else {
          return false;
        }
      }
      TARGET.exitFullscreen = function () {
        if (isFullscreen()) {
          return exitFullscreen();
        } else {
          return false;
        }
      }
      TARGET.fullscreenToggle = function () {
        if (isFullscreen()) {
          return exitFullscreen();
        } else {
          return goFullscreen();
        }
      }
      // Informations (Getters and Setters)
      TARGET.__defineGetter__("currentTime", function() {
        return video.currentTime;
      });
      TARGET.__defineGetter__("duration", function() {
        return video.duration;
      });
      TARGET.__defineGetter__("source", function() {
        if (config.source.match(/^.+?:\/+[^\/]+.*$/)) {
          return new URL(config.source).href;
        } else if (config.source.match(/^(\/|\\)/)) {
          return new URL(`${location.origin}${config.source}`).href;
        } else {
          return new URL(`${location.href}${config.source}`).href;
        }
      });
    }
  }
}
