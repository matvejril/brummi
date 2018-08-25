var HeaderPlugin = require('./headerPlugin');
var UserToolsDropDown = require('./userToolsDropDown');
var validation = require('./validation');
var SliderMain = require('./sliderMain');
var SliderBestSales = require('./sliderBestSales');
var OrderPayment = require('./orderPayment');
var OrederForm = require('./orderForm');
var FaqAccordion = require('./faqAccordion');
var AdvantagesTabs = require('./advantagesTabs');
var CatalogDetailSlider = require('./catalogDetailSlider');
var ParallaxReviews = require('./parallaxReviews');
var Modal = require('./modals');
// var ModalCatalogQuickView = require('./modalCatalogQuickView');
var CustomInputCount = require('./customInputCount');
var PhotoGallery = require('./photoGallery');
var HistoryOrders = require('./historyOrders');
var OurCertificates = require('./ourCertificates');
var ContactsMap = require('./contactsMap');
var Basket = require('./basket');
var Uploader = require('./uploader');
var AcceptCookies = require('./acceptCookies');
var SubscriptionForm = require ('./subscriptionForm');
// var CustomSelect = require('./customSelect');


window.addEventListener('load', function() {
    // Шапка
    new HeaderPlugin('.header');

    // user-tools
    new UserToolsDropDown('.user-tools-drop-down');

    // Параллакс
    new ParallaxReviews('.reviews-section');

    // Слайдеры
    new SliderMain('.slider-main__list', '.slider-main-item__bg');
    new SliderBestSales('.bestsellers-slider');
    new CatalogDetailSlider('.catalog-detail-slider');

    // Аккордеоны
    new FaqAccordion('.faq-categories');

    // фотогаллерея
    new PhotoGallery('.photo-gallery');

    // Преимущества
    new AdvantagesTabs('.advantages');

    // Наши сертификаты
    new OurCertificates('.our-certificates');

    // История заказов в ЛК
    new HistoryOrders('.history-orders');

    // Заказы
    new OrederForm('.order-form');
    new OrderPayment('.order-payment');

    // Корзина
    new Basket('.basket');

    // Модалки
    new Modal('.modal-auth', '.showAuth');
    new Modal('.modal-restor', '.showRestor');
    new Modal('.modal-filter-m', '.showFilterM');
    // new ModalCatalogQuickView('.modal-catalog-quick-view', '.catalog-card__quick-view');

    // счетчик колличества товара
    new CustomInputCount('.custom-input-count');

    // Подтвтерждение испольвания кук
    new AcceptCookies('.accept-cookies');

    // Карта в контактах
    new ContactsMap('#contact_map');

    // Загрузчик файлов (контакты)
    new Uploader('[data-upload]');

    // Кастомный селект
    // new CustomSelect('.custom-select');

    // Валидация
    new SubscriptionForm('.subscription-form');
    validation();
});


// window.onload = function () {
//
// };
