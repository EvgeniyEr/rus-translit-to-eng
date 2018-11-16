"use strict";

(function () {
    var $page = $('.page'),
        $inputPageUrl = $(".input-page-url");

    $page.on('url-generation', function (e, url) {
        $inputPageUrl.val(url);
    });
})();
