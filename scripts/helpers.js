function helpers() {
    var acceptCookiesBtn = document.querySelector('.accept-cookies__action');
    acceptCookiesBtn.addEventListener('click', hideBlock);

    function hideBlock (e) {
        e.preventDefault();
        document.querySelector('.accept-cookies').classList.add('hidden');
        console.log("ololo");
    }

}

module.exports = helpers;
