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

        const enable = $('#proxy-enable').is(':checked');
        const ipValue = $('#proxy-ip').val().trim();
        const portValue = $('#proxy-port').val().trim();
        const usernameValue = $('#proxy-user').val().trim();
        const passwordValue = $('#proxy-pass').val().trim();

        const port = enable && portValue !== '' ? parseInt(portValue, 10) : null;
        if (enable && portValue !== '' && isNaN(port)) {
            showToast('Proxy port must be a valid integer', 'warning');
            return;
        }

        const formData = { enable };
        if (ipValue) formData.ip = ipValue;
        if (port !== null && !isNaN(port)) formData.port = port;
        if (usernameValue) formData.username = usernameValue;
        if (passwordValue) formData.password = passwordValue;

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
        $('#proxy-enable').prop('checked', data.enable || false);
        $('#proxy-ip').val(data.ip || '');
        $('#proxy-port').val(data.port && !isNaN(data.port) ? data.port.toString() : '');
        $('#proxy-user').val(data.username || '');
        $('#proxy-pass').val(data.password || '');
    }).fail(() => showToast('unable to get proxy settings', 'danger'));
});