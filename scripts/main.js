var HeaderPlugin = require('./headerPlugin');
var validation = require('./validation');
var SliderBanner = require('./sliderBanner');
var SliderBestSales = require('./sliderBestSales');
var ParallaxBanner = require('./parallaxBanner');
var ParallaxReviews = require('./parallaxReviews');
var Modal = require('./modals');
var helpers = require('./helpers');

window.onload = function () {

    // Шапка
    new HeaderPlugin('.header');

    // Слайдеры
    new SliderBanner('.banner__list');
    new SliderBestSales('.bestsellers-slider');

    // Параллакс
    new ParallaxBanner('.banner-item__bg');
    new ParallaxReviews('.reviews');

    // Модалки
    new Modal('.modal-auth', '.showAuth');
    new Modal('.modal-restor', '.showRestor');

    // Валидация
    validation();

    // Временные
    helpers();
};
