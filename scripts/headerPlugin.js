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
        $headerNavMobile: $('.header-nav-mobile'),
        $headerNavMobileList: $('.header-nav-mobile__list'),
        $headerNavMobileBtn: $('.header-nav-mobile__btn'),
        $logo: $('.logo'),
        $body: $('body')
    };

    this.updateOnScroll();
    this.updateOnResize();

    this.elements.$headerNavMobileBtn.on('click', function() {
        that.navToggle();
    });

    window.onscroll = function() {
        that.updateOnScroll();
    };
    window.onresize = function() {
        that.updateOnResize()
    }
};


HeaderPlugin.prototype.updateOnScroll = function() {
    var headerHeight = this.header.offsetHeight;
    if (window.pageYOffset >= headerHeight / 1.5) {
        this.$header.addClass("sticky");
        if (document.documentElement.clientWidth < 768-17) {
            this.elements.$logo.css("display", "block");
        }
    } else {
        this.$header.removeClass("sticky");
    }
    if (document.documentElement.clientWidth < 768-17) {
        this.elements.$body.css("padding-top", headerHeight);
    }
};

HeaderPlugin.prototype.updateOnResize = function() {
    var headerHeight = this.header.offsetHeight;
    var getWindowWidth = document.documentElement.clientWidth;

    if (getWindowWidth < 1180 - 17) {
        this.elements.$body.css("padding-top", headerHeight);
    } else {
        this.elements.$body.css("padding-top", 0);
    }
};


HeaderPlugin.prototype.navToggle = function() {
    this.elements.$headerNavMobile.toggleClass('active');
    this.elements.$headerNavMobileList.slideToggle(250);

    if (!(document.documentElement.clientWidth < 768-17)) {
        return
    }
    if (this.elements.$headerNavMobile.hasClass('active') && !this.header.classList.contains('sticky')) {
        this.elements.$logo.slideUp(300, function() {
        });
    } else {
        this.elements.$logo.slideDown(300, function() {
        });

    }
};


module.exports = HeaderPlugin;
