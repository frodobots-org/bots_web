$(document).ready(() => {
    $("#navbar-container").load("navbar.html", function() {
        new bootstrap.Offcanvas(document.getElementById('sidebar'));
    });

    initMediaSettings();


    $('#mic-slider').on('input', function(e) {
        $('#mic-value').text(`${e.target.value}%`);
    }).on('change', function(e) {
        updateVolume('mic', parseInt(e.target.value));
    });

    $('#speaker-slider').on('input', function(e) {
        $('#speaker-value').text(`${e.target.value}%`); 
    }).on('change', function(e) {
        updateVolume('speaker', parseInt(e.target.value));
    });

    $('.camera-form').submit(function(e) {
        e.preventDefault();
        const $form = $(this);
        const cameraType = $form.closest('.card').find('h5').text().toLowerCase().trim();
        
        const resolutionMap = {
            'front-camera': { 
                '1920x1080 (Full HD)': 1, 
                '1280x720 (HD)': 2, 
                '1024x576 (SD)': 3 
            },
            'rear-camera': { 
                '960x540 (WVGA)': 1, 
                '640x360 (nHD)': 2, 
                '480x270 (qHD)': 3 
            },
            'usb-camera': { 
                '1280x720 (HD)': 1, 
                '640x480 (VGA)': 2 
            }
        };

        const formData = {
            resolution: resolutionMap[cameraType][$form.find('select').eq(0).val()],
            flip: $form.find('.form-check-input:eq(0)').prop('checked'),
            mirror: $form.find('.form-check-input:eq(1)').prop('checked'),
            rotation: parseInt($form.find('select').eq(1).val().replace('°', ''))
        };

        console.log(formData);
        saveCameraSettings(cameraType, formData);
    });

    function initMediaSettings() {
        const reverseResolutionMap = {
            'front-camera': { 1: '1920x1080 (Full HD)', 2: '1280x720 (HD)', 3: '1024x576 (SD)' },
            'rear-camera': { 1: '960x540 (WVGA)', 2: '640x360 (nHD)', 3: '480x270 (qHD)' },
            'usb-camera': { 1: '1280x720 (HD)', 2: '640x480 (VGA)' }
        };

        $('.camera-form').each(function() {
            const $form = $(this);
            const cameraType = $form.closest('.card').find('h5').text().toLowerCase();
            
            $.get(`/api/v1/camera/${cameraType}`)
                .done(settings => {
                    $form.find('select').eq(0).val(reverseResolutionMap[cameraType][settings.resolution]);
                    $form.find('.form-check-input:eq(0)').prop('checked', settings.flip);
                    $form.find('.form-check-input:eq(1)').prop('checked', settings.mirror);
                    $form.find('select').eq(1).val(`${settings.rotation}°`);
                })
                .fail(() => showToast(`Failed to load initial settings for ${cameraType}`));
        });

        $.get('/api/v1/mic/volume')
            .done(data => {
                $('#mic-slider').val(data.value);
                $('#mic-value').text(`${data.value}%`);
            })
            .fail(() => showToast('Failed to load initial mic volume'));

        $.get('/api/v1/speaker/volume')
            .done(data => {
                $('#speaker-slider').val(data.value);
                $('#speaker-value').text(`${data.value}%`);
            })
            .fail(() => showToast('Failed to load initial speaker volume'));
    }

    function updateVolume(type, value) {
        $.ajax({
            url: `/api/v1/${type}/volume`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ value: value }),
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
