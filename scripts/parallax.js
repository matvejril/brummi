function parallax() {
    $(".banner-item__content").paroller({
        factor: 0.2,            // +/-, if no other breakpoint factor is set this value is selected
        type: 'foreground',     // background, foreground
        direction: 'vertical'   // vertical, horizontal
    });
    $(".reviews__title").paroller({
        factor: 0.1,
        type: 'foreground',     // background, foreground
        direction: 'vertical'   // vertical, horizontal
    });
    $(".review").paroller({
        factor: 0.3,            // +/-, if no other breakpoint factor is set this value is selected
        type: 'foreground',     // background, foreground
        direction: 'vertical'   // vertical, horizontal
    });
    $(".reviews__action").paroller({
        factor: 0.2,            // +/-, if no other breakpoint factor is set this value is selected
        type: 'foreground',     // background, foreground
        direction: 'vertical'   // vertical, horizontal
    });
}

module.exports = parallax;
