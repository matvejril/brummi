function helpers() {

    var acceptCookies = document.querySelector('.accept-cookies');
    if (!!acceptCookies) {
        acceptCookiesInit();
    }
    function acceptCookiesInit() {
        var acceptCookiesBtn = document.querySelector('.accept-cookies__action');
        acceptCookiesBtn.addEventListener('click', hideBlock);

        function hideBlock (e) {
            e.preventDefault();
            $(acceptCookies).fadeOut(400, function() {
                $(this).addClass("hidden");
            });
        }
    }



    var catalogQuickViewCount = document.querySelector('.catalog-quick-view__count');
    if (!!catalogQuickViewCount) {
        counterInit();
    }
    function counterInit() {
        var btnMinus = catalogQuickViewCount.querySelector('.minus');
        var btnPlus = catalogQuickViewCount.querySelector('.plus');
        btnMinus.addEventListener('click', function(e) {
            e.preventDefault();
            this.parentNode.querySelector('input').stepDown();
        });
        btnPlus.addEventListener('click', function(e) {
            e.preventDefault();
            this.parentNode.querySelector('input').stepUp();
        });
    }
}

module.exports = helpers;
