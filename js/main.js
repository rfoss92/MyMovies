let resultsID = '';

// display the lists in the dropdown menu
if (listArr) {
  listArrDropDown = listArr.split(',');
  for (var i = 0; i < listArrDropDown.length; i++){
    listArrDropDown[i] = `<a id='${listArrDropDown[i]}' onclick='changeList(this.id)'>${listArrDropDown[i]}</a>`;
  }
  listArrDropDown = listArrDropDown.join('');
}

// display the movies from the selected list
if (moviesArr) {
  getMovies(moviesArr.split(','));
}

$("#searchForm").on('submit', (e) => {
  getMovies($("#searchTerm").val());
  e.preventDefault();
});

function movieSelected(id) {
  sessionStorage.setItem('movieId', id);
  window.location = 'movie';
  return false;
}
function save(movie){
  if ($("#selectList").text() === 'Select List'){
    alert('Please select a list');
  } else {
    $(`#${movie.id}`).text('Saved to list!');
  }
}
function remove(results){
  $(`#${results.id}`).text('Removed from list!');
}
function changeList(id) {
  $(`#${resultsID}`).html('<i class="fas fa-star"></i>');
  $("#selectList").text(id);
  $(`#${resultsID}`).val(`${resultsID}, ${id}`);
}
function dropDownFunc() {
  $("#myDropdown").toggleClass("show");
}
window.onclick = function(e) {
  if (!e.target.matches('.dropbtn')) {
    let dropdowns = $(".dropdown-content");
    for (let i = 0; i < dropdowns.length; i++) {
      let openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

function getMovies(search) {
  let output = '';
  if (search.constructor === Array){
    for (let i = 0; i < search.length; i++) {
      axios.get('http://www.omdbapi.com?i=' + search[i] + '&apikey=72483cf1')
        .then((response) => {   
          let results = response.data;
          output += `
            <div class="movie">
              <img src='${results.Poster}'>
              <h2>${results.Title}</h2>
              <a onclick='movieSelected("${results.imdbID}")' target="_blank">Get Info</a>
              <form action="/" method="POST">
                  <button type="submit" id='${results.imdbID}' name='${listArr}' value='${results.imdbID}' 
                    onClick='remove(${results.imdbID})'
                  >
                    <i class="fas fa-minus"></i>
                  </button>
              </form>
            </div>
          `;
        $('#output').html(output);
        }).catch((err) => console.log(err));
    }
  } else {
    axios.get('http://www.omdbapi.com?s=' + search + '&apikey=72483cf1')
      .then((response) => {
        let results = response.data.Search;
        $.each(results, (index, movie) => {
          output += `
            <div class="movie">
              <img src='${movie.Poster}'>
              <h2>${movie.Title}</h2>
              <a onclick='movieSelected("${movie.imdbID}")' target="_blank">Get Info</a>
            </div>
          `;
        })
      $('#output').html(output);   
      }).catch((err) => console.log(err));
  }
}

function getMovie() {
  let search = sessionStorage.getItem('movieId');
  let output = '';
  axios.get('http://www.omdbapi.com?i=' + search + '&apikey=72483cf1')
    .then((response) => {
      let results = response.data;
      resultsID = results.imdbID;
      output += `
        <div class="movie">
          <img src='${results.Poster}'>
          <h2>${results.Title}</h2>
            <form action="/" method="POST">
                <button type="submit" id='${results.imdbID}' name='movie' value='${results.imdbID}' 
                  onClick='save(${results.imdbID})'
                >
                  <i class="fas fa-star"></i>
                </button>
            </form>
            <div class="dropdown">
              <button onclick="dropDownFunc()" class="dropbtn" id="selectList">Select List</button>
              <div id="myDropdown" class="dropdown-content">
                ${listArrDropDown}
              </div>
            </div>
        </div>
      `;
    $('#output').html(output);
    }).catch((err) => console.log(err));
}
