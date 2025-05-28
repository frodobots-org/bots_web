$(document).ready(() => {
    $("#navbar-container").load("navbar.html", function() {
        new bootstrap.Offcanvas(document.getElementById('sidebar'))
    });
    function initRobotInfo() {
        fetchRobotStatus();
        setInterval(fetchRobotStatus, 2000);
    }

    function fetchRobotStatus() {
        $.ajax({
            url: '/api/v1/robot/status',
            method: 'GET',
            dataType: 'json',
            success: (data) => {
                updateDom(data);
            },
            error: (xhr) => {
                showToast(`get info error：${xhr.statusText}`, 'danger');
            }
        });
    }

    function updateDom(data) {
        $('#firmware-version').text(data.firmwareVersion);
        $('#build-date').text(data.buildDate);
        $('#cpu-usage').text(`${data.cpuUsage}%`);
        $('#memory-usage').text(`${data.memoryUsage}%`);
        $('#gps-position').text(`${data.gps.lat}, ${data.gps.lng}`);
        $('#gps-signal').text(`${data.gps.signal}%`);
        $('#gps-satellites').text(data.gps.satellites);
        $('#imei-number').text(data.imei);
        $('#signal-strength').text(`${data.networkSignal}%`);
        $('#cell-id').text(data.cellId);
        $('#network-type').text(data.networkType);
    }

    function showToast(message, type = 'info') {
        const toastEl = $('#toast');
        const toast = new bootstrap.Toast(toastEl);
        toastEl.removeClass().addClass(`toast align-items-center text-white bg-${type} border-0`);
        $('.toast-body').text(message);
        toast.show();
    }

    initRobotInfo();
});