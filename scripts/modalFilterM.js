window.addEventListener('load', function() {
    function ModalFilterM (modal, defiantElem) {
        var that = this;
        this.$modal = $(modal);

        if (this.$modal[0]) {
            this.defiantElem = defiantElem;
            this.init(that);
            console.log("this", this.$modal[0])
        }
    }

    ModalFilterM.prototype.init = function (that) {
        this.elements = {
            $modal:              this.$modal,
            $closeBtn:           this.$modal.find(".modal-close"),
            $modalContent:       this.$modal.find(".modal__content"),
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

    };

    ModalFilterM.prototype.showModal = function (that) {

        $('.modal').fadeOut(300, function () {
            $(this).removeClass('opened').addClass('closed');
        });

        that.elements.$modal.fadeIn(300, function () {
            $(this).removeClass('closed').addClass('opened');
        });
    };

    ModalFilterM.prototype.hideModal = function (that, e) {
        var modal = that.elements.$modal;
        var currTarget = $(e.currentTarget).attr('class');

        if (e.target === modal[0] || currTarget === 'modal-close') {
            modal.fadeOut(300, function() {
                $(this).removeClass('open').addClass('closed');
            });
        }
    };

    new ModalFilterM('.modal-filter-m', '.showFilterM');
});
