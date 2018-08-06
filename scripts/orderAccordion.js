function OrderAccordion (selector) {
    var that = this;
    this.$accordionParent = $(selector);

    if (this.$accordionParent[0]) {
        this.init(that);
    }
}

OrderAccordion.prototype.init = function(that) {
    // this.elements = {
    //     $accordItem: this.$accordionParent.find('.order-accordion-item'),
    //     $accordItemHead: this.$accordionParent.find('.order-accordion-item__head'),
    //     $accordItemBody: this.$accordionParent.find('.order-accordion-item__body'),
    //     $accordItemBtn: this.$accordionParent.find('.order-accordion-item__actions a')
    // };

    // set initial state
    var $initialItem = $(this.elements.$accordItem[0]);
    var $initialBody = $(this.elements.$accordItemBody[0]);

    $initialItem.addClass('active');
    $initialItem.attr("data-visited", "true");
    this.elements.$accordItemBody.not($initialBody).css("display", "none");

    // add events
    this.elements.$accordItemBtn.on("click", function(e) {
        var callingElem = this;
        e.preventDefault();
        // console.log(this);
        // $(this).validate();
        // that.accordionItemBtnAction(callingElem);
    });

    this.elements.$accordItemHead.on("click", function() {
        var callingElem = this;
        that.accordionItemHeadAction(callingElem);
    });
};


// OrderAccordion.prototype.accordionItemBtnAction = function (callingElem) {
//     var callingElemParent = $(callingElem).parents('.order-accordion-item');
//     var callingElemIndex = callingElemParent.index();
//     var $callingElem = $(this.elements.$accordItem[callingElemIndex + 1]);
//
//     // clear state
//     this.elements.$accordItem.removeClass('active');
//     this.elements.$accordItemBody.slideUp(300);
//
//     // set state
//     $callingElem.addClass('active');
//     $callingElem.attr("data-visited", "true");
//     $(this.elements.$accordItemBody[callingElemIndex + 1]).slideDown(300, function() {
//         // get elem position
//         var callingElemPosTop = $callingElem.position().top;
//
//         // set window position
//         $('html, body').animate({scrollTop: callingElemPosTop - $('.header').outerHeight() - 20}, 500);
//     });
// };
//
// OrderAccordion.prototype.accordionItemHeadAction = function(callingElem) {
//     var callingElemParent = $(callingElem).parents('.order-accordion-item');
//
//     if (callingElemParent.attr('data-visited') && !callingElemParent.hasClass('active')) {
//         var callingElemIndex = callingElemParent.index();
//
//         // clear state
//         this.elements.$accordItem.removeClass('active');
//         this.elements.$accordItemBody.slideUp(300);
//
//         // set state
//         $(this.elements.$accordItem[callingElemIndex]).addClass('active');
//         $(this.elements.$accordItemBody[callingElemIndex]).slideDown(300, function() {
//             // get elem position
//             var callingElemPosTop = callingElemParent.position().top;
//
//             // set window position
//             $('html, body').animate({scrollTop: callingElemPosTop - $('.header').outerHeight() - 20}, 500);
//         });
//     }
// };

module.exports = OrderAccordion;
