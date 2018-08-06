function HeaderPlugin(selector) {
    var that = this;
    this.header = document.querySelector(selector);
    this.$header = $(selector);
    if (this.$header[0]) {
        this.init(that);
    }
}

HeaderPlugin.prototype.init = function(that) {
    this.elements = {
        $headerNavMobile: this.$header.find('.header-nav-mobile'),
        $headerNavMobileList: this.$header.find('.header-nav-mobile__list'),
        $headerNavMobileBtn: this.$header.find('.header-nav-mobile__btn'),
        $headerExpand: this.$header.find('.header__expand'),
        $logo: this.$header.find('.logo'),
        $body: $('body')
    };

    this.updateOnScroll();
    this.updateOnResize();

    this.elements.$headerNavMobileBtn.on('click', function() {
        that.navToggle();
    });

    window.addEventListener('scroll', function() {
        that.updateOnScroll();
    });
    window.addEventListener('resize', function() {
        that.updateOnResize();
    });
};


HeaderPlugin.prototype.updateOnScroll = function() {
    var headerHeight = this.header.offsetHeight;

    if (window.pageYOffset >= headerHeight / 1.5) {
        if (!this.$header.hasClass("sticky")) {
            this.$header.addClass("sticky");
            this.$header.slideUp(0, function() {
                $(this).slideDown(200);
            });
        }
    } else {
        this.$header.removeClass("sticky");
    }
};

HeaderPlugin.prototype.updateOnResize = function() {
    // var headerHeight = this.header.offsetHeight;
    var getWindowWidth = document.documentElement.clientWidth;

    // добавление/удаление отступа у body
    if (getWindowWidth < 767 - 17) {
        this.elements.$body.css("padding-top", 142);
    } else if (getWindowWidth < 1180 - 17) {
        this.elements.$body.css("padding-top", 82);
    } else {
        this.elements.$body.css("padding-top", 0);
    }

    // добавление/удаление дополнительной секции Expand
    if (getWindowWidth > 767 - 17) {
        this.elements.$headerExpand.css("display", "none");
    } else {
        this.elements.$headerExpand.css("display", "block");
    }
};

HeaderPlugin.prototype.navToggle = function() {
    this.elements.$headerNavMobile.toggleClass('active');
    this.elements.$headerNavMobileList.slideToggle(250);

    if (!(document.documentElement.clientWidth < 768-17)) {
        return
    }
    if (this.elements.$headerNavMobile.hasClass('active') && !this.header.classList.contains('sticky')) {
        this.elements.$headerExpand.slideUp(300, function() {
        });
    } else {
        this.elements.$headerExpand.slideDown(300, function() {
        });
    }
};

module.exports = HeaderPlugin;
