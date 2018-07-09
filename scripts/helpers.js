function helpers() {
    var acceptCookies = document.querySelector('.accept-cookies');
    if (acceptCookies) {
        init();
    }


    function init() {
        var acceptCookiesBtn = document.querySelector('.accept-cookies__action');
        acceptCookiesBtn.addEventListener('click', hideBlock);

        function hideBlock (e) {
            e.preventDefault();
            document.querySelector('.accept-cookies').classList.add('hidden');
        }
    }
}

module.exports = helpers;
