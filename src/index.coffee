$ ->

    # State flag constants.
    NAV_DOT_SCROLL_MODE = 0
    MOUSEWHEEL_SCROLL_MODE = 1
    KEY_SCROLL_MODE = 2
    PHONE_HARNESS_LOWERED = 1
    PHONE_HARNESS_CENTERED = 2
    PHONE_HARNESS_RAISED = 3

    # State variables.
    sectionHeight = $("#intro-section").outerHeight()
    sectionNames = ["intro", "matches", "profile", "newsfeed", "signup"]
    currentSection = sectionNames[0]
    isCurrentlyScrolling = true
    scrollingMode = null
    targetSection = null
    phoneHarnessState = PHONE_HARNESS_LOWERED

    # Timing constants.
    SECTION_TRANSITION_TIME = 800
    STARTUP_RESET_TIME = 250

    setTimeout(->
        currentSection = "intro"
        updateNavDots(currentSection)
        isCurrentlyScrolling = false
        $(document).scrollTop(0)
        $(".left-content, .right-content").css {
            width: "calc(50% - 150px)",
            height: "100%"
        }
    , STARTUP_RESET_TIME)

    sectionOffset = (section) -> $("#" + section + "-section").offset().top

    scrollToSection = (section, mode) ->
        if currentSection == section then return
        isCurrentlyScrolling = true
        targetSection = section
        scrollingMode = mode
        willTransitionSections(currentSection, targetSection)
        updateNavDots(targetSection)
        $("body").animate({
            scrollTop: sectionOffset(section)
        }, SECTION_TRANSITION_TIME, "swing", ->
            currentSection = targetSection
            setTimeout((-> isCurrentlyScrolling = false), scrollDelayMsForscrollingMode(mode))
        )

    setPhoneHarnessState = (state) ->
        if phoneHarnessState == state then return
        phoneHarnessState = state
        if phoneHarnessState == PHONE_HARNESS_LOWERED
            $("#iphone-container").animate({ top: "#{sectionHeight - 300}px" }, SECTION_TRANSITION_TIME)
        else if phoneHarnessState == PHONE_HARNESS_CENTERED
            $("#iphone-container").animate({ top: "#{(sectionHeight / 2) - 300}px" }, SECTION_TRANSITION_TIME)
        else if phoneHarnessState == PHONE_HARNESS_RAISED
            $("#iphone-container").animate({ top: "-300px" }, SECTION_TRANSITION_TIME)

    $("body").on {
        mousewheel: ((e) ->
            if !isCurrentlyScrolling
                handleSectionPaging(currentSection, MOUSEWHEEL_SCROLL_MODE, e.originalEvent.deltaY < 0, e.originalEvent.deltaY > 0)
            stopEventFromPropagating(e)
        ),
        keydown: ((e) ->
            if keyWillScrollDocument(e)
                if !isCurrentlyScrolling
                    handleSectionPaging(currentSection, KEY_SCROLL_MODE, e.which == 38, e.which == 40 || e.which == 32)
                stopEventFromPropagating(e)
        )
    }

    handleSectionPaging = (atSection, mode, shouldScrollUp, shouldScrollDown) ->
        unless shouldScrollUp ^ shouldScrollDown then return
        if shouldScrollUp
            target = previousSection(atSection)
        else if shouldScrollDown
            target = nextSection(atSection)
        scrollToSection(target, mode)

    scrollDelayMsForscrollingMode = (mode) ->
        if mode == NAV_DOT_SCROLL_MODE
            return 0
        else if mode == KEY_SCROLL_MODE
            return 50
        else if mode == MOUSEWHEEL_SCROLL_MODE
            return 500
        return 0

    stopEventFromPropagating = (e) ->
        e.preventDefault()
        e.stopPropagation()

    keyWillScrollDocument = (e) -> [32, 38, 40].indexOf(e.which) != -1

    nextSection = (section) ->
        currentSectionIndex = sectionNames.indexOf(section)
        if currentSectionIndex != -1
            return sectionNames[Math.min(sectionNames.length - 1, currentSectionIndex + 1)]
        return section

    previousSection = (section) ->
        currentSectionIndex = sectionNames.indexOf(section)
        if currentSectionIndex != -1
            return sectionNames[Math.max(0, currentSectionIndex - 1)]
        return section

    updateNavDots = (section) ->
        currentSectionIndex = sectionNames.indexOf(section)
        if currentSectionIndex != -1
            $(".nav-dot").attr("class", "nav-dot")
            $("#" + sectionNames[currentSectionIndex] + "-nav-dot").attr("class", "nav-dot active-nav-dot")

    scrollPhoneToScreen = (screen) ->
        if screen is "matches"
            $("#iphone-screen-container").animate({scrollLeft: "0px"}, SECTION_TRANSITION_TIME)
        else if screen is "profile"
            $("#iphone-screen-container").animate({scrollLeft: "263px"}, SECTION_TRANSITION_TIME)
        else if screen is "newsfeed"
            $("#iphone-screen-container").animate({scrollLeft: "526px"}, SECTION_TRANSITION_TIME)

    willTransitionSections = (fromSection, toSection) ->
        # Slide the phone in or out of position.
        if toSection not in ["intro", "signup"]
            setPhoneHarnessState PHONE_HARNESS_CENTERED
            $("#iphone-cover").fadeOut SECTION_TRANSITION_TIME
        else if toSection is "intro"
            setPhoneHarnessState PHONE_HARNESS_LOWERED
            $("#iphone-cover").fadeIn SECTION_TRANSITION_TIME
        else if toSection is "signup"
            setPhoneHarnessState PHONE_HARNESS_RAISED
            $("#iphone-cover").fadeIn SECTION_TRANSITION_TIME
        # Slide to the relevant app screen.
        if toSection isnt "intro"
            scrollPhoneToScreen toSection

    $(".nav-dot").click((e) ->
        target = e.target.id.replace("-nav-dot", "")
        scrollToSection(target, NAV_DOT_SCROLL_MODE) unless isCurrentlyScrolling
    )

    # HACK Is there a better way to do this just in LESS?
    $("#nav-dots-container").css { top: "calc(50% - 52px)" }
    $(window).resize -> sectionHeight = $("#intro-section").outerHeight()
