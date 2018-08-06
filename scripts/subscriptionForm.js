function SubscriptionForm (selector) {
    var that = this;
    this.$subscriptionForm = $(selector);

    if (this.$subscriptionForm[0]) {
        this.init();
    }
}

SubscriptionForm.prototype.init = function () {
    this.$subscriptionForm.each(function() {   // <- selects every <form> on page
        $(this).validate({        // <- initialize validate() on each form
            errorElement: "p",
            rules: {
                email: {
                    required: true,
                    email: true
                }
            },
            messages: {
                email: {
                    required: "Введите email адрес",
                    email: "Пожалуйста, введите email корректно"
                }
            }
        });
    });
};

module.exports = SubscriptionForm;
