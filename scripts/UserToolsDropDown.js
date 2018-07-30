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
        $dropDownMenu: this.$userToolsDropDown.find('.user-tools-drop-down__menu')
    };

    this.elements.$dropDownHead.on("click", function () {
        that.stateToggle(that);
    });
};

UserToolsDropDown.prototype.stateToggle = function(that) {
    that.$userToolsDropDown.toggleClass('open');
    that.elements.$dropDownMenu.slideToggle(200);
};

module.exports = UserToolsDropDown;
