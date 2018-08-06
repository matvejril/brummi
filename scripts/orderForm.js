function OrderForm (selector) {
    var that = this;
    this.$orderForm = $(selector);

    if (this.$orderForm[0]) {
        this.init(that);
    }
}

OrderForm.prototype.init = function(that) {
    this.elements = {
        $accordItem: this.$orderForm.find('.order-accordion-item'),
        $accordItemHead: this.$orderForm.find('.order-accordion-item__head'),
        $accordItemBody: this.$orderForm.find('.order-accordion-item__body'),
        $accordItemBtn: this.$orderForm.find('.order-accordion-item__actions a'),
        $formSubmitBtn: this.$orderForm.find('.order-payment__action')
    };

    this.validParams = {
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
        errorPlacement: function(error, element) {},

        ignore: []
    };

    this.elements.$orderFormValid = this.$orderForm.validate(this.validParams);

    // set initial state
    var $initialItem = $(this.elements.$accordItem[0]);
    var $initialBody = $(this.elements.$accordItemBody[0]);

    $initialItem.addClass('active');
    $initialItem.attr("data-visited", "true");
    this.elements.$accordItemBody.not($initialBody).css("display", "none");

    this.$orderForm.validate(this.validParams);

    // add events
    this.elements.$accordItemBtn.on("click", function(e) {
        var callingElem = this;
        e.preventDefault();
        that.accordionItemBtnAction(callingElem);
    });

    this.elements.$accordItemHead.on("click", function() {
        var callingElem = this;
        that.accordionItemHeadAction(callingElem);
    });

    this.elements.$formSubmitBtn.on("click", function(e) {
        e.preventDefault();
        that.submitForm();
    })
};

OrderForm.prototype.accordionItemBtnAction = function (callingElem) {
    this.elements.$orderFormValid.settings.ignore = ":hidden";
    var resltValid = this.$orderForm.valid();

    if (resltValid) {
        var callingElemParent = $(callingElem).parents('.order-accordion-item');
        var callingElemIndex = callingElemParent.index();
        var $callingElem = $(this.elements.$accordItem[callingElemIndex + 1]);

        // clear state
        this.elements.$accordItem.removeClass('active');
        this.elements.$accordItemBody.slideUp(300);

        // set state
        $callingElem.addClass('active');
        $callingElem.attr("data-visited", "true");
        $(this.elements.$accordItemBody[callingElemIndex + 1]).slideDown(300, function() {
            // get elem position
            var callingElemPosTop = $callingElem.position().top;

            // set window position
            $('html, body').animate({scrollTop: callingElemPosTop - $('.header').outerHeight() - 20}, 500);
        });
    }
};

OrderForm.prototype.accordionItemHeadAction = function(callingElem) {
    var callingElemParent = $(callingElem).parents('.order-accordion-item');

    if (callingElemParent.attr('data-visited') && !callingElemParent.hasClass('active')) {
        var callingElemIndex = callingElemParent.index();

        // clear state
        this.elements.$accordItem.removeClass('active');
        this.elements.$accordItemBody.slideUp(300);

        // set state
        $(this.elements.$accordItem[callingElemIndex]).addClass('active');
        $(this.elements.$accordItemBody[callingElemIndex]).slideDown(300, function() {
            // get elem position
            var callingElemPosTop = callingElemParent.position().top;

            // set window position
            $('html, body').animate({scrollTop: callingElemPosTop - $('.header').outerHeight() - 20}, 500);
        });
    }
};

OrderForm.prototype.submitForm = function() {
    this.elements.$orderFormValid.settings.ignore = "";
    var resltValid = this.$orderForm.valid();
    if (resltValid) {
        this.$orderForm.submit();
    }
};

module.exports = OrderForm;
