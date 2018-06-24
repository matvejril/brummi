var mobileNav = function() {
    var $headerNavMobile = $('.header-nav-mobile');
    var $headerNavMobileList = $('.header-nav-mobile__list');
    var header = document.querySelector('header');
    var logo = document.querySelector('.logo');
    var body = document.querySelector('body');

    var headerNavMobileBtn = document.querySelector('.header-nav-mobile__btn');

    headerNavMobileBtn.addEventListener('click', navToggle);

    function navToggle () {
        $headerNavMobile.toggleClass('active');
        $headerNavMobileList.slideToggle(250);

        if (!(document.documentElement.clientWidth < 768-17)) {
            return
        }

        var headerHeight;

        if ($headerNavMobile.hasClass('active') && !header.classList.contains('sticky')) {
            logo.style.display = "none";
            headerHeight = header.offsetHeight;
            body.style.paddingTop = headerHeight + "px";
        } else {
            logo.style.display = "block";
            headerHeight = header.offsetHeight;
            body.style.paddingTop = headerHeight + "px";
        }
    }
};

// window.onresize = function() {
//     console.log("hello");
// };

module.exports = mobileNav;



// function MobileNav(selector) {
//     this.navMobile = document.querySelector(selector);
//
//     if (!this.navMobile) {
//         return;
//     }
//
//     this.$headerNavMobile = $('.header-nav-mobile');
//     this.$headerNavMobileList = $('.header-nav-mobile__list');
//     var headerNavMobileBtn = document.querySelector('.header-nav-mobile__btn');
//
//     var that = this;
//     headerNavMobileBtn.addEventListener('click', this.navToggle(that));
// }
//
// MobileNav.prototype.navToggle = function(that) {
//     console.log(this)
//     that.$headerNavMobile.toggleClass('active');
//     that.$headerNavMobileList.slideToggle();
// };
//
//
// module.exports = MobileNav;
