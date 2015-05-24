$ () ->
    sectionIds = ["#intro-section", "#match-section", "#profile-section", "#newsfeed-section", "#signup-section"]
    sectionOffsets = []
    for sectionId, index in sectionIds.slice().splice(1)
        previousThreshold = $(sectionIds[index]).offset().top
        currentThreshold = $(sectionId).offset().top
        sectionOffsets.push (previousThreshold + currentThreshold) / 2

    computeCurrentSectionIndex = () ->
        offset = document.body.scrollTop
        for index in [0..3]
            if offset < sectionOffsets[index] then return index
        return 4

    previousSectionIndex = computeCurrentSectionIndex()
    userHasScrolledPastIntro = false
    animationQueues = [
        {reveal: false, hide: false},
        {reveal: false, hide: false},
        {reveal: false, hide: false},
        {reveal: false, hide: false},
        {reveal: false, hide: false}
    ]

    $(window).scroll () ->
        currentSectionIndex = computeCurrentSectionIndex()
        if not userHasScrolledPastIntro and currentSectionIndex != 0
            didBeginScrolling()
            userHasScrolledPastIntro = true

        if previousSectionIndex isnt currentSectionIndex
            scrollViewDidTransition(previousSectionIndex, currentSectionIndex)
            previousSectionIndex = currentSectionIndex

    makeContentSectionAnimator = (index, action) ->
        return -> (animateSectionIndexWithGuard index, action, (onComplete) ->
            $(sectionIds[index].replace(/section/, "iphone-container")).animate({
                "margin-top": if action is "reveal" then "20px" else "0px",
                "opacity": if action is "reveal" then 1 else 0
            }, 750, onComplete))

    revealIntroSection = () ->
        animateSectionIndexWithGuard 0, "reveal", (onComplete) ->
            $("#intro-section").animate({
                "padding-top": "20px",
                "opacity": 1
            }, 750, onComplete)

    hideIntroSection = () ->
        animateSectionIndexWithGuard 0, "hide", (onComplete) ->
            $("#intro-section").animate({
                "padding-top": "0px",
                "opacity": 0
            }, 750, onComplete)

    revealMatchSection = makeContentSectionAnimator 1, "reveal"
    hideMatchSection = makeContentSectionAnimator 1, "hide"

    revealProfileSection = makeContentSectionAnimator 2, "reveal"
    hideProfileSection = makeContentSectionAnimator 2, "hide"

    revealNewsfeedSection = makeContentSectionAnimator 3, "reveal"
    hideNewsfeedSection = makeContentSectionAnimator 3, "hide"

    """
    Runs an animation only if it is safe to do so. doAnimation is a function that
    takes a callback and runs the callback upon completing the animation.
    """
    animateSectionIndexWithGuard = (sectionIndex, action, doAnimation) ->
        if animationQueues[sectionIndex][action] then return
        animationQueues[sectionIndex][action] = true
        doAnimation () -> animationQueues[sectionIndex][action] = false

    scrollViewDidTransition = (previousSectionIndex, currentSectionIndex) ->
        switch previousSectionIndex
            when 0 then hideIntroSection()
            when 1 then hideMatchSection()
            when 2 then hideProfileSection()
            when 3 then hideNewsfeedSection()

        switch currentSectionIndex
            when 0 then revealIntroSection()
            when 1 then revealMatchSection()
            when 2 then revealProfileSection()
            when 3 then revealNewsfeedSection()

    didBeginScrolling = () ->
        $("#match-text-content").animate({
            opacity: 1
        }, 750)
        $("#intro-scroll-message").animate({
            opacity: 0
        }, 750)
