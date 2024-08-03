const musicCollection = {
  albums: [],

  // используем генератор
  * [Symbol.iterator]() {
    for (const album of this.albums) {
      yield album;
    }
  },

  // [Symbol.iterator]() {
  //   let index = 0;
  //   const albums = this.albums;
  //
  //   return {
  //     next() {
  //       if (index < albums.length) {
  //         return {value: albums[index++], done: false};
  //       } else {
  //         return {done: true};
  //       }
  //     }
  //   };
  // },

  addAlbum(title, artist, year) {
    this.albums.push({title, artist, year});
  }
}

musicCollection.addAlbum("Album 1", "Artist 1", "2001");
musicCollection.addAlbum("Album 2", "Artist 2", "2002");
musicCollection.addAlbum("Album 3", "Artist 3", "2003");

for (const album of musicCollection) {
  console.log(`${album.title} - ${album.artist} (${album.year})`);
}