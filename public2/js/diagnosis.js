$(document).ready(() => {
    $("#navbar-container").load("navbar.html", function() {
        new bootstrap.Offcanvas(document.getElementById('sidebar'))
    });
    $('#export-diagnosis').click(function() {
        showToast('Diagnosis data exporting...');
        $.ajax({
            type: 'GET',
            url: '/api/v1/diagnosis/export',
            xhrFields: {
                responseType: 'arraybuffer'
            },
            success: function(data) {
                const blob = new Blob([data], { type: 'application/x-tar' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'diagnosis.tar';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                showToast('diagnosis.tar downloaded successfully');
            },
            error: function() {
                showToast('Export failed');
                $('#export-status').text('Failed to fetch diagnosis data');
            }
        });
    });

    function showToast(message) {
        const toastEl = document.getElementById('toast');
        const toast = new bootstrap.Toast(toastEl);
        toastEl.querySelector('.toast-body').textContent = message;
        toast.show();
    }
});