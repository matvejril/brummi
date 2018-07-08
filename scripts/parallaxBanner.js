function ParallaxBanner (selector) {
    this.banner = selector;

    console.log(this.banner);

    if (this.banner) {
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
