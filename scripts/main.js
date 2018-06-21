var sliders = require('./sliders');
var HeaderPlugin = require('./headerPlugin');
var mobileNav = require('./mobile-nav');
var Popups = require('./popups');
var parallax = require('./parallax');

window.onload = function () {
    var header = document.querySelector('.header');

    new HeaderPlugin('.header');

    new Popups('.popup');

    sliders.initBannerSlider('.banner');
    sliders.initBestSalesSlider('.bestsellers-slider');

    if (header) {
        mobileNav();
    }

    parallax();

};
