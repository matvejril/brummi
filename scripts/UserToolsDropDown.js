function UserToolsDropDown (selector) {
    var that = this;
    this.$userToolsDropDown = $(selector);

    if (this.$userToolsDropDown[0]) {
        this.init(that);
    }
}

UserToolsDropDown.prototype.init = function(that) {
    this.elements = {
        $dropDownHead: this.$userToolsDropDown.find('.user-tools-drop-down__head'),
        $dropDownMenu: this.$userToolsDropDown.find('.user-tools-drop-down__menu'),
    };

    this.elements.$dropDownHead.on("click", function (e) {
        e.preventDefault();
        that.changeStateToggle(that, e);
    });

    $('body').on('click', function (e) {
        that.setDefaultState(that, e);
    });

};

UserToolsDropDown.prototype.changeStateToggle = function(that) {
    that.$userToolsDropDown.toggleClass('open');
    that.elements.$dropDownMenu.slideToggle(200);
};

UserToolsDropDown.prototype.setDefaultState = function(that, e) {
    var $targetElement = $(e.target);
    if (!($targetElement === that.$userToolsDropDown || $targetElement.parents('.user-tools-drop-down')[0])) {
        that.$userToolsDropDown.removeClass('open');
        that.elements.$dropDownMenu.slideUp(200);
    }
};

module.exports = UserToolsDropDown;
