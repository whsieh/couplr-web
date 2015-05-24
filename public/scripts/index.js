(function() {
  $(function() {
    var KEY_SCROLL_MODE, MOUSEWHEEL_SCROLL_MODE, NAV_DOT_SCROLL_MODE, PHONE_HARNESS_CENTERED, PHONE_HARNESS_LOWERED, PHONE_HARNESS_RAISED, SECTION_TRANSITION_TIME, STARTUP_RESET_TIME, currentSection, handleSectionPaging, isCurrentlyScrolling, keyWillScrollDocument, nextSection, phoneHarnessState, previousSection, scrollDelayMsForscrollingMode, scrollPhoneToScreen, scrollToSection, scrollingMode, sectionHeight, sectionNames, sectionOffset, setPhoneHarnessState, stopEventFromPropagating, targetSection, updateNavDots, willTransitionSections;
    if (window.orientation != null) {
      window.location.href = "/mobile";
    }
    NAV_DOT_SCROLL_MODE = 0;
    MOUSEWHEEL_SCROLL_MODE = 1;
    KEY_SCROLL_MODE = 2;
    PHONE_HARNESS_LOWERED = 1;
    PHONE_HARNESS_CENTERED = 2;
    PHONE_HARNESS_RAISED = 3;
    sectionHeight = $("#intro-section").outerHeight();
    sectionNames = ["intro", "matches", "profile", "newsfeed", "signup"];
    currentSection = sectionNames[0];
    isCurrentlyScrolling = true;
    scrollingMode = null;
    targetSection = null;
    phoneHarnessState = PHONE_HARNESS_LOWERED;
    SECTION_TRANSITION_TIME = 800;
    STARTUP_RESET_TIME = 250;
    setTimeout(function() {
      currentSection = "intro";
      updateNavDots(currentSection);
      isCurrentlyScrolling = false;
      $(document).scrollTop(0);
      return $(".left-content, .right-content").css({
        width: "calc(50% - 150px)",
        height: "100%"
      });
    }, STARTUP_RESET_TIME);
    sectionOffset = function(section) {
      return $("#" + section + "-section").offset().top;
    };
    scrollToSection = function(section, mode) {
      if (currentSection === section) {
        return;
      }
      isCurrentlyScrolling = true;
      targetSection = section;
      scrollingMode = mode;
      willTransitionSections(currentSection, targetSection);
      updateNavDots(targetSection);
      return $("body").animate({
        scrollTop: sectionOffset(section)
      }, SECTION_TRANSITION_TIME, "swing", function() {
        currentSection = targetSection;
        return setTimeout((function() {
          return isCurrentlyScrolling = false;
        }), scrollDelayMsForscrollingMode(mode));
      });
    };
    setPhoneHarnessState = function(state) {
      if (phoneHarnessState === state) {
        return;
      }
      phoneHarnessState = state;
      if (phoneHarnessState === PHONE_HARNESS_LOWERED) {
        return $("#iphone-container").animate({
          top: (sectionHeight - 300) + "px"
        }, SECTION_TRANSITION_TIME);
      } else if (phoneHarnessState === PHONE_HARNESS_CENTERED) {
        return $("#iphone-container").animate({
          top: ((sectionHeight / 2) - 300) + "px"
        }, SECTION_TRANSITION_TIME);
      } else if (phoneHarnessState === PHONE_HARNESS_RAISED) {
        return $("#iphone-container").animate({
          top: "-300px"
        }, SECTION_TRANSITION_TIME);
      }
    };
    $("body").on({
      mousewheel: (function(e) {
        if (!isCurrentlyScrolling) {
          handleSectionPaging(currentSection, MOUSEWHEEL_SCROLL_MODE, e.originalEvent.deltaY < 0, e.originalEvent.deltaY > 0);
        }
        return stopEventFromPropagating(e);
      }),
      keydown: (function(e) {
        if (keyWillScrollDocument(e)) {
          if (!isCurrentlyScrolling) {
            handleSectionPaging(currentSection, KEY_SCROLL_MODE, e.which === 38, e.which === 40 || e.which === 32);
          }
          return stopEventFromPropagating(e);
        }
      })
    });
    handleSectionPaging = function(atSection, mode, shouldScrollUp, shouldScrollDown) {
      var target;
      if (!(shouldScrollUp ^ shouldScrollDown)) {
        return;
      }
      if (shouldScrollUp) {
        target = previousSection(atSection);
      } else if (shouldScrollDown) {
        target = nextSection(atSection);
      }
      return scrollToSection(target, mode);
    };
    scrollDelayMsForscrollingMode = function(mode) {
      if (mode === NAV_DOT_SCROLL_MODE) {
        return 0;
      } else if (mode === KEY_SCROLL_MODE) {
        return 50;
      } else if (mode === MOUSEWHEEL_SCROLL_MODE) {
        return 500;
      }
      return 0;
    };
    stopEventFromPropagating = function(e) {
      e.preventDefault();
      return e.stopPropagation();
    };
    keyWillScrollDocument = function(e) {
      return [32, 38, 40].indexOf(e.which) !== -1;
    };
    nextSection = function(section) {
      var currentSectionIndex;
      currentSectionIndex = sectionNames.indexOf(section);
      if (currentSectionIndex !== -1) {
        return sectionNames[Math.min(sectionNames.length - 1, currentSectionIndex + 1)];
      }
      return section;
    };
    previousSection = function(section) {
      var currentSectionIndex;
      currentSectionIndex = sectionNames.indexOf(section);
      if (currentSectionIndex !== -1) {
        return sectionNames[Math.max(0, currentSectionIndex - 1)];
      }
      return section;
    };
    updateNavDots = function(section) {
      var currentSectionIndex;
      currentSectionIndex = sectionNames.indexOf(section);
      if (currentSectionIndex !== -1) {
        $(".nav-dot").attr("class", "nav-dot");
        return $("#" + sectionNames[currentSectionIndex] + "-nav-dot").attr("class", "nav-dot active-nav-dot");
      }
    };
    scrollPhoneToScreen = function(screen) {
      if (screen === "matches") {
        return $("#iphone-screen-container").animate({
          scrollLeft: "0px"
        }, SECTION_TRANSITION_TIME);
      } else if (screen === "profile") {
        return $("#iphone-screen-container").animate({
          scrollLeft: "263px"
        }, SECTION_TRANSITION_TIME);
      } else if (screen === "newsfeed") {
        return $("#iphone-screen-container").animate({
          scrollLeft: "526px"
        }, SECTION_TRANSITION_TIME);
      }
    };
    willTransitionSections = function(fromSection, toSection) {
      if (toSection !== "intro" && toSection !== "signup") {
        setPhoneHarnessState(PHONE_HARNESS_CENTERED);
        $("#iphone-cover").fadeOut(SECTION_TRANSITION_TIME);
      } else if (toSection === "intro") {
        setPhoneHarnessState(PHONE_HARNESS_LOWERED);
        $("#iphone-cover").fadeIn(SECTION_TRANSITION_TIME);
      } else if (toSection === "signup") {
        setPhoneHarnessState(PHONE_HARNESS_RAISED);
        $("#iphone-cover").fadeIn(SECTION_TRANSITION_TIME);
      }
      if (toSection !== "intro") {
        return scrollPhoneToScreen(toSection);
      }
    };
    $(".nav-dot").click(function(e) {
      var target;
      target = e.target.id.replace("-nav-dot", "");
      if (!isCurrentlyScrolling) {
        return scrollToSection(target, NAV_DOT_SCROLL_MODE);
      }
    });
    $("#nav-dots-container").css({
      top: "calc(50% - 52px)"
    });
    return $(window).resize(function() {
      return sectionHeight = $("#intro-section").outerHeight();
    });
  });

}).call(this);
