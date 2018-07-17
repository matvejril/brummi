function Basket (selector) {
    var that = this;
    this.$basket = $(selector);

    if (this.$basket[0]) {
        this.init();
    }
}

Basket.prototype.init = function() {
    this.elements = {
        $basketZoomBtn: this.$basket.find('.basket-item__zoom')
    };
    // magnific popup
    this.elements.$basketZoomBtn.magnificPopup({
        type: 'image',
        image: {
            verticalFit: true
        }
        // zoom: {
        //     enabled: true,
        //     duration: 300
        // }
    });
};

module.exports = Basket;