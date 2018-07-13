var HeaderPlugin = require('./headerPlugin');
var validation = require('./validation');
var SliderMain = require('./sliderMain');
var SliderBestSales = require('./sliderBestSales');
var FaqAccordion = require('./faqAccordion');
var CatalogDetailSlider = require('./catalogDetailSlider');
var ParallaxReviews = require('./parallaxReviews');
var Modal = require('./modals');
var CustomInputCount = require('./customInputCount');
var AcceptCookies = require('./acceptCookies');

window.onload = function () {

    // Шапка
    new HeaderPlugin('.header');

    // Параллакс
    new ParallaxReviews('.reviews');

    // Слайдеры
    new SliderMain('.slider-main__list', '.slider-main-item__bg');
    new SliderBestSales('.bestsellers-slider');
    new CatalogDetailSlider('.catalog-detail-slider');

    // Аккордеоны
    new FaqAccordion('.faq-categories');

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
};
