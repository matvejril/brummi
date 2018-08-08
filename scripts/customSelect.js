function customSelect (selector) {
    var that = this;
    this.$defaultSelect = $(selector);

    if (this.$defaultSelect[0]) {
        this.init();
    }
}

customSelect.prototype.init = function() {
    this.elements = {
        $defaultOption: $(this.$defaultSelect.find('option'))
    };

    // wrap custom select box
    this.$defaultSelect.wrap("<div class='custom-select-box'></div>");

    // hide default-select
    this.$defaultSelect.css("display", "none");

    // add custom-select-new
    this.$defaultSelect.after('<div class="custom-select-new">123</div>');

    // this.elements["$customSelectNew"] = $(this.$defaultSelect.find('.custom-select-new'));

    console.log("alala", $('.custom-select-new'));

    // custom-select-new input and options
    // this.elements.$customSelectNew.append('<div class="custom-select-new__input"></div>');
    // this.elements.$customSelectNew.append('<ul class="custom-select-new__options"></ul>');

    // console.log(this.elements);
    // var countOption = this.customOption.length;

    // for (var i = 0; i < countOption; i++) {
    //     var text = $this.children('option').eq(i).text().split(" ");
    //     $('<li />', {
    //         html: text[0] + "<em class='view-categories__amount'>"+ text[1] +"</em>",
    //         rel: $this.children('option').eq(i).val()
    //     }).appendTo($list);
    // }


    // var customOptionContent = this.elements.$customOption.innerText;

    // console.log(this.$defaultSelect);

    // $this.addClass('select-hidden');
    // $this.wrap('<div class="select"></div>');


};

module.exports = customSelect;
