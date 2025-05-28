$(document).ready(() => {
    $("#navbar-container").load("navbar.html", function() {
        new bootstrap.Offcanvas(document.getElementById('sidebar'))
    });

    function fetchCurrentVersion() {
        $.ajax({
            url: '/api/v1/upgrade/version',
            method: 'GET',
            success: (data) => {
                $('#current-version').val(data.current);
                $('#new-version').val(data.latest);
            },
            error: () => {
                showToast('Failed to fetch version info', 'danger');
            }
        });
    }

    $('#start-upgrade').click(() => {
        const file = $('#upgrade-package')[0].files[0];
        if (!file) {
            showToast('Please select an upgrade package', 'warning');
            return;
        }

        const formData = new FormData();
        formData.append('package', file);

        $.ajax({
            url: '/api/v1/upgrade/start',
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            xhr: function() {
                const xhr = new window.XMLHttpRequest();
                xhr.upload.addEventListener('progress', (e) => {
                    if (e.lengthComputable) {
                        const percent = (e.loaded / e.total) * 100;
                        $('#upgrade-status').text(`Uploading: ${percent.toFixed(1)}%`);
                    }
                });
                return xhr;
            },
            success: () => {
                showToast('Upgrade started successfully', 'success');
                $('#upgrade-status').text('Upgrade in progress...');
            },
            error: () => {
                showToast('Upgrade failed', 'danger');
                $('#upgrade-status').text('Upgrade failed');
            }
        });
    });

    function showToast(message, type = 'info') {
        const toast = new bootstrap.Toast($('#toast'));
        $('.toast-body').text(message);
        $('#toast').removeClass().addClass(`toast align-items-center text-white bg-${type} border-0`);
        toast.show();
    }

    fetchCurrentVersion();
});