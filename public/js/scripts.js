// The client only displays data: filtering, searching, counting and saving
// are all done on the server, which reads and writes MongoDB.
let currentFilter = 'all';
let selectedPlantId = null;
let searchTimer = null;

const lightLabels = { low: 'Low light', medium: 'Medium, indirect light', high: 'Bright or direct sun' };
const waterLabel = (days) => (days === 1 ? 'Every day' : days === 7 ? 'Weekly' : 'Every ' + days + ' days');
const difficultyClass = (d) => d.toLowerCase();

// Build one horizontal Materialize card per plant
const renderPlants = (plants) => {
  const list = $('#plant-list').empty();
  $('#no-results').toggleClass('hide', plants.length > 0);

  plants.forEach((plant) => {
    list.append(
      '<div class="col s12 xl6">' +
        '<div class="card horizontal plant-card">' +
          '<div class="card-image"><img src="' + plant.image + '" alt="' + plant.name + '"></div>' +
          '<div class="card-stacked">' +
            '<div class="card-content">' +
              '<span class="difficulty ' + difficultyClass(plant.difficulty) + '">' + plant.difficulty + '</span>' +
              (plant.petSafe ? '<span class="pet-badge"><i class="material-icons">pets</i>Pet safe</span>' : '') +
              '<h5>' + $('<div>').text(plant.name).html() + '</h5>' +
              (plant.scientificName ? '<p class="scientific">' + $('<div>').text(plant.scientificName).html() + '</p>' : '') +
              '<p class="meta"><i class="material-icons">wb_sunny</i>' + lightLabels[plant.lightLevel] + '</p>' +
              '<p class="meta"><i class="material-icons">opacity</i>' + waterLabel(plant.waterEveryDays) + '</p>' +
            '</div>' +
            '<div class="card-action">' +
              '<a href="#" class="care-btn" data-id="' + plant._id + '">Care guide<i class="material-icons">arrow_forward</i></a>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  });
};

// GET /api/plants/stats  (counts come from MongoDB)
const getStats = () => {
  $.get('/api/plants/stats', (response) => {
    if (response.statusCode === 200) {
      $('#stat-total').text(response.data.total);
      $('#stat-petsafe').text(response.data.petSafe);
      $('#stat-water').text(response.data.waterThisWeek);
    }
  });
};

const refresh = () => { getPlants(); getStats(); };

// Switch filter from either the tabs or the sidebar, keeping both in sync
const setFilter = (filter) => {
  currentFilter = filter;
  $('.side-filter').removeClass('active').filter('[data-filter="' + filter + '"]').addClass('active');
  $('.tab-filter').removeClass('active').filter('[data-filter="' + filter + '"]').addClass('active');
  getPlants();
};

// GET /api/plants/:id and show it in the care guide modal
const openCareGuide = (id) => {
  $.get('/api/plants/' + id, (response) => {
    const plant = response.data;
    selectedPlantId = plant._id;
    $('#care-image').attr({ src: plant.image, alt: plant.name });
    $('#care-title').text(plant.name);
    $('#care-scientific').text(plant.scientificName || '');
    $('#care-description').text(plant.careNotes || 'No care notes added yet.');
    $('#care-light').text(lightLabels[plant.lightLevel]);
    $('#care-water').text(waterLabel(plant.waterEveryDays));
    $('#care-pets').text(plant.petSafe ? 'Safe for cats and dogs' : 'Keep away from pets');
    $('#care-added').text(new Date(plant.createdAt).toLocaleDateString());
    $('#care-difficulty').text(plant.difficulty + ' care').attr('class', 'difficulty ' + difficultyClass(plant.difficulty));
    M.Modal.getInstance($('#careModal')).open();
  }).fail(() => M.toast({ html: 'Could not load that plant', classes: 'toast-warn' }));
};

// DELETE /api/plants/:id
const deletePlant = () => {
  if (!selectedPlantId) return;
  $.ajax({ url: '/api/plants/' + selectedPlantId, method: 'DELETE' })
    .done((response) => {
      M.Modal.getInstance($('#careModal')).close();
      M.toast({ html: '<i class="material-icons left">delete_outline</i>' + response.data.name + ' removed from the database', classes: 'toast-ok' });
      refresh();
    })
    .fail(() => M.toast({ html: 'Could not remove the plant', classes: 'toast-warn' }));
};

// GET /api/plants?filter=...&search=...  (the server builds the MongoDB query)
const getPlants = () => {
  $.get('/api/plants', { filter: currentFilter, search: $('#search').val() }, (response) => {
    if (response.statusCode === 200) renderPlants(response.data);
  }).fail(() => {
    $('#plant-list').html('<p class="center-align red-text">Could not load plants. Is the server running?</p>');
  });
};

// POST /api/plants: the server validates and saves the plant in MongoDB
const submitForm = () => {
  const formData = {
    name: $('#plantName').val().trim(),
    scientificName: $('#plantScientific').val().trim(),
    lightLevel: $('#plantLight').val(),
    waterEveryDays: Number($('#plantWater').val()),
    difficulty: $('input[name="difficulty"]:checked').val(),
    petSafe: $('#plantPetSafe').is(':checked'),
    careNotes: $('#plantDescription').val().trim(),
  };

  $.ajax({ url: '/api/plants', method: 'POST', contentType: 'application/json', data: JSON.stringify(formData) })
    .done((response) => {
      M.toast({ html: '<i class="material-icons left">check_circle</i>' + response.data.name + ' saved to the database', classes: 'toast-ok' });
      $('#plantForm')[0].reset();
      $('#waterValue').text(7);
      M.updateTextFields();
      M.FormSelect.init($('#plantLight'));
      M.Modal.getInstance($('#addPlantModal')).close();
      $('#search').val('');
      setFilter('all');
      getStats();
    })
    .fail((xhr) => {
      const message = (xhr.responseJSON && xhr.responseJSON.message) || 'Could not save the plant';
      M.toast({ html: message, classes: 'toast-warn' });
    });
};

$(document).ready(() => {
  $('.sidenav').sidenav();
  $('.modal').modal();
  $('select').formSelect();
  $('.tooltipped').tooltip();

  // Wait until the user stops typing before asking the server to search
  $('#search').on('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(getPlants, 250);
  });
  $(document).on('click', '.side-filter, .tab-filter', function (e) {
    e.preventDefault();
    setFilter($(this).data('filter'));
  });
  $(document).on('click', '.care-btn', function (e) {
    e.preventDefault();
    openCareGuide($(this).data('id'));
  });
  $('#plantWater').on('input', function () { $('#waterValue').text(this.value); });
  $('#deletePlant').click(deletePlant);
  $('#formSubmit').click(submitForm);

  refresh();
});
