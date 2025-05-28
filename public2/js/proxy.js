$(document).ready(() => {
    $("#navbar-container").load("navbar.html", function() {
        new bootstrap.Offcanvas(document.getElementById('sidebar'))
    });

    $('#proxy-form').on('submit', function(e) {
        e.preventDefault();
        if (!this.checkValidity()) {
            e.stopPropagation();
            this.classList.add('was-validated');
            showToast('Please fill in required fields correctly', 'warning');
            return;
        }


        const formData = {
            enable: $('#proxy-enable').is(':checked'),
            ip: $('#proxy-ip').val().trim(),
            port: $('#proxy-port').val().trim(),
            username: $('#proxy-user').val().trim(),
            password: $('#proxy-pass').val().trim()
        };

        $.ajax({
            url: '/api/v1/proxy/settings',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: () => showToast('Proxy settings saved successfully', 'success'),
            error: () => showToast('Failed to save proxy settings', 'danger')
        });
    });

    function showToast(message, type = 'info') {
        const toast = new bootstrap.Toast($('#toast'));
        $('.toast-body').text(message);
        $('#toast').removeClass().addClass(`toast align-items-center text-white bg-${type} border-0`);
        toast.show();
    }

    $.get("/api/v1/proxy/settings", function(data) {
        $('#proxy-enable').prop('checked', data.enabled || false);

        $('#proxy-ip').val('');
        $('#proxy-port').val('');
        $('#proxy-user').val('');
        $('#proxy-pass').val('');
    }).fail(() => showToast('unable to get proxy settings', 'danger'));
});