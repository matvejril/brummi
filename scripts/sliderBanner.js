function SliderBanner(selector) {
    var that = this;
    this.slider = document.querySelector(selector);

    if (this.slider) {
        this.init(that)
    }
}

SliderBanner.prototype.init = function(that) {
    var params = {
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        dots: true,
        infinite: true,
        speed: 500,
        autoplay: true,
        autoplaySpeed: 5000
    };
    this.elems = {
        $bannerList: $(this.slider)
    };

    this.elems.$bannerList.on('init', function(){
        that.elems.$bannerList.css("visibility", "visible");
    });
    this.elems.$bannerList.slick(params);
};

module.exports = SliderBanner;
