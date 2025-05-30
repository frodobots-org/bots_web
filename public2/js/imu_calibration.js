$(document).ready(() => {
    $("#navbar-container").load("navbar.html", function() {
        new bootstrap.Offcanvas(document.getElementById('sidebar'))
    });

    const $calibrateForm = $('#imu-calibration-form');
    const $submitBtn = $calibrateForm.find('button[type="submit"]');
    const $stopBtn = $('<button type="button" class="btn btn-danger ms-2 d-none">Stop Calibration</button>').insertAfter($submitBtn);

    $calibrateForm.on('submit', function(e) {
        e.preventDefault();
        if (!this.checkValidity()) {
            e.stopPropagation();
            this.classList.add('was-validated');
            return;
        }

        const formData = { command: 1 };
        $.ajax({
            url: '/api/v1/imu/calibrate',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: () => {
                showToast('Calibration started successfully', 'success');
                $submitBtn.addClass('d-none');
                $stopBtn.removeClass('d-none');
            },
            error: () => showToast('Calibration failed', 'danger')
        });
    });

    $stopBtn.on('click', function() {
        const formData = { command: 0 };
        $.ajax({
            url: '/api/v1/imu/calibrate',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: () => {
                showToast('Calibration stopped successfully', 'success');
                $stopBtn.addClass('d-none');
                $submitBtn.removeClass('d-none');
            },
            error: () => showToast('Stop calibration failed', 'danger')
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