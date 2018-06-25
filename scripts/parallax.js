function parallax() {
    var banner = new Rellax('.banner-item__bg', {
        speed: -10,
        center: false,
        wrapper: null,
        round: true,
        vertical: true,
        horizontal: false
    });

    $('.reviews').parallax();
}

module.exports = parallax;
