$(function() {

    var MOUSEWHEEL_SCROLL_MODE = 0;
    var KEY_SCROLL_MODE = 1;
    var sectionHeight = $("#intro-section").height();
    var sectionNames = ["intro", "matches", "profile", "newsfeed"];
    var currentSection = sectionNames[0];
    var isCurrentlyScrolling = true;
    var scrollingMode = null;
    var targetSection = null;

    setTimeout(function() {
        currentSection = sectionNames[Math.round($(document).scrollTop() / sectionHeight)]
        isCurrentlyScrolling = false;
    }, 500)

    var sectionOffset = function(section) {
        return $("#" + section + "-section").offset().top;
    }

    var scrollToSection = function(section, mode) {
        if (currentSection == section)
            return;

        isCurrentlyScrolling = true;
        scrollingMode = mode;
        $("html, body").animate({
            scrollTop: sectionOffset(section)
        }, 1000, "swing", function() {
            currentSection = targetSection;
            setTimeout(function() {
                isCurrentlyScrolling = false;
            }, scrollReenableDelayMsForscrollingMode(mode));
        });
    }

    $("body").on({
        mousewheel: function(e) {
            if (!isCurrentlyScrolling)
                targetSection = handleSectionPaging(currentSection, MOUSEWHEEL_SCROLL_MODE, e.originalEvent.deltaY < 0, e.originalEvent.deltaY > 0);
            stopEventFromPropagating(e);
        },
        keydown: function(e) {
            if (keyWillScrollDocument(e)) {
                if (!isCurrentlyScrolling)
                    targetSection = handleSectionPaging(currentSection, KEY_SCROLL_MODE, e.which == 38, e.which == 40 || e.which == 32);
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
        return target;
    }

    var scrollReenableDelayMsForscrollingMode = function(mode) {
        if (mode == KEY_SCROLL_MODE)
            return 50;
        else if (mode == MOUSEWHEEL_SCROLL_MODE)
            return 500;
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
});
