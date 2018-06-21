function HeaderPlugin(selector) {
    var that = this;

    this.header = document.querySelector(selector);
    this.getBody = document.querySelector('body');

    if (this.header) {
        this.updateStickyClass();
        this.updatePaddingHeader();

        window.onscroll = function() {
            that.updateStickyClass();
        };
        window.onresize = function() {
            that.updatePaddingHeader()
        }
    }
}

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
        this.getBody.style.paddingTop = headerHeight + "px";
    } else {
        this.getBody.style.paddingTop = 0 + "px"
    }
};

module.exports = HeaderPlugin;
