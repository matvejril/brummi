function Popups (popup, defiantElem) {

    this.popup = popup;

    if (!this.popup) {
        return
    }

    var that = this;

    this.defiantElem = defiantElem;
    this.closeBtn = ".popup-close";

    var $tabs = $('.popup-auth__tabs').find('div');


    this.init(that);
}

Popups.prototype.init = function (that) {


    // show popup
    $(this.defiantElem).on('click', function (event) {
        event.preventDefault();
        that.showPopup();
    });

    // hide popup
    $(this.closeBtn).on('click', this.hidePopup);
    $(this.popup).on('click', this.hidePopup);


};




// // change state popup
// $tabs.on('click', this.changeState);
//
// // change state popup-mobile
// var $popupAuthMobile = $('.popup-auth__mobile').find('a');
// $popupAuthMobile.on('click', function(event) {
//     event.preventDefault();
//     that.changeStateMobile();
// });


Popups.prototype.showPopup = function () {
    $(this.popup).fadeIn(300, function () {
        $(this).addClass('opened');
    });
};


Popups.prototype.hidePopup = function (e) {
    var popupMain =  document.querySelector('.popup-auth');
    var closeBtn = document.querySelector(".popup-close");

    console.log("this", this);
    console.log("popupMain", popupMain);

    if (e.target === popupMain || this === closeBtn) {
        $(popupMain).fadeOut(300, function() {
            $(this).removeClass('open').addClass('closed');
        });
    }
};

// Popups.prototype.changeState = function() {
//     var $tabs = $('.popup-auth__tabs > div');
//     var $content = $('.popup-auth__content > div');
//
//     // changeTab
//     $tabs.removeClass('active');
//     $(this).addClass('active');
//
//     // changeContent
//     var activeTab = $tabs.index(this);
//     $content.removeClass('active');
//     $($content[activeTab]).addClass('active');
// };
//
//
// Popups.prototype.changeStateMobile = function() {
//     var $tabs = $('.popup-auth__tabs > div');
//     var $content = $('.popup-auth__content > div');
//
//     var $tabsActiveIndex = $('.popup-auth__tabs > .active').index();
//
//     $content.removeClass('active');
//     $tabs.removeClass('active');
//     if ($tabsActiveIndex === 0) {
//         $($content[1]).addClass('active');
//         $($tabs[1]).addClass('active');
//     } else if ($tabsActiveIndex === 1) {
//         $($content[0]).addClass('active');
//         $($tabs[0]).addClass('active');
//     }
// };
//
//

module.exports = Popups;
