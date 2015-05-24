(function() {
  $(function() {
    var animateSectionIndexWithGuard, animationQueues, computeCurrentSectionIndex, currentThreshold, hideIntroSection, hideMatchSection, hideNewsfeedSection, hideProfileSection, i, index, len, makeContentSectionAnimator, previousSectionIndex, previousThreshold, ref, revealIntroSection, revealMatchSection, revealNewsfeedSection, revealProfileSection, scrollViewDidTransition, sectionId, sectionIds, sectionOffsets;
    sectionIds = ["#intro-section", "#match-section", "#profile-section", "#newsfeed-section", "#signup-section"];
    sectionOffsets = [];
    ref = sectionIds.slice().splice(1);
    for (index = i = 0, len = ref.length; i < len; index = ++i) {
      sectionId = ref[index];
      previousThreshold = $(sectionIds[index]).offset().top;
      currentThreshold = $(sectionId).offset().top;
      sectionOffsets.push((previousThreshold + currentThreshold) / 2);
    }
    computeCurrentSectionIndex = function() {
      var j, offset;
      offset = document.body.scrollTop;
      for (index = j = 0; j <= 3; index = ++j) {
        if (offset < sectionOffsets[index]) {
          return index;
        }
      }
      return 4;
    };
    previousSectionIndex = computeCurrentSectionIndex();
    animationQueues = [
      {
        reveal: false,
        hide: false
      }, {
        reveal: false,
        hide: false
      }, {
        reveal: false,
        hide: false
      }, {
        reveal: false,
        hide: false
      }, {
        reveal: false,
        hide: false
      }
    ];
    $(window).scroll(function() {
      var currentSectionIndex;
      currentSectionIndex = computeCurrentSectionIndex();
      if (previousSectionIndex !== currentSectionIndex) {
        scrollViewDidTransition(previousSectionIndex, currentSectionIndex);
        return previousSectionIndex = currentSectionIndex;
      }
    });
    makeContentSectionAnimator = function(index, action) {
      return function() {
        return animateSectionIndexWithGuard(index, action, function(onComplete) {
          return $(sectionIds[index].replace(/section/, "iphone-container")).animate({
            "margin-top": action === "reveal" ? "20px" : "0px",
            "opacity": action === "reveal" ? 1 : 0
          }, 750, onComplete);
        });
      };
    };
    revealIntroSection = function() {
      return animateSectionIndexWithGuard(0, "reveal", function(onComplete) {
        return $("#intro-section").animate({
          "padding-top": "20px",
          "opacity": 1
        }, 750, onComplete);
      });
    };
    hideIntroSection = function() {
      return animateSectionIndexWithGuard(0, "hide", function(onComplete) {
        return $("#intro-section").animate({
          "padding-top": "0px",
          "opacity": 0
        }, 750, onComplete);
      });
    };
    revealMatchSection = makeContentSectionAnimator(1, "reveal");
    hideMatchSection = makeContentSectionAnimator(1, "hide");
    revealProfileSection = makeContentSectionAnimator(2, "reveal");
    hideProfileSection = makeContentSectionAnimator(2, "hide");
    revealNewsfeedSection = makeContentSectionAnimator(3, "reveal");
    hideNewsfeedSection = makeContentSectionAnimator(3, "hide");
    "Runs an animation only if it is safe to do so. doAnimation is a function that\ntakes a callback and runs the callback upon completing the animation.";
    animateSectionIndexWithGuard = function(sectionIndex, action, doAnimation) {
      if (animationQueues[sectionIndex][action]) {
        return;
      }
      animationQueues[sectionIndex][action] = true;
      return doAnimation(function() {
        return animationQueues[sectionIndex][action] = false;
      });
    };
    return scrollViewDidTransition = function(previousSectionIndex, currentSectionIndex) {
      console.log("From " + previousSectionIndex + " to " + currentSectionIndex);
      switch (previousSectionIndex) {
        case 0:
          hideIntroSection();
          break;
        case 1:
          hideMatchSection();
          break;
        case 2:
          hideProfileSection();
          break;
        case 3:
          hideNewsfeedSection();
      }
      switch (currentSectionIndex) {
        case 0:
          return revealIntroSection();
        case 1:
          return revealMatchSection();
        case 2:
          return revealProfileSection();
        case 3:
          return revealNewsfeedSection();
      }
    };
  });

}).call(this);
