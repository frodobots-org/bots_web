$(document).ready(() => {
    $("#navbar-container").load("navbar.html", function() {
        new bootstrap.Offcanvas(document.getElementById('sidebar'))
    });
    $('#imu-calibration-form').on('submit', function(e) {
        e.preventDefault();
        if (!this.checkValidity()) {
            e.stopPropagation();
            this.classList.add('was-validated');
            return;
        }

        const formData = {};
        $.ajax({
            url: '/api/v1/imu/calibrate',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: () => showToast('Calibration started successfully', 'success'),
            error: () => showToast('Calibration failed', 'danger')
        });
    });

    function updateHeading() {
        $.ajax({
            url: '/api/v1/imu',
            success: function(data) {
                $('#heading-value').text(`${Math.round(data.heading)}°`);
            },
            error: function() {
                $('#heading-value').text('got error');
            }
        });
    }

    setInterval(updateHeading, 1000);

    function showToast(message, type = 'info') {
        const toast = new bootstrap.Toast($('#toast'));
        $('.toast-body').text(message);
        $('#toast').removeClass().addClass(`toast align-items-center text-white bg-${type} border-0`);
        toast.show();
    }
});