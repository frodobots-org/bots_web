$(function() {
    $('#navbar-container').load('/navbar.html', function() {
        $('.navbar a').each(function() {
            if(this.href === window.location.href) {
                $(this).addClass('active');
            }
        });
    });
    
    $('body').css('margin-left', '200px');
});
window.onload = async function () {
    const currentPage = window.location.pathname.split('/').pop();
    const links = document.querySelectorAll('.navbar a');
    links.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
};