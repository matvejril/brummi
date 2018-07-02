var sliders = require('./sliders');
var HeaderPlugin = require('./headerPlugin');
var Modal = require('./modals');
var parallax = require('./parallax');
var helpers = require('./helpers');
var validation = require('./validation');

window.onload = function () {

    // Шапка
    new HeaderPlugin('.header');

    // Слайдеры
    sliders.initBannerSlider('.banner');
    sliders.initBestSalesSlider('.bestsellers-slider');

    // Параллакс
    parallax();

    // Валидация
    validation();

    // Модалки
    new Modal('.modal-auth', '.showAuth');
    new Modal('.modal-restor', '.showRestor');

    // Временные
    helpers();
};
