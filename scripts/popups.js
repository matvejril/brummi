function Popups (selector) {
    var that = this;
    this.popup = selector;

    if (!this.popup) {
        return
    }

    // show popup
    var $userProfile = $(".profile");
    $userProfile.on('click', function (event) {
        event.preventDefault();
        that.showPopup();
    });

    // hide popup
    var $closeBtn = $(".popup-auth__btn-close");
    $closeBtn.on('click', this.hidePopup);
    $(this.popup).on('click', this.hidePopup);

    // change state popup
    var $tabs = $('.popup-auth__tabs').find('div');
    $tabs.on('click', this.changeState);

    // change state popup-mobile
    var $popupAuthMobile = $('.popup-auth__mobile').find('a');
    $popupAuthMobile.on('click', function(event) {
        event.preventDefault();
        that.changeStateMobile();
    });
}


Popups.prototype.changeState = function() {
    var $tabs = $('.popup-auth__tabs > div');
    var $content = $('.popup-auth__content > div');

    // changeTab
    $tabs.removeClass('active');
    $(this).addClass('active');

    // changeContent
    var activeTab = $tabs.index(this);
    $content.removeClass('active');
    $($content[activeTab]).addClass('active');
};


Popups.prototype.changeStateMobile = function() {
    var $tabs = $('.popup-auth__tabs > div');
    var $content = $('.popup-auth__content > div');

    var $tabsActiveIndex = $('.popup-auth__tabs > .active').index();

    $content.removeClass('active');
    $tabs.removeClass('active');
    if ($tabsActiveIndex === 0) {
        $($content[1]).addClass('active');
        $($tabs[1]).addClass('active');
    } else if ($tabsActiveIndex === 1) {
        $($content[0]).addClass('active');
        $($tabs[0]).addClass('active');
    }
};


Popups.prototype.showPopup = function () {
    // $(this.popup).addClass('open');
    $(this.popup).fadeIn(300);
};


Popups.prototype.hidePopup = function (e) {
    var popupMain =  document.querySelector('.popup');
    var closeBtn = document.querySelector(".popup-auth__btn-close");

    // console.log($closeBtn, this);

    if (e.target === popupMain || this === closeBtn) {
        $(popupMain).fadeOut(300);
    }
};


module.exports = Popups;
