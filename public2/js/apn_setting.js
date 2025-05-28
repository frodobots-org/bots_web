$(document).ready(() => {
    $("#navbar-container").load("navbar.html", function() {
        new bootstrap.Offcanvas(document.getElementById('sidebar'))
    });
    // Bootstrap form validation
    $('#apn-form').on('submit', function(e) {
        e.preventDefault();
        if (!this.checkValidity()) {
            e.stopPropagation();
            this.classList.add('was-validated');
            return;
        }

        const formData = {
            apn: $('#apn').val(),
            auth: $('#auth').val(),
            username: $('#username').val(),
            password: $('#password').val(),
            pin: $('#pin').val()
        };

        $.ajax({
            url: '/api/apn',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: () => showToast('Settings saved', 'success'),
            error: () => showToast('Save failed', 'danger')
        });
    });


    $('#pdp-import').click(() => $('#pdp-file').click());
    $('#pdp-file').change(function(e) {
        if (!e.target.files.length) return;
        
        const formData = new FormData();
        formData.append('pdp_file', e.target.files[0]);

        $.ajax({
            url: '/api/v1/pdp/import',
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: () => showToast('PDP configuration imported successfully', 'success'),
            error: () => showToast('Import failed', 'danger')
        });
    });

    $('#pdp-export').click(() => {
        showToast('Generating configuration file...', 'info');
        
        $.get('/api/v1/pdp/export')
        .done(data => {
            const blob = new Blob([data], {type: 'text/csv'});
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `pdp-config_${new Date().toISOString().slice(0,10)}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        })
        .fail(() => showToast('Export failed', 'danger'));
    });

    function showToast(message, type = 'info') {
        const toast = new bootstrap.Toast($('#toast'));
        $('.toast-body').text(message);
        $('#toast').removeClass().addClass(`toast align-items-center text-white bg-${type} border-0`);
        toast.show();
    }
});