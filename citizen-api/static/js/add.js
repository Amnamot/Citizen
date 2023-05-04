
$(document).on('click', '#info_open', () => {
  $('#params_info').show();
  $('#params_form').hide();
});

$(document).on('click', '#form_open', () => {
  $('#params_info').hide();
  $('#params_form').show();
});
