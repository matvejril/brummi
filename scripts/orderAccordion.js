function OrderAccordion (selector) {
    var that = this;
    this.accordionParent = $(selector);

    if (this.accordionParent[0]) {
        this.init(that);
    }
}

OrderAccordion.prototype.init = function(that) {
    this.elements = {
        $accordItem: this.accordionParent.find('.order-accordion-item'),
        $accordItemHead: this.accordionParent.find('.order-accordion-item__head'),
        $accordItemBody: this.accordionParent.find('.order-accordion-item__body'),
        $accordItemBtn: this.accordionParent.find('.order-accordion-item__actions a')
    };

    // set initial state
    var initialItem = this.elements.$accordItem[0];
    this.elements.$accordItemBody.css("display", "none");
    $(initialItem).addClass('active');
    $(this.elements.$accordItemBody[0]).css("display", "block");


    // add events
    this.elements.$accordItemBtn.on("click", function(e) {
        var callingElem = this;
        e.preventDefault();
        that.accordItemAction(callingElem)
    });
};


OrderAccordion.prototype.accordItemAction = function (callingElem) {
    var callingElemParent = $(callingElem).parents('.order-accordion-item');
    var callingElemIndex = callingElemParent.index() + 1;

    this.elements.$accordItem.removeClass('active');
    this.elements.$accordItemBody.slideUp(300);

    var $callingElem = $(this.elements.$accordItem[callingElemIndex]);
    $callingElem.addClass('active');
    $callingElem.attr("data-visited", "true");
    $(this.elements.$accordItem[callingElemIndex]).slideDown(300);
};

module.exports = OrderAccordion;
