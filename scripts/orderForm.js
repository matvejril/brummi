function OrderForm (selector) {
    var that = this;
    this.$orderForm = $(selector);

    if (this.$orderForm[0]) {
        this.init();
    }
}

OrderForm.prototype.init = function() {

    $.validator.setDefaults({
        ignore: []
    });

    // validation form
    this.$orderForm.validate({
        errorElement: "p",
        rules: {
            // Контактные данные
            country: {
                required: true
            },
            city: {
                required: true
            },
            street: {
                required: true
            },
            house: {
                required: true
            },
            room: {
                required: true
            },

            // Способ доставки
            delivery: {
                required: true
            },
            // Способ полаты
            payment: {
                required: true
            },

            // личные данные
            lastname: {
                required: true,
                minlength: 2
            },
            firstname: {
                required: true,
                minlength: 2
            },
            phone: {
                required: true
            },
            email: {
                required: true,
                email: true
            }
        },
        errorPlacement: function(error, element) {}
    });
};


module.exports = OrderForm;
