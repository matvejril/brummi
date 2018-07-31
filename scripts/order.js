function Order (selector) {
    var that = this;
    this.$ourCertificates = $(selector);

    if (this.$ourCertificates[0]) {
        this.init();
    }
}

Order.prototype.init = function() {
    // this.elements = {
    //     $ourCertificatesLink: this.$ourCertificates.find('.our-certificates__item a')
    // };
    // // magnific popup
    // this.elements.$ourCertificatesLink.magnificPopup({
    //     type: 'image',
    //     image: {
    //         verticalFit: true
    //     },
    //     zoom: {
    //         enabled: true,
    //         duration: 300
    //     }
    // });
};

module.exports = Order;
