$(document).ready(() => {
    $("#navbar-container").load("navbar.html", function() {
        new bootstrap.Offcanvas(document.getElementById('sidebar'))
    });
    function fetchWifiStatus() {
        $.ajax({
            url: '/api/v1/wifi/status',
            method: 'GET',
            success: (data) => {
                $('#wifi-ssid').val(data.ssid);
                $('#wifi-status').text(`Current connection: ${data.ssid || 'None'}`);
            },
            error: () => {
                showToast('Failed to fetch WiFi status', 'danger');
            }
        });
    }

    $('#wifi-form').on('submit', (e) => {
        e.preventDefault();
        if (!e.target.checkValidity()) {
            e.target.classList.add('was-validated');
            showToast('Please fill in required fields', 'warning');
            return;
        }

        const formData = {
            ssid: $('#wifi-ssid').val(),
            psk: $('#wifi-password').val(),
            security: $('#wifi-security').val()
        };

        $.ajax({
            url: '/api/v1/wifi/connect',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: () => {
                showToast('Connecting to WiFi...', 'info');
                $('#wifi-status').text('Connecting...');
                setTimeout(fetchWifiStatus, 10000);
            },
            error: () => {
                showToast('Connection failed', 'danger');
                $('#wifi-status').text('Connection failed');
            }
        });
    });

    function showToast(message, type = 'info') {
        const toast = new bootstrap.Toast($('#toast'));
        $('.toast-body').text(message);
        $('#toast').removeClass().addClass(`toast align-items-center text-white bg-${type} border-0`);
        toast.show();
    }

    fetchWifiStatus();
});