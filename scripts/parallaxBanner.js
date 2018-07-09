function ParallaxBanner (selector) {
    this.banner = selector;
    this.$banner = $(selector);

    if (this.$banner[0]) {
        this.init();
    }
}

ParallaxBanner.prototype.init = function() {
    var params = {
        speed: -10,
        center: false,
        wrapper: null,
        round: true,
        vertical: true,
        horizontal: false
    };

    new Rellax(this.banner, params);
};

module.exports = ParallaxBanner;
