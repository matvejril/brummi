function HeaderPlugin(selector) {
    var that = this;
    this.header = document.querySelector(selector);

    if (this.header) {
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

    this.updateStickyClass();
    this.updatePaddingHeader();

    this.elements.$headerNavMobileBtn.on('click', function() {
        that.navToggle();
    });

    window.onscroll = function() {
        that.updateStickyClass();
    };
    window.onresize = function() {
        that.updatePaddingHeader()
    }
};


HeaderPlugin.prototype.updateStickyClass = function() {
    var headerHeight = this.header.offsetHeight;

    if (window.pageYOffset >= headerHeight / 1.5) {
        this.header.classList.add("sticky");
    } else {
        this.header.classList.remove("sticky");
    }
};

HeaderPlugin.prototype.updatePaddingHeader = function() {
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

    var headerHeight;
    if (this.elements.$headerNavMobile.hasClass('active') && !this.header.classList.contains('sticky')) {
        this.elements.$logo.hide();
        headerHeight = this.header.offsetHeight;
        this.elements.$body.css("padding-top", headerHeight);
    } else {
        this.elements.$logo.show();
        headerHeight = this.header.offsetHeight;
        this.elements.$body.css('padding-top', headerHeight);
    }
};


module.exports = HeaderPlugin;
