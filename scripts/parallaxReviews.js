function ParallaxReviews (selector) {
    this.reviews = selector;

    if (this.reviews) {
        this.init();
    }
}

ParallaxReviews.prototype.init = function() {
    $(this.reviews).parallax();
};

module.exports = ParallaxReviews;