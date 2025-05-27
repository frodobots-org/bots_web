$(function() {
    let proxyEnabled = false;
    
    // 初始化代理状态（仅获取enable状态）
    $.ajax({
        url: '/api/v1/proxy',
        success: function(data) {
            proxyEnabled = data.proxy_enabled;
            $('#proxy-toggle').text(proxyEnabled ? 'Disable Proxy' : 'Enable Proxy');
            // 清空敏感信息字段
            $('#proxy-ip').val('');
            $('#proxy-port').val('');
            $('#proxy-user').val('');
            $('#proxy-pass').val('');
        }
    });

    $('#proxy-toggle').click(function(e) {
        e.preventDefault();
        proxyEnabled = !proxyEnabled;
        
        // 提交包含所有字段但后端仅处理proxy_enabled
        const payload = {
            proxy_enabled: proxyEnabled,
            ip: $('#proxy-ip').val() || null,
            port: $('#proxy-port').val() || null,
            username: $('#proxy-user').val() || null,
            password: $('#proxy-pass').val() || null
        };

        $.ajax({
            type: 'POST',
            url: '/api/v1/proxy',
            contentType: 'application/json',
            data: JSON.stringify(payload),
            success: function() {
                $('#proxy-toggle').text(proxyEnabled ? 'Disable Proxy' : 'Enable Proxy');
                showAlert(`Proxy ${proxyEnabled ? 'enabled' : 'disabled'}`);
            }
        });
    });
});