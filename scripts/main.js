var HeaderPlugin = require('./headerPlugin');
var validation = require('./validation');
var SliderBanner = require('./sliderMain');
var SliderBestSales = require('./sliderBestSales');
var catalogDetailSlider = require('./catalogDetailSlider');
var ParallaxBanner = require('./parallaxBanner');
var ParallaxReviews = require('./parallaxReviews');
var Modal = require('./modals');
var CustomInputCount = require('./customInputCount');
var AcceptCookies = require('./acceptCookies');

window.onload = function () {

    // Шапка
    new HeaderPlugin('.header');

    // Параллакс
    new ParallaxBanner('.slider-main-item__bg');
    new ParallaxReviews('.reviews');

    // Слайдеры
    new SliderBanner('.slider-main__list');
    new SliderBestSales('.bestsellers-slider');
    new catalogDetailSlider('.catalog-detail-slider');

    // Модалки
    new Modal('.modal-auth', '.showAuth');
    new Modal('.modal-restor', '.showRestor');
    new Modal('.modal-filter-m', '.showFilterM');
    new Modal('.modal-catalog-quick-view', '.catalog-card__quick-view');

    // счетчик колличества
    new CustomInputCount ('.custom-input-count');

    // Подтвтерждение испольвания кук
    new AcceptCookies('.accept-cookies');

    // Валидация
    validation();

    // Временные
};
