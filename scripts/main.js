var sliders = require('./sliders');
var HeaderPlugin = require('./headerPlugin');
var Modal = require('./modals');
var validation = require('./validation');
var ParallaxBanner = require('./parallaxBanner');
var ParallaxReviews = require('./parallaxReviews');
var helpers = require('./helpers');

window.onload = function () {

    // Шапка
    new HeaderPlugin('.header');

    // Слайдеры
    sliders.initBannerSlider('.banner');
    sliders.initBestSalesSlider('.bestsellers-slider');

    // Параллакс
    new ParallaxBanner('.banner-item__bg');
    new ParallaxReviews('.reviews');

    // Валидация
    validation();

    // Модалки
    new Modal('.modal-auth', '.showAuth');
    new Modal('.modal-restor', '.showRestor');

    // Временные
    helpers();
};
