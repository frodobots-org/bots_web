$(function() {
    const updateInterval = 5000; // 5 seconds
    
    function fetchDeviceInfo() {
        // 新增GPS状态获取
        $.ajax({
            url: '/api/v1/gps/status',
            success: function(data) {
                $('#gps-position').text(
                    data.fix ? `${data.lat}, ${data.lng}` : 'No signal'
                );
                $('#gps-signal').text(
                    data.snr ? `${data.snr} dBm` : 'N/A'
                );
                $('#gps-satellites').text(
                    data.satellites || '0'
                );
            }
        });
        
        $.ajax({
            url: '/api/v1/system/info',
            success: function(data) {
                $('#firmware-version').text(data.version || 'N/A');
                $('#build-date').text(data.build_date || 'N/A');
                $('#cpu-usage').text(
                    data.cpu_usage? `${data.cpu_usage}%` : 'N/A'
                );
                $('#memory-usage').text(
                    data.memory_usage? `${data.memory_usage}%` : 'N/A'
                )
            }
        });
        
        $.ajax({
            url: '/api/v1/network/status',
            success: function(data) {
                $('#imei-number').text(data.imei || 'N/A');
                $('#signal-strength').text(
                    data.signal ? `${data.signal} dBm` : 'N/A'
                );
                $('#cell-id').text(data.cell_id || 'N/A');
                $('#network-type').text(
                    data.network_type ? `4G/LTE` : '3G/UMTS'
                );
            }
        });
    }

    // Initial load
    fetchDeviceInfo();
    // Refresh periodically
    setInterval(fetchDeviceInfo, updateInterval);
});