var sliders = require('./sliders');
var HeaderPlugin = require('./headerPlugin');
var mobileNav = require('./mobileNav');
var Modal = require('./modals');
var parallax = require('./parallax');
var helpers = require('./helpers');
var validation = require('./validation');

window.onload = function () {
    var header = document.querySelector('.header');

    new HeaderPlugin('.header');

    // Модалки
    new Modal('.modal-auth', '.showAuth');
    new Modal('.modal-restor', '.showRestor');

    // Слайдеры
    sliders.initBannerSlider('.banner');
    sliders.initBestSalesSlider('.bestsellers-slider');

    if (header) {
        mobileNav();
    }


    validation();

    helpers();

    parallax();

};
