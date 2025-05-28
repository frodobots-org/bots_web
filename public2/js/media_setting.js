$(document).ready(() => {
    $("#navbar-container").load("navbar.html", function() {
        new bootstrap.Offcanvas(document.getElementById('sidebar'));
    });

    $('#mic-slider').on('input', function(e) {
        $('#mic-value').text(`${e.target.value}%`);
        updateVolume('mic', e.target.value);
    });

    $('#speaker-slider').on('input', function(e) {
        $('#speaker-value').text(`${e.target.value}%`);
        updateVolume('speaker', e.target.value);
    });

    $('.camera-form').submit(function(e) {
        e.preventDefault();
        const formData = {
            resolution: $(this).find('select').eq(0).val(),
            flip: $(this).find('.form-check-input:eq(0)').prop('checked'),
            mirror: $(this).find('.form-check-input:eq(1)').prop('checked'),
            rotation: $(this).find('select').eq(1).val().replace('°', '')
        };

        saveCameraSettings($(this).closest('.card').find('h5').text().toLowerCase(), formData);
    });

    function updateVolume(type, value) {
        $.ajax({
            url: `/api/v1/${type}/volume`,
            method: 'POST',
            data: { value: value },
            success: () => showToast(`${type} volume updated`),
            error: () => showToast('Update failed')
        });
    }

    function saveCameraSettings(cameraType, settings) {
        $.ajax({
            url: `/api/v1/camera/${cameraType}`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(settings),
            success: () => showToast('Settings saved'),
            error: () => showToast('Save failed')
        });
    }

    function showToast(message) {
        const toast = new bootstrap.Toast($('#liveToast'));
        $('.toast-body').text(message);
        toast.show();
    }
});