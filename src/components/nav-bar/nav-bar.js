$(document).ready(function () {
    $(".nav-btn").click(function (e) {
        e.preventDefault();
        let id = $(this).attr("scroll-to")
        $('html, body').animate({
            scrollTop: $(id).offset().top - 80
        }, 2000);
    });
});