function parallax() {
    // $(".banner-item").paroller({
    //     factor: 1,            // +/-, if no other breakpoint factor is set this value is selected
    //     type: 'background',     // background, foreground
    //     direction: 'vertical'   // vertical, horizontal
    // });
    // $(".reviews").paroller({
    //     factor: 1,            // +/-, if no other breakpoint factor is set this value is selected
    //     type: 'background',     // background, foreground
    //     direction: 'vertical'   // vertical, horizontal
    // });



    $('.banner-item').parallax();
    $('.reviews').parallax();
}

module.exports = parallax;
