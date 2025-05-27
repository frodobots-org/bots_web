var wifiSettings = {'ssid': '', 'psk': '', 'security': 'Open'};

function refreshWifiSettings(settings) {
  $('#ssid').val(settings.ssid);
  $('#psk').val(settings.psk);
  $('#security').val(settings.security);
}

$(document).ready(function() {
  $.ajax({
    type: 'GET',
    url: '/api/v1/wifi',
    success: function(data) {
      refreshWifiSettings(data);
    }
  });
});

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

$('#wifi-settings').on('submit', function(e) {
  e.preventDefault();
});

$('#wifi-submit').on('click', function(e) {
  var ssid = $('#ssid').val();
  var psk = $('#psk').val();
  var security = $('#security').val();
  var data = {'ssid': ssid, 'psk': psk, 'security': security};
  
  showLoader();
  $.ajax({
    type: 'POST',
    url: '/api/v1/wifi',
    data: JSON.stringify(data),
    success: function(data) {
      refreshWifiSettings(data);
      showAlert('WiFi settings updated.');
    }
  });
});