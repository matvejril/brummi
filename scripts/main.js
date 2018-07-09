var HeaderPlugin = require('./headerPlugin');
var validation = require('./validation');
var SliderBanner = require('./sliderMain');
var SliderBestSales = require('./sliderBestSales');
var SliderCatalogQuickView = require('./sliderCatalogQuickView');
var ParallaxBanner = require('./parallaxBanner');
var ParallaxReviews = require('./parallaxReviews');
var Modal = require('./modals');
var helpers = require('./helpers');

window.onload = function () {

    // Шапка
    new HeaderPlugin('.header');

    // Слайдеры
    new SliderBanner('.slider-main__list');
    new SliderBestSales('.bestsellers-slider');
    new SliderCatalogQuickView('.catalog-quick-view-slider');

    // Параллакс
    new ParallaxBanner('.slider-main-item__bg');
    new ParallaxReviews('.reviews');

    // Модалки
    new Modal('.modal-auth', '.showAuth');
    new Modal('.modal-restor', '.showRestor');
    new Modal('.modal-filter-m', '.showFilterM');

    new Modal('.modal-catalog-quick-view', '.catalog-card__quick-view');

    // Валидация
    validation();
    // Временные
    helpers();
};
