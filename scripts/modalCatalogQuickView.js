window.addEventListener('load', function() {
    function ModalCatalogQuickView (modal, defiantElem) {
        var that = this;
        this.$modals = $(modal);

        if (this.$modals[0]) {
            this.defiantElem = defiantElem;
            this.init(that);
        }
    }

    ModalCatalogQuickView.prototype.init = function (that) {
        this.elements = {
            $modals:        this.$modals,
            $closeBtn:      this.$modals.find(".modal-close")
        };

        // show modal
        $(this.defiantElem).on('click', function (e) {
            e.preventDefault();
            var targetElem = this;
            that.showModal(that, targetElem);
        });

        this.elements.$closeBtn.on('click', function(e) {
            e.stopPropagation();
            that.hideModal(that, e)
        });
        // hide modal
        this.elements.$modals.on('click', function (e) {
            that.hideModal(that, e)
        });
    };

    ModalCatalogQuickView.prototype.showModal = function (that, targetElem) {
        var $targetElem = $(targetElem);
        this.targetElemId = $targetElem.attr('data-id');
        this.elements.$targetCatalogCard = $targetElem.closest(".catalog-card");
        this.targetCatalogCardIndex = this.elements.$targetCatalogCard.index();
        this.elements.$selectModal = $("#" + this.targetElemId);
        this.elements.$selectModalSlider = this.elements.$selectModal.find(".catalog-quick-view-slider");

        $('.modal').fadeOut(300, function () {
            $(this).removeClass('opened').addClass('closed');
        });
        this.elements.$selectModal.fadeIn(300, function () {
            $(this).removeClass('closed').addClass('opened');
        });

        if (this.elements.$selectModalSlider[0]) {
            that.sliderCatalogQuickView(that);
        }
    };

    ModalCatalogQuickView.prototype.hideModal = function (that, e) {
        var modal = that.elements.$modals;
        var currTarget = $(e.currentTarget).attr('class');

        if (e.target === modal[0] || currTarget === 'modal-close') {
            modal.fadeOut(300, function() {
                $(this).removeClass('opened').addClass('closed');
            });
        }
    };

    ModalCatalogQuickView.prototype.sliderCatalogQuickView = function(that) {
        this.elements.$selectSliderMain = this.elements.$selectModalSlider.find('.catalog-quick-view-slider__main');
        this.elements.$selectSliderSub = this.elements.$selectModalSlider.find('.catalog-quick-view-slider__sub');

        var paramsMain = {
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: true,
            dots: false,
            infinite: true,
            speed: 500,
            asNavFor: ".catalog-quick-view-slider__sub:eq("+ that.targetCatalogCardIndex +")"
        };
        var paramsSub = {
            slidesToShow: 4,
            slidesToScroll: 1,
            arrows: false,
            dots: false,
            infinite: true,
            speed: 500,
            asNavFor: ".catalog-quick-view-slider__main:eq("+ that.targetCatalogCardIndex +")",
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

        if (this.elements.$selectSliderMain.hasClass('slick-initialized')) {
            this.elements.$selectSliderMain.slick("unslick");
            this.elements.$selectSliderSub.slick("unslick");
        }

        this.elements.$selectSliderMain.on('init', function(){
            that.elements.$selectModalSlider.css("visibility", "visible");
        });

        this.elements.$selectSliderMain.slick(paramsMain);
        this.elements.$selectSliderSub.slick(paramsSub);

        this.elements.$selectSliderMain.on('afterChange', function(event, slick, currentSlide) {

            that.elements.$selectSliderSub.slick('slickGoTo', currentSlide);
            var currrentNavSlideElem = '.slider-nav .slick-slide[data-slick-index="' + currentSlide + '"]';
            $('.slider-nav .slick-slide.is-active').removeClass('is-active');
            $(currrentNavSlideElem).addClass('is-active');
        });
        this.elements.$selectSliderSub.on('click', '.slick-slide', function(event) {
            event.preventDefault();
            var goToSingleSlide = $(this).data('slick-index');
            that.elements.$selectSliderMain.slick('slickGoTo', goToSingleSlide);
        });

    };

    new ModalCatalogQuickView('.modal-catalog-quick-view', '.catalog-card__quick-view');
});
