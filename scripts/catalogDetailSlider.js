function CatalogDetailSlider(selector) {
    var that = this;
    this.slider = document.querySelector(selector);
    this.$slider = $(selector);

    if (this.$slider[0]) {
        this.init(that);
    }
}

CatalogDetailSlider.prototype.init = function(that) {
    this.elems = {
        $sliderMain: this.$slider.find('.catalog-detail-slider__main'),
        $sliderSub: this.$slider.find('.catalog-detail-slider__sub')
    };

    var paramsMain = {
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        dots: false,
        infinite: true,
        speed: 500,
        asNavFor: ".catalog-detail-slider__sub"
    };

    var paramsSub = {
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: false,
        dots: false,
        infinite: true,
        speed: 500,
        asNavFor: ".catalog-detail-slider__main",
        centerMode: true,
        centerPadding: '0px'
    };

    this.elems.$sliderMain.on('init', function(){
        that.$slider.css("visibility", "visible");
    });

    this.elems.$sliderMain.slick(paramsMain);
    this.elems.$sliderSub.slick(paramsSub);

    this.elems.$sliderMain.on('afterChange', function(event, slick, currentSlide) {
        that.elems.$sliderSub.slick('slickGoTo', currentSlide);
        var currrentNavSlideElem = '.slider-nav .slick-slide[data-slick-index="' + currentSlide + '"]';
        $('.slider-nav .slick-slide.is-active').removeClass('is-active');
        $(currrentNavSlideElem).addClass('is-active');
    });
    this.elems.$sliderSub.on('click', '.slick-slide', function(event) {
        event.preventDefault();
        var goToSingleSlide = $(this).data('slick-index');
        that.elems.$sliderMain.slick('slickGoTo', goToSingleSlide);
    });

    // magnific popup
    $('.catalog-detail-slider__zoom-btn').magnificPopup({
        type: 'image',
        // closeOnContentClick: true,
        // closeBtnInside: false,
        image: {
            verticalFit: true
        }
        // zoom: {
        //     enabled: true,
        //     duration: 300 // don't foget to change the duration also in CSS
        // }
    });
};

module.exports = CatalogDetailSlider;
