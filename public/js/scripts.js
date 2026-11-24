// Build one Materialize card per plant and add it to the page
const addCards = (items) => {
  $('#card-section').empty();
  items.forEach((item) => {
    const card =
      '<div class="col s12 m6 l4">' +
        '<div class="card hoverable">' +
          '<div class="card-image waves-effect waves-block waves-light">' +
            '<img class="activator" src="' + item.image + '" alt="' + item.title + '">' +
          '</div>' +
          '<div class="card-content">' +
            '<span class="card-title activator grey-text text-darken-4">' + item.title +
              '<i class="material-icons right">more_vert</i></span>' +
            '<div class="chip green lighten-4"><i class="material-icons tiny">wb_sunny</i> ' + item.light + '</div>' +
            '<div class="chip blue lighten-4"><i class="material-icons tiny">opacity</i> ' + item.water + '</div>' +
            '<p><a href="#">' + item.link + '</a></p>' +
          '</div>' +
          '<div class="card-reveal">' +
            '<span class="card-title grey-text text-darken-4">' + item.title +
              '<i class="material-icons right">close</i></span>' +
            '<p class="card-text">' + item.description + '</p>' +
          '</div>' +
        '</div>' +
      '</div>';
    $('#card-section').append(card);
  });
};

// Call the GET REST endpoint on the server
const getPlants = () => {
  $.get('/api/plants', (response) => {
    if (response.statusCode === 200) {
      addCards(response.data);
    }
  }).fail(() => {
    $('#card-section').html('<p class="red-text center-align">Could not load plants. Is the server running?</p>');
  });
};

// Read the modal form values (no POST endpoint yet, so they are logged and shown in a toast)
const submitForm = () => {
  const formData = {
    title: $('#plantName').val(),
    light: $('#plantLight').val(),
    water: $('#plantWater').val(),
    description: $('#plantDescription').val(),
  };
  console.log('Form data:', formData);
  M.toast({ html: 'Thanks! "' + (formData.title || 'Your plant') + '" was received.', classes: 'green darken-2' });
  $('#plantForm')[0].reset();
  M.Modal.getInstance($('#addPlantModal')).close();
};

$(document).ready(() => {
  $('.modal').modal();
  $('#formSubmit').click(() => submitForm());
  getPlants();
});
