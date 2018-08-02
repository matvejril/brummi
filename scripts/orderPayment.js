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
    var scrollWindow = window.pageYOffset + this.elements.$header.outerHeight();

    if (scrollWindow > this.params.orderPaymentPos) {
        this.$orderPayment.addClass('sticky');
    } else {
        this.$orderPayment.removeClass('sticky');
    }

    // console.log("scrollWindow", scrollWindow, "that.params.orderPaymentPos", that.params.orderPaymentPos);
    // console.log("window", window.pageYOffset);
    // console.log(this);
    // console.log("this", that.$orderPayment.position().top);
};

module.exports = OrderPayment;
