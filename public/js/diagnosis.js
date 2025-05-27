$(function() {
    $('#export-diagnosis').click(function() {
        showLoader();
        $.ajax({
            type: 'GET',
            url: '/api/v1/diagnosis/export',
            xhrFields: {
                responseType: 'arraybuffer'
            },
            success: function(data) {
                const blob = new Blob([data], {type: 'application/octet-stream'});
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `diagnosis_${Date.now()}.bin`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                showAlert('Diagnosis data exported successfully');
            },
            error: function() {
                showAlert('Export failed');
            }
        });
    });
});