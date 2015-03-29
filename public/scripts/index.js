$(function() {

    var NAV_DOT_SCROLL_MODE = 0;
    var MOUSEWHEEL_SCROLL_MODE = 1;
    var KEY_SCROLL_MODE = 2;

    var sectionHeight = $("#intro-section").height();
    var sectionNames = ["intro", "matches", "profile", "newsfeed"];
    var currentSection = sectionNames[0];
    var isCurrentlyScrolling = true;
    var scrollingMode = null;
    var targetSection = null;
    $("#nav-dots-container").css({ top: (sectionHeight - $("#nav-dots-container").height()) / 2 })

    setTimeout(function() {
        currentSection = sectionNames[Math.round($(document).scrollTop() / sectionHeight)]
        updateNavDots()
        isCurrentlyScrolling = false;
    }, 500)

    var sectionOffset = function(section) {
        return $("#" + section + "-section").offset().top;
    }

    var scrollToSection = function(section, mode) {
        if (currentSection == section)
            return;

        isCurrentlyScrolling = true;
        targetSection = section;
        scrollingMode = mode;
        $("html, body").animate({
            scrollTop: sectionOffset(section)
        }, 1000, "swing", function() {
            currentSection = targetSection;
            updateNavDots()
            setTimeout(function() {
                isCurrentlyScrolling = false;
            }, scrollReenableDelayMsForscrollingMode(mode));
        });
    }

    $("body").on({
        mousewheel: function(e) {
            if (!isCurrentlyScrolling)
                handleSectionPaging(currentSection, MOUSEWHEEL_SCROLL_MODE, e.originalEvent.deltaY < 0, e.originalEvent.deltaY > 0);
            stopEventFromPropagating(e);
        },
        keydown: function(e) {
            if (keyWillScrollDocument(e)) {
                if (!isCurrentlyScrolling)
                    handleSectionPaging(currentSection, KEY_SCROLL_MODE, e.which == 38, e.which == 40 || e.which == 32);
                stopEventFromPropagating(e);
            }
        }
    });

    var handleSectionPaging = function(atSection, mode, shouldScrollUp, shouldScrollDown) {
        var target = atSection;
        if (shouldScrollUp)
            target = previousSection(atSection);
        else if (shouldScrollDown)
            target = nextSection(atSection);

        scrollToSection(target, mode);
    }

    var scrollReenableDelayMsForscrollingMode = function(mode) {
        if (mode == NAV_DOT_SCROLL_MODE)
            return 0;
        else if (mode == KEY_SCROLL_MODE)
            return 50;
        else if (mode == MOUSEWHEEL_SCROLL_MODE)
            return 600;
        return 0;
    }

    var stopEventFromPropagating = function(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    var keyWillScrollDocument = function(e) {
        return [32, 38, 40].indexOf(e.which) != -1;
    }

    var nextSection = function(section) {
        var currentSectionIndex = sectionNames.indexOf(section);
        if (currentSectionIndex != -1)
            return sectionNames[Math.min(sectionNames.length - 1, currentSectionIndex + 1)];
        return section;
    }

    var previousSection = function(section) {
        var currentSectionIndex = sectionNames.indexOf(section);
        if (currentSectionIndex != -1)
            return sectionNames[Math.max(0, currentSectionIndex - 1)];
        return section;
    }

    var updateNavDots = function() {
        var currentSectionIndex = sectionNames.indexOf(currentSection);
        if (currentSectionIndex != -1) {
            $(".nav-dot").attr("class", "nav-dot");
            $("#" + sectionNames[currentSectionIndex] + "-nav-dot").attr("class", "nav-dot active-nav-dot");
        }
    }

    $(".nav-dot").click(function(e) {
        if (!isCurrentlyScrolling)
            scrollToSection(e.target.id.replace("-nav-dot", ""), NAV_DOT_SCROLL_MODE);
    });
});
