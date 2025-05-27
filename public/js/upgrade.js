$(function() {
    const status = $('#status');
    const otaFile = $('#ota-file');
    const startBtn = $('#start-upgrade');

    $('#select-file').click(function() {
        otaFile.click();
    });

    otaFile.on('change', function(e) {
        if(e.target.files.length > 0) {
            const allowedExt = ['zip', 'gz', 'img', 'tar', 'bin'];
            const fileExt = e.target.files[0].name.split('.').pop().toLowerCase();
            
            if(allowedExt.includes(fileExt)) {
                startBtn.prop('disabled', false);
                status.html(`selected file：${e.target.files[0].name}`);
            } else {
                showAlert('unsupported file format');
                otaFile.val('');
                startBtn.prop('disabled', true);
            }
        }
    });

    startBtn.click(function() {
        if(!otaFile[0].files.length) return;

        const formData = new FormData();
        formData.append('firmware', otaFile[0].files[0]);
        
        showLoader(); // 现在该函数已定义
        $.ajax({
            type: 'POST',
            url: '/api/v1/ota',
            data: formData,
            processData: false,
            contentType: false,
            success: function(data) {
                showAlert('doing firmware upgrade...');
                pollUpgradeStatus();
            },
            error: function() {
                showAlert('firmware update failed');
                startBtn.prop('disabled', true);
            }
        });
    });

    function pollUpgradeStatus() {
        $.get('/api/v1/ota/status', function(res) {
            if(res.progress < 100) {
                status.html(`progress ：${res.progress}%`);
                setTimeout(pollUpgradeStatus, 2000);
            } else {
                showAlert('rebooting...');
                status.empty();
            }
        });
    }
});

// 新增loader控制函数
function showLoader() {
    $('#modal').css('display', 'block');
    $('.loader').css('display', 'block');
}

function showAlert(message) {
    $('.loader').css('display', 'none');
    $('#alert').css('display', 'block');
    setTimeout(function() {
        $('#alert').css('display', 'none');
        $('#modal').css('display', 'none');
    }, 3000);
}