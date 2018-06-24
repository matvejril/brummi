var sliders = require('./sliders');
var HeaderPlugin = require('./headerPlugin');
var mobileNav = require('./mobileNav');
var Popups = require('./popups');
var parallax = require('./parallax');
var helpers = require('./helpers');
var validation = require('./validation');

window.onload = function () {
    var header = document.querySelector('.header');

    new HeaderPlugin('.header');

    new Popups('.popup');

    sliders.initBannerSlider('.banner');
    sliders.initBestSalesSlider('.bestsellers-slider');

    if (header) {
        mobileNav();
    }


    validation();

    parallax();
    helpers();

};
