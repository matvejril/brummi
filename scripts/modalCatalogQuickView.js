window.addEventListener('load', function() {
    function ModalCatalogQuickView (modal, defiantElem) {
        var that = this;
        this.modal = modal;
        this.$modal = $(modal);

        if (this.$modal[0]) {
            this.defiantElem = defiantElem;
            this.init(that);
        }
    }

    ModalCatalogQuickView.prototype.init = function (that) {
        this.elements = {
            $modal:              this.$modal,
            $closeBtn:           this.$modal.find(".modal-close"),
            $quickSlider:        this.$modal.find(".catalog-quick-view-slider")
        };

        // show modal
        $(this.defiantElem).on('click', function (e) {
            var targetElem = this;
            e.preventDefault();
            that.showModal(that, targetElem);
            if (that.elements.$quickSlider[0]) {
                that.sliderCatalogQuickView(that);
            }
        });

        this.elements.$closeBtn.on('click', function(e) {
            e.stopPropagation();
            that.hideModal(that, e)
        });
        // hide modal
        this.elements.$modal.on('click', function (e) {
            that.hideModal(that, e)
        });

    };

    ModalCatalogQuickView.prototype.showModal = function (that, targetElem) {
        var targetElemId = $(targetElem).attr('data-id');
        var $selectModal = $("#" + targetElemId);

        $('.modal').fadeOut(300, function () {
            $(this).removeClass('opened').addClass('closed');
        });
        $selectModal.fadeIn(300, function () {
            $(this).removeClass('closed').addClass('opened');
        });
    };

    ModalCatalogQuickView.prototype.hideModal = function (that, e) {
        var modal = that.elements.$modal;
        var currTarget = $(e.currentTarget).attr('class');

        if (e.target === modal[0] || currTarget === 'modal-close') {
            modal.fadeOut(300, function() {
                $(this).removeClass('open').addClass('closed');
            });
        }
    };

    ModalCatalogQuickView.prototype.sliderCatalogQuickView = function(that) {
        this.elements.$sliderMain = this.elements.$quickSlider.find('.catalog-quick-view-slider__main');
        this.elements.$sliderSub = this.elements.$quickSlider.find('.catalog-quick-view-slider__sub');

        var paramsMain = {
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: true,
            dots: false,
            infinite: true,
            speed: 500,
            asNavFor: ".catalog-quick-view-slider__sub"
        };
        var paramsSub = {
            slidesToShow: 4,
            slidesToScroll: 1,
            arrows: false,
            dots: false,
            infinite: true,
            speed: 500,
            asNavFor: ".catalog-quick-view-slider__main",
            centerMode: true,
            centerPadding: '0px',
            responsive: [
                {
                    breakpoint: 1180,
                    settings: {
                        slidesToShow: 3
                    }
                }
            ]
        };

        if (this.elements.$sliderMain.hasClass('slick-initialized')) {
            this.elements.$sliderMain.slick("unslick");
            this.elements.$sliderSub.slick("unslick");
        }

        this.elements.$sliderMain.on('init', function(){
            that.elements.$quickSlider.css("visibility", "visible");
        });

        this.elements.$sliderMain.slick(paramsMain);
        this.elements.$sliderSub.slick(paramsSub);

        this.elements.$sliderMain.on('afterChange', function(event, slick, currentSlide) {
            that.elements.$sliderSub.slick('slickGoTo', currentSlide);
            var currrentNavSlideElem = '.slider-nav .slick-slide[data-slick-index="' + currentSlide + '"]';
            $('.slider-nav .slick-slide.is-active').removeClass('is-active');
            $(currrentNavSlideElem).addClass('is-active');
        });
        this.elements.$sliderSub.on('click', '.slick-slide', function(event) {
            event.preventDefault();
            var goToSingleSlide = $(this).data('slick-index');
            that.elements.$sliderMain.slick('slickGoTo', goToSingleSlide);
        });

    };

    new ModalCatalogQuickView('.modal-catalog-quick-view', '.catalog-card__quick-view');
});



// module.exports = ModalCatalogQuickView;
