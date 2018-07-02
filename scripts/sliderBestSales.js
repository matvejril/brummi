function SliderBestSales(selector) {
    var that = this;
    this.slider = document.querySelector(selector);
    console.log("selector" ,selector);
    console.log("this", this);

    if (this.slider) {
        this.init(that);
    }
}

SliderBestSales.prototype.init = function(that) {
    this.elems = {
        $bestsellersSlider: $(this.slider)
    };

    var params = {
        slidesToShow: 3,
        slidesToScroll: 3,
        arrows: true,
        dots: false,
        infinite: true,
        speed: 500,
        responsive: [
            {
                breakpoint: 1180,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    arrows: true,
                    dots: false,
                    infinite: true
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: true,
                    dots: false,
                    infinite: true
                }
            }
        ]
    };

    this.elems.$bestsellersSlider.on('init', function(){
        that.elems.$bestsellersSlider.css("visibility", "visible");
    });

    this.elems.$bestsellersSlider.slick(params);

};

module.exports = SliderBestSales;