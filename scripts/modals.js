function Modals (modal, defiantElem) {
    var that = this;
    this.modal = modal;

    if (this.modal) {
        this.defiantElem = defiantElem;
        this.init(that);
    }
}

Modals.prototype.init = function (that) {
    this.elements = {
        $modal:              $(this.modal),
        $closeBtn:           $(this.modal).find(".modal-close"),
        $tabs:               $(this.modal).find(".modal__tabs"),
        $modalContent:       $(this.modal).find(".modal__content"),
        $modalMobile:        $(this.modal).find(".modal__mobile")
    };


    // show modal
    $(this.defiantElem).on('click', function (e) {
        e.preventDefault();
        that.showModal(that);
    });


    this.elements.$closeBtn.on('click', function(e) {
        e.stopPropagation();
        that.hideModal(that, e)
    });
    // hide modal
    this.elements.$modal.on('click', function (e) {
        that.hideModal(that, e)
    });

    // change state modal
    this.elements.$tabs.children('div').on('click', function(e) {
        that.changeState(that, e);
    });

    // change state modal mobile
    this.elements.$modalMobile.children('a').on('click', function(e) {
        that.changeStateMobile(that, e);
    });
};

Modals.prototype.showModal = function (that) {

    $('.modal').fadeOut(300, function () {
        $(this).removeClass('opened').addClass('closed');
    });

    that.elements.$modal.fadeIn(300, function () {
        $(this).removeClass('closed').addClass('opened');
    });
};

Modals.prototype.hideModal = function (that, e) {
    var modal = that.elements.$modal;
    var currTarget = $(e.currentTarget).attr('class');

    if (e.target === modal[0] || currTarget === 'modal-close') {
        modal.fadeOut(300, function() {
            $(this).removeClass('open').addClass('closed');
        });
    }
};

Modals.prototype.changeState = function(that, e) {
    var targetDiv = e.target;

    // changeTab
    that.elements.$tabs.children('div').removeClass('active');
    $(targetDiv).addClass('active');

    // changeContent
    var activeTab = that.elements.$tabs.children('div').index(targetDiv);
    that.elements.$modalContent.children('div').removeClass('active');
    $(that.elements.$modalContent.children('div')[activeTab]).addClass('active');
};

Modals.prototype.changeStateMobile = function(that) {
    var $tabs = that.elements.$tabs.children('div');
    var $content = that.elements.$modalContent.children('div');
    var tabsActiveIndex = that.elements.$tabs.children('.active').index();

    $content.removeClass('active');
    $tabs.removeClass('active');
    if (tabsActiveIndex === 0) {
        $($content[1]).addClass('active');
        $($tabs[1]).addClass('active');
    } else if (tabsActiveIndex === 1) {
        $($content[0]).addClass('active');
        $($tabs[0]).addClass('active');
    }
};

module.exports = Modals;
