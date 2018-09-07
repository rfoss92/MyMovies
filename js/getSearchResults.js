$("#searchForm").on('submit', (e) => {
  e.preventDefault();
  getSearchResults($("#searchTerm").val());
});

function getSearchResults(search) {
  let output = '';
  $('#activeList').html('');
  axios.get('http://www.omdbapi.com?s=' + search + '&apikey=72483cf1')
    .then((response) => {
      let results = response.data.Search;
      $.each(results, (index, movie) => {
        output += `
          <div class="output-info">
            <img src='${movie.Poster}'>
            <h2>${movie.Title}</h2>
            <a class="output-getInfo" onclick='getMovieInfo("${movie.imdbID}")' target="_blank">Get Info</a>
          </div>
        `;
      })
    $('#output').html(output);   
    }).catch((err) => console.log(err));
} 