var select = require('dom-select');
var classes = require('dom-classes');

function deviceType() {
    let istouch = classes.has(select("html"), "touchevents");
    let browserWidth = window.innerWidth,
    browserHeight = window.innerHeight;
    let mobileWidth = 767,
        tabletWidth = 1024,
        desktopWidth = 1500;
    let device = 'desktop',
    type = 'desktop';
    if(browserWidth > desktopWidth) {
        device = 'desktopXl';
        type = 'desktop';
    }
    else if(browserWidth > tabletWidth) {
        device = 'desktop';
        type = 'desktop';
    }
    else if(browserWidth > mobileWidth && istouch) {
        device = 'tablet';
        type = 'touch';
    }
    else if(istouch) {
        device = 'mobile';
        type = 'touch';
    }

    return { device: device, type: type };
}

module.exports = deviceType;
