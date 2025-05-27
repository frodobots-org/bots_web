var lteSettings = {'username': '', 'password': '', 'auth': 'None', 'apn': '', 'pin': ''}

refreshLteSettings(lteSettings);

function refreshLteSettings(settings) {
  $('#username').val(settings.username);
  $('#password').val(settings.password);
  $('#auth').val(settings.auth);
  $('#pin').val(settings.pin);
  $('#apn').val(settings.apn);
}

$(document).ready(function() {

  $.ajax({
    type: 'GET',
    url: '/api/v1/lte',
    success: function(data) {
      refreshLteSettings(data);
    }
  });
});

$('#lte-settings').on('submit', function(e) {
  e.preventDefault();
});

function showLoader() {

  $('#modal').css('display', 'block');
  $('.loader').css('display', 'block');
}

function showAlert(message) {

  $('.loader').css('display', 'none');
  $('#alert').css('display', 'block');
  //$('#alert').html(message);

  setTimeout(function() {
    $('#alert').css('display', 'none');
    $('#modal').css('display', 'none');
  }, 3000);
}

$('#lte-submit').on('click', function(e) {
  var apn = $('#apn').val();
  var pin = $('#pin').val();
  var username = $('#username').val();
  var password = $('#password').val();
  var auth = $('#auth').val();
  lteSettings.username = username;
  lteSettings.password = password;
  lteSettings.auth = auth;
  lteSettings.apn = apn;
  lteSettings.pin = pin;
  showLoader();
  console.log(lteSettings);
  $.ajax({
    type: 'POST',
    url: '/api/v1/lte',
    data: JSON.stringify(lteSettings),
    success: function(data) {
      console.log(data);
      refreshLteSettings(lteSettings);
      showAlert('LTE settings updated. Please reboot the device.');
    }
  });
});

$('#pdp-export').on('click', function(e) {
  $.ajax({
    type: 'GET',
    url: '/api/v1/pdp',
    success: function(data) {
      var blob = new Blob([data], {type: 'text/csv'});
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'pdp-config.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  });
});

$('#pdp-import').on('click', function(e) {
  $('#pdp-file').click();
});

$('#pdp-file').on('change', function(e) {
  var formData = new FormData();
  formData.append('pdp_file', e.target.files[0]);
  
  showLoader();
  $.ajax({
    type: 'POST',
    url: '/api/v1/pdp',
    processData: false,
    contentType: false,
    data: formData,
    success: function(data) {
      showAlert('PDP configuration imported.');
    }
  });
});

