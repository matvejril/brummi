function Popups (selector) {
    var that = this;
    this.popup = selector;

    if (!this.popup) {
        return
    }

    var $tabs = $('.popup-auth__tabs').find('div');
    $tabs.on('click', this.changeState);

    var $userProfile = $(".profile");
    $userProfile.on('click', function (event) {
        event.preventDefault();
        that.showPopup();
    });

    var $closeBtn = $(".popup-auth__btn-close");
    $closeBtn.on('click', this.hidePopup);
    $(this.popup).on('click', this.hidePopup);
}


Popups.prototype.changeState = function() {
    var $tabs = $('.popup-auth__tabs > div');
    var $content = $('.popup-auth__content > div');

    // changeTab
    $tabs.removeClass('active');
    $(this).addClass('active');

    // changeContent
    var activeTab = $tabs.index(this);
    $content.css('display', "none");
    $($content[activeTab]).css('display', "block");
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
