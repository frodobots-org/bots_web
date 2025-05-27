$(function() {
    let isCalibrating = false;
    const statusEl = $('#calibration-status');
    
    function showLoader() {
        $('#modal').css('display', 'block');
        $('.loader').css('display', 'block');
    }

    function showAlert(message) {
        $('.loader').css('display', 'none');
        $('#alert').css('display', 'block');
        setTimeout(() => {
            $('#alert').css('display', 'none');
            $('#modal').css('display', 'none');
        }, 3000);
    }

    $('#calibration-toggle').click(function() {
        isCalibrating = !isCalibrating;
        const endpoint = isCalibrating ? 'start' : 'stop';
        const buttonText = isCalibrating ? 'Stop Calibration' : 'Start Calibration';
        
        $(this).text(buttonText);
        statusEl.text(isCalibrating ? 'Calibration in progress...' : 'Calibration stopped');
        
        showLoader();
        $.ajax({
            type: 'POST',
            url: `/api/v1/calibration/${endpoint}`,
            success: function() {
                showAlert(isCalibrating ? 'Calibration started' : 'Calibration completed');
            },
            error: function() {
                showAlert('Calibration operation failed');
                isCalibrating = !isCalibrating;
                $('#calibration-toggle').text(isCalibrating ? 'Stop Calibration' : 'Start Calibration');
            }
        });
    });
});


// 新增航向值轮询
function updateHeading() {
    $.ajax({
        url: '/api/v1/imu',
        success: function(data) {
            $('#heading-value').text(`${Math.round(data.heading)}°`);
        }
    });
}

// 启动航向更新
setInterval(updateHeading, 1000);