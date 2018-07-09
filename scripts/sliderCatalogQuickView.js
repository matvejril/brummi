function SliderCatalogQuickView(selector) {
    var that = this;
    this.slider = document.querySelector(selector);
    this.$slider = $(selector);

    if (this.$slider[0]) {
        this.init(that);
    }
}

SliderCatalogQuickView.prototype.init = function(that) {
    this.elems = {
        $sliderMain: this.$slider.find('.catalog-quick-view-slider__main'),
        $sliderSub: this.$slider.find('.catalog-quick-view-slider__sub')
    };

    var paramsMain = {
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        dots: false,
        infinite: true,
        speed: 500,
        asNavFor: ".catalog-quick-view-slider__sub"
    };

    var paramsSub = {
        // slidesToShow: 3,
        slidesToScroll: 1,
        arrows: true,
        dots: false,
        infinite: true,
        speed: 500,
        // centerMode: true,
        // centerPadding: '60px',
        asNavFor: ".catalog-quick-view-slider__main"
    };

    this.elems.$sliderMain.on('init', function(){
        that.$slider.css("visibility", "visible");
    });

    this.elems.$sliderMain.slick(paramsMain);
    this.elems.$sliderSub.slick(paramsSub);
};

module.exports = SliderCatalogQuickView;