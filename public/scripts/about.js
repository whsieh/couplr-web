(function() {
  $(function() {
    var currentSelectedImageId, descriptionFromId, fadeCurrentlySelectedContent, isContentTransitioning, isDescriptionOpen, kFadeTransitionTimeMS, kPortraitFadedOpacity, kPortraitFocusedOpacity, kPortraitInitialOpacity;
    currentSelectedImageId = null;
    isDescriptionOpen = false;
    isContentTransitioning = false;
    kPortraitFadedOpacity = 0.25;
    kPortraitInitialOpacity = 0.75;
    kPortraitFocusedOpacity = 1.0;
    kFadeTransitionTimeMS = 250;
    descriptionFromId = function(id) {
      return $("#" + id + "-description");
    };
    if (window.orientation == null) {
      $(".portrait > img").hover(function(event) {
        return $(event.target).css({
          opacity: 1
        });
      });
      $(".portrait > img").mouseout(function(event) {
        var targetOpacity;
        if (event.target.id !== currentSelectedImageId) {
          targetOpacity = isDescriptionOpen ? kPortraitFadedOpacity : kPortraitInitialOpacity;
          return $(event.target).css({
            opacity: targetOpacity
          });
        }
      });
    }
    $(".portrait > img").click(function(event) {
      var element;
      if (isContentTransitioning || event.target.id === currentSelectedImageId) {
        return;
      }
      isContentTransitioning = true;
      isDescriptionOpen = true;
      element = $(event.target);
      $(".portrait > img").css({
        opacity: kPortraitFadedOpacity
      });
      element.css({
        opacity: kPortraitFocusedOpacity
      });
      fadeCurrentlySelectedContent(function() {
        descriptionFromId(event.target.id).show();
        return descriptionFromId(event.target.id).animate({
          opacity: 1,
          top: "0px"
        }, kFadeTransitionTimeMS, function() {
          return isContentTransitioning = false;
        });
      });
      return currentSelectedImageId = event.target.id;
    });
    return fadeCurrentlySelectedContent = function(onComplete) {
      if (currentSelectedImageId != null) {
        return descriptionFromId(currentSelectedImageId).animate({
          opacity: 0,
          top: "20px"
        }, kFadeTransitionTimeMS, function() {
          $(".description").hide();
          return onComplete();
        });
      } else {
        return onComplete();
      }
    };
  });

}).call(this);
