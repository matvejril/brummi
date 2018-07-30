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
        $dropDownMenuLi: this.$userToolsDropDown.find('li'),
        $dropDownMenuA: this.$userToolsDropDown.find('a')
    };

    this.elements.$dropDownHead.on("click", function (e) {
        e.preventDefault();
        that.stateToggle(that, e);
    });

    // var budyElem = document.querySelector('body');
    //
    // budyElem.addEventListener("click", function() {
    //     console.log("hello");
    // })
    $('body').on('click', function (e) {
        // console.log("ololo");
        // var targetElem = e.target;
        // console.log(targetElem);

        // console.log(that.elements.$dropDownMenuLi);

        // console.log(this);
        // if (e.target === that.elements.$dropDownMenu) {
        //     console.log("asdasd")
        // }

        console.log(e.target);

        // that.$userToolsDropDown.removeClass('open');
        // that.elements.$dropDownMenu.slideUp(200);



    })

};

UserToolsDropDown.prototype.stateToggle = function(that) {
    that.$userToolsDropDown.toggleClass('open');
    that.elements.$dropDownMenu.slideToggle(200);
};

module.exports = UserToolsDropDown;
