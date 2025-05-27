$(function() {
    // 初始化摄像头设置
    function initCameraSettings(camType) {
        $.get(`/api/v1/camera/${camType}`, function(data) {
            $(`#${camType}-resolution`).val(data.resolution);
            $(`#${camType}-flip`).prop('checked', data.flip);
            $(`#${camType}-mirror`).prop('checked', data.mirror);
            $(`#${camType}-rotation`).val(data.rotation);
        });
    }

    // 初始化音频设置
    function initAudioSettings() {
        $.get('/api/v1/audio', function(data) {
            $('#mic-volume').val(data.mic).trigger('input');
            $('#speaker-volume').val(data.speaker).trigger('input');
        });
    }

    // 实时显示音量值
    $('input[type="range"]').on('input', function() {
        $(this).next('span').text(`${this.value}%`);
    });

    // 提交摄像头设置
    $('.info-card form').submit(function(e) {
        e.preventDefault();
        const camType = this.id.split('-')[0];
        const settings = {
            resolution: $(`#${camType}-resolution`).val(),
            flip: $(`#${camType}-flip`).prop('checked'),
            mirror: $(`#${camType}-mirror`).prop('checked'),
            rotation: $(`#${camType}-rotation`).val()
        };

        $.ajax({
            type: 'POST',
            url: `/api/v1/camera/${camType}`,
            data: JSON.stringify(settings),
            success: () => showAlert('Settings updated')
        });
    });

    // 初始化所有设置
    ['front', 'rear', 'usb'].forEach(initCameraSettings);
    initAudioSettings();
});