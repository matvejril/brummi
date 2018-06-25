function initBannerSlider(selector) {
    var slider = document.querySelector(selector);

    if (!slider) {
        return;
    }
    var $bannerList = $('.banner__list');

    $bannerList.on('init', function(){
        slider.style.visibility = "visible";
    });

    $bannerList.slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        dots: true,
        infinite: true,
        speed: 500,
        // autoplay: true,
        autoplaySpeed: 5000
    });
}

function initBestSalesSlider(selector) {
    var slider = document.querySelector(selector);

    if (!slider) {
        return;
    }

    var $bestsellersSlider = $('.bestsellers-slider');

    $bestsellersSlider.on('init', function(){
        slider.style.visibility = "visible";
    });

    $bestsellersSlider.slick({
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
    });
}

module.exports.initBannerSlider = initBannerSlider;
module.exports.initBestSalesSlider = initBestSalesSlider;
