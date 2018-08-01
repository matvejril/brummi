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

    $(window).scroll(function() {
        that.updateOnScroll(that)
    })


    // window.onscroll = function () {
    //     console.log("hellooo");
    //     // that.updateOnScroll();
    // }
};

OrderPayment.prototype.updateOnScroll = function(that) {

    var scrollWindow = window.pageYOffset + that.elements.$header.outerHeight();

    console.log(scrollWindow);

    if (scrollWindow > that.params.orderPaymentPos) {
        that.$orderPayment.addClass('sticky');
        // that.params.
        // console.log("oleoleole");
    } else {
        that.$orderPayment.removeClass('sticky');
    }

    console.log("scrollWindow", scrollWindow, "that.params.orderPaymentPos", that.params.orderPaymentPos)

    // console.log("window", window.pageYOffset);
    //
    // console.log(this);

    // console.log("this", that.$orderPayment.position().top);
};

module.exports = OrderPayment;
