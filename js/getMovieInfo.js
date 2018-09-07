let resultsID = '';
let listDropDown = '';

listDropDown = listArr.split(',');
for (let i = 0; i < listDropDown.length; i++){
  listDropDown[i] = `<a id='${listDropDown[i]}' onclick='changeList(this.id)'>${listDropDown[i]}</a>`;
}
listDropDown = listDropDown.join('');

function save(movie){
  if ($("#selectList").text() === 'Select List'){
    alert('Please select a list');
  } else {
    $(`#${movie.id}`).text('Saved to list!');
  }
  $(`#${movie.id}`).removeClass('hide').addClass('unhide');
  $(`#undo${movie.id}`).removeClass('unhide').addClass('hide');
}
function remove(results){
  $(`#${results.id}`).removeClass('unhide').addClass('hide');
  $(`#undo${results.id}`).removeClass('hide').addClass('unhide');
}
function changeList(id) {
  $(`#${resultsID}`).html('<i class="fas fa-star"></i>');
  $("#selectList").text(id);
  $(`#${resultsID}`).val(`${resultsID}, ${id}`);
}
function dropDownFunc() {
  $("#myDropdown").toggleClass("unhide");
}
window.onclick = function(e) {
  if (!e.target.matches('.dropbtn')) {
    let dropdowns = $(".dropdown-content");
    for (let i = 0; i < dropdowns.length; i++) {
      let openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('unhide')) {
        openDropdown.classList.remove('unhide');
      }
    }
  }
}

// displays info about the movie
function getMovieInfo(id) {
  $('#activeList').html('');
  let search = id;
  let output = '';
  axios.get('http://www.omdbapi.com?i=' + search + '&apikey=72483cf1')
    .then((response) => {
      let results = response.data;
      resultsID = results.imdbID;
      output += `
        <div class="output-info output-info2">
        <h1>${results.Title}</h1>
          <div class="grid-container">
            <div class="grid-item">
              <img src='${results.Poster}'>
              <ul><li>
                <div class="dropdown">
                  <button onclick="dropDownFunc()" class="dropbtn" id="selectList">Select List</button>
                  <div id="myDropdown" class="dropdown-content">
                    ${listDropDown}
                  </div>
                </div>
                <form method="POST" target="uploader_iframe">
                    <button aria-label="Add to selected list" type="submit" id='${results.imdbID}' 
                    name='movie' value='${results.imdbID}' onClick='save(${results.imdbID})'
                    >
                      <i class="fas fa-star"></i>
                    </button>
                </form>                
              </ul></li>
            </div>
            <div class="grid-item">
              <p>Plot Summary: ${results.Plot}</p>
              <p>Released: ${results.Year}</p>
              <p>Genres: ${results.Genre}</p>
              <p>Director: ${results.Director}</p>
              <p>Writer: ${results.Writer}</p>
              <p>Actors: ${results.Actors}</p>        
              <p>Awards: ${results.Awards}</p>
              <p>${results.Ratings[2].Source}: ${results.Ratings[2].Value}</p>
              <p>Production: ${results.Production}</p>
            </div>
          </div>
        </div>
      `;
    $('#output').html(output);
    }).catch((err) => console.log(err));
}

