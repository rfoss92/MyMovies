if (moviesInList) getList(moviesInList.split(','));

function getList(search) {
  let output = '';
  for (let i = 0; i < search.length; i++) {
    axios.get('http://www.omdbapi.com?i=' + search[i] + '&apikey=72483cf1')
      .then((response) => {
        let results = response.data;
        output += `
          <div class="output-info">
            <img src='${results.Poster}'>
            <h2>${results.Title}</h2>
            <a class="output-getInfo" onclick='getMovieInfo("${results.imdbID}")' target="_blank">Get Info</a>
            <form class="List-RemoveForm" action="/" method="POST" target="uploader_iframe">
                <button class="List-Remove" type="submit" id='${results.imdbID}' name='${listArr}' value='${results.imdbID}' 
                  onClick='remove(${results.imdbID})'
                >
                  <i class="fas fa-minus"></i>
                </button>
            </form>
            <form class="List-UndoForm" method="POST" target="uploader_iframe">
              <button class="hide" type="submit" id='undo${results.imdbID}' name='movie' value='${results.imdbID}, ${listArr}' 
                onClick='save(${results.imdbID})'
              >
                (undo)
              </button>
          </form>
          </div>
        `;
      $('#output').html(output);
      }).catch((err) => console.log(err));
  }
}  