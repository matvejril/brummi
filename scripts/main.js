var sliderBanner = require('./sliderBanner');
var sliderBestSales = require('./sliderBestSales');

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
    new sliderBanner('.banner__list');
    new sliderBestSales('.bestsellers-slider');

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
