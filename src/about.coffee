$ ->
    currentSelectedImageId = null
    isDescriptionOpen = false
    isContentTransitioning = false

    kPortraitFadedOpacity = 0.25
    kPortraitInitialOpacity = 0.75
    kPortraitFocusedOpacity = 1.0
    kFadeTransitionTimeMS = 250

    descriptionFromId = (id) -> $("##{id}-description")

    if not window.orientation?
        $(".portrait > img").hover (event) ->
            $(event.target).css { opacity: 1 }

        $(".portrait > img").mouseout (event) ->
            if event.target.id != currentSelectedImageId
                targetOpacity = if isDescriptionOpen then kPortraitFadedOpacity else kPortraitInitialOpacity
                $(event.target).css { opacity: targetOpacity }

    $(".portrait > img").click (event) ->
        if isContentTransitioning or event.target.id is currentSelectedImageId
            return

        isContentTransitioning = true
        isDescriptionOpen = true
        element = $(event.target)
        $(".portrait > img").css { opacity: kPortraitFadedOpacity }
        element.css { opacity: kPortraitFocusedOpacity }
        fadeCurrentlySelectedContent () ->
            descriptionFromId(event.target.id).show()
            descriptionFromId(event.target.id).animate({
                opacity: 1,
                top: "0px"
            }, kFadeTransitionTimeMS, () -> isContentTransitioning = false)
        currentSelectedImageId = event.target.id

    fadeCurrentlySelectedContent = (onComplete) ->
        if currentSelectedImageId?
            descriptionFromId(currentSelectedImageId).animate({
                opacity: 0,
                top: "20px"
            }, kFadeTransitionTimeMS, () ->
                $(".description").hide()
                onComplete()
            )
        else
            onComplete()
