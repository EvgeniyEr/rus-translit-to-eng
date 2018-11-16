"use strict";

(function () {
    var $page = $('.page'),
        $inputPageTitle = $(".input-page-title");


    $('.btn-url-generation').on('click', function () {
        var val = $inputPageTitle.val(),
            url = helper.rusTranslitToEng(val);

        $page.trigger('url-generation', url);
    });
})();