$(document).ready(() => {
  $("#searchForm").on('submit', (e) => {
    let search = 's=' + $("#searchTerm").val();
    getMovies(search);
    e.preventDefault();
  });
  
  if (listArr) {
    listArrDropDown = listArr.split(',');
    for (var i = 0; i < listArrDropDown.length; i++){
      listArrDropDown[i] = '<a>' + listArrDropDown[i] + '</a>';
    }
    listArrDropDown = listArrDropDown.join('');
  }

  if (moviesArr) {
    moviesArr = moviesArr.split(',');
    getMovies(moviesArr);
  }
});

function save(movie){
  let id = movie.id;
  $(`#${id}`).text('Saved to list!');
}
function remove(results){
  let id = results.id;
  $(`#${id}`).text('Removed from list!');
}

function getMovies(search) {
  let output = '';
  if (search.constructor === Array){
    for (var i = 0; i < search.length; i++) {
      search[i] = 'i=' + search[i]; 
      axios.get('http://www.omdbapi.com?' + search[i] + '&apikey=72483cf1')
        .then((response) => {   
          let results = response.data;
          output += `
            <div class="movie">
              <a href='https://www.imdb.com/title/${results.imdbID}' target="_blank"><img src='${results.Poster}'></a>
              <h2><a href='https://www.imdb.com/title/${results.imdbID}' target="_blank">${results.Title}</a></h2>
              <form action="/" method="POST">
                  <button type="submit" id='${results.imdbID}' name='${listArr}' value='${results.imdbID}' onClick='remove(${results.imdbID})'>
                    <i class="fas fa-minus"></i>
                  </button>
              </form>
              <p id='${results.imdbID}'></p>
            </div>
          `;
        $('#output').html(output);
        }).catch((err) => {
          console.log(err);
        });
    }

  } else {
    axios.get('http://www.omdbapi.com?' + search + '&apikey=72483cf1')
      .then((response) => {   
        let results = response.data.Search;
        $.each(results, (index, movie) => {
          output += `
            <div class="movie">
              <a href='https://www.imdb.com/title/${movie.imdbID}' target="_blank"><img src='${movie.Poster}'></a>
              <h2><a href='https://www.imdb.com/title/${movie.imdbID}' target="_blank">${movie.Title}</a></h2>
              <form action="/" method="POST">
                  <button type="submit" id='${movie.imdbID}' name='movie' value='${movie.imdbID}, 5' onClick='save(${movie.imdbID})'>
                    <i class="fas fa-star"></i>
                  </button>
                  
                  <div class="dropdown">
                    <button onclick="myFunction()" class="dropbtn">Select List</button>
                    <div id="myDropdown" class="dropdown-content">
                      ${listArrDropDown}
                    </div>
                  </div>

              </form>
              <p id='${movie.imdbID}'></p>
            </div>
          `;
        })   
      $('#output').html(output);   
      }).catch((err) => {
        console.log(err);
      });
  }
}

function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {

    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}