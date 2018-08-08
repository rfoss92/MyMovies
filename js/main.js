$(document).ready(() => {
    $("#searchForm").on('submit', (e) => {
        let searchText = $("#searchTerm").val();
        getMovies(searchText);
        e.preventDefault();
    });
});

function save(movie){
  let id = movie.id;
  $(`#${id}`).text('Saved to list!');
}

function getMovies(searchText) {
  axios.get('http://www.omdbapi.com?s=' + searchText + '&apikey=72483cf1')
    .then((response) => {
      let results = response.data.Search;      
      let output = '';

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

      $('#output').html(output);
    }).catch((err) => {
      console.log(err);
    });
}