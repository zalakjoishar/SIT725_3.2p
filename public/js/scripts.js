// All plants returned by the API (plus any added through the form)
let plants = [];
let currentFilter = 'all';

// Does a plant match the current tab/sidebar filter and search text?
const matches = (plant) => {
  const search = $('#search').val().trim().toLowerCase();
  if (search && !plant.title.toLowerCase().includes(search)) return false;
  if (currentFilter === 'easy') return plant.difficulty === 'Easy';
  if (currentFilter === 'low' || currentFilter === 'high') return plant.lightLevel === currentFilter;
  return true;
};

// Build one horizontal Materialize card per plant
const renderPlants = () => {
  const list = $('#plant-list').empty();
  const visible = plants.filter(matches);
  $('#no-results').toggleClass('hide', visible.length > 0);

  visible.forEach((plant) => {
    const index = plants.indexOf(plant);
    const level = plant.difficulty === 'Easy' ? 'easy' : 'moderate';
    list.append(
      '<div class="col s12 xl6">' +
        '<div class="card horizontal plant-card">' +
          '<div class="card-image"><img src="' + plant.image + '" alt="' + plant.title + '"></div>' +
          '<div class="card-stacked">' +
            '<div class="card-content">' +
              '<span class="difficulty ' + level + '">' + plant.difficulty + '</span>' +
              '<h5>' + plant.title + '</h5>' +
              '<p class="meta"><i class="material-icons">wb_sunny</i>' + plant.light + '</p>' +
              '<p class="meta"><i class="material-icons">opacity</i>' + plant.water + '</p>' +
            '</div>' +
            '<div class="card-action">' +
              '<a href="#" class="care-btn" data-index="' + index + '">Care guide<i class="material-icons">arrow_forward</i></a>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  });
};

// Summary tiles are calculated from the data, not hard-coded
const updateStats = () => {
  $('#stat-total').text(plants.length);
  $('#stat-easy').text(plants.filter((p) => p.difficulty === 'Easy').length);
  $('#stat-water').text(plants.filter((p) => p.waterDays <= 7).length);
};

// Call the GET REST endpoint on the server
const getPlants = () => {
  $.get('/api/plants', (response) => {
    if (response.statusCode === 200) {
      plants = response.data;
      updateStats();
      renderPlants();
    }
  }).fail(() => {
    $('#plant-list').html('<p class="center-align red-text">Could not load plants. Is the server running?</p>');
  });
};

// Switch filter from either the tabs or the sidebar, keeping both in sync
const setFilter = (filter) => {
  currentFilter = filter;
  $('.side-filter').removeClass('active').filter('[data-filter="' + filter + '"]').addClass('active');
  $('.tab-filter').removeClass('active').filter('[data-filter="' + filter + '"]').addClass('active');
  renderPlants();
};

// Fill and open the care guide modal for one plant
const openCareGuide = (plant) => {
  $('#care-image').attr({ src: plant.image, alt: plant.title });
  $('#care-title').text(plant.title);
  $('#care-description').text(plant.description);
  $('#care-light').text(plant.light);
  $('#care-water').text(plant.water);
  $('#care-difficulty').text(plant.difficulty + ' care').attr('class', 'difficulty ' + (plant.difficulty === 'Easy' ? 'easy' : 'moderate'));
  M.Modal.getInstance($('#careModal')).open();
};

// Read the form, add the plant to the page and confirm with a toast
// (there is no POST endpoint yet, so the new plant is kept on the client only)
const submitForm = () => {
  const name = $('#plantName').val().trim();
  if (!name) {
    M.toast({ html: 'Please enter a plant name', classes: 'toast-warn' });
    return;
  }
  const lightLevel = $('#plantLight').val();
  const days = Number($('#plantWater').val());
  const newPlant = {
    title: name,
    image: 'images/money-plant.svg',
    description: $('#plantDescription').val().trim() || 'No care notes added yet.',
    light: $('#plantLight option:selected').text(),
    lightLevel: lightLevel,
    water: days === 1 ? 'Every day' : 'Every ' + days + ' days',
    waterDays: days,
    difficulty: $('input[name="difficulty"]:checked').val(),
  };
  console.log('New plant:', newPlant);
  plants.unshift(newPlant);
  updateStats();
  setFilter('all');
  M.toast({ html: '<i class="material-icons left">check_circle</i>' + name + ' added to your ledger', classes: 'toast-ok' });
  $('#plantForm')[0].reset();
  $('#waterValue').text(7);
  M.updateTextFields();
  M.FormSelect.init($('#plantLight'));
  M.Modal.getInstance($('#addPlantModal')).close();
};

$(document).ready(() => {
  $('.sidenav').sidenav();
  $('.modal').modal();
  $('select').formSelect();
  $('.tooltipped').tooltip();

  $('#search').on('input', renderPlants);
  $(document).on('click', '.side-filter, .tab-filter', function (e) {
    e.preventDefault();
    setFilter($(this).data('filter'));
  });
  $(document).on('click', '.care-btn', function (e) {
    e.preventDefault();
    openCareGuide(plants[$(this).data('index')]);
  });
  $('#plantWater').on('input', function () { $('#waterValue').text(this.value); });
  $('#formSubmit').click(submitForm);

  getPlants();
});
