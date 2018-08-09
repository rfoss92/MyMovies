$(document).ready(() => {
  $("#searchForm").on('submit', (e) => {
      let search = 's=' + $("#searchTerm").val();
      getMovies(search);
      e.preventDefault();
  });

  if (moviesArr) {
    search = moviesArr.split(',');
    search =  'i=' + search[0];
    getMovies(search);
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

  axios.get('http://www.omdbapi.com?' + search + '&apikey=72483cf1')
    .then((response) => {
      let output = '';      
      let results = '';

      if (search.includes('s=')){
        results = response.data.Search;
        $.each(results, (index, movie) => {
          output += `
            <div class="movie">
              <a href='https://www.imdb.com/title/${movie.imdbID}' target="_blank"><img src='${movie.Poster}'></a>
              <h1><a href='https://www.imdb.com/title/${movie.imdbID}' target="_blank">${movie.Title}</a></h1>
              <form action="/" method="POST">
                  <button type="submit" id='${movie.imdbID}' name='movie' value='${movie.imdbID}' onClick='save(${movie.imdbID})'>
                    <i class="fas fa-star"></i>
                  </button>
              </form>
              <p id='${movie.imdbID}'></p>
            </div>
          `;
        })        
      } else {
        results = response.data;

        output += `
          <div class="movie">
            <a href='https://www.imdb.com/title/${results.imdbID}' target="_blank"><img src='${results.Poster}'></a>
            <h1><a href='https://www.imdb.com/title/${results.imdbID}' target="_blank">${results.Title}</a></h1>
            <form action="/" method="POST">
                <button type="submit" id='${results.imdbID}' name='${listArr}' value='${results.imdbID}' onClick='remove(${results.imdbID})'>
                  <i class="fas fa-minus"></i>
                </button>
                <p id='activeList' name='activeList' value='${listArr}' >${listArr}</p>
            </form>
            <p id='${results.imdbID}'></p>
          </div>
        `;
      }


    
      $('#output').html(output);
    }).catch((err) => {
      console.log(err);
    });
}