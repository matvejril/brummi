function OrderPayment (selector) {
    var that = this;
    this.$orderPayment = $(selector);

    if (this.$orderPayment[0]) {
        this.init(that);
    }
}

OrderPayment.prototype.init = function(that) {
    this.elements = {
        $header: $('.header')
    };

    this.params = {
        orderPaymentPos: that.$orderPayment.position().top
    };

    that.updateOnScroll();

    window.addEventListener('scroll', function() {
        that.updateOnScroll();
    });
};

OrderPayment.prototype.updateOnScroll = function() {
    var headerHeight = this.elements.$header.outerHeight() + 20;
    var scrollWindow = window.pageYOffset + headerHeight;

    if (scrollWindow > this.params.orderPaymentPos) {
        this.$orderPayment.addClass('sticky');
        this.$orderPayment.css('top', headerHeight);
    } else {
        this.$orderPayment.removeClass('sticky');
    }
};

module.exports = OrderPayment;
