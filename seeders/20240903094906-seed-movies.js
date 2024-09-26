'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Movies', [
      {
        title: 'Inception',
        synopsis: 'A skilled thief is given a chance at redemption if he can successfully perform an inception.',
        trailerUrl: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
        imgUrl: 'https://image.tmdb.org/t/p/original/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg',
        rating: 8.8,
        status: 'Released',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'The Dark Knight',
        synopsis: 'Batman faces the Joker, a criminal mastermind wreaking havoc in Gotham City.',
        trailerUrl: 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
        imgUrl: 'https://image.tmdb.org/t/p/original/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
        rating: 9.0,
        status: 'Released',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Interstellar',
        synopsis: 'A team of explorers travel through a wormhole in space to save humanity.',
        trailerUrl: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
        imgUrl: 'https://image.tmdb.org/t/p/original/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg',
        rating: 8.6,
        status: 'Released',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'The Matrix',
        synopsis: 'A computer hacker learns about the true nature of reality and his role in the war against its controllers.',
        trailerUrl: 'https://www.youtube.com/watch?v=vKQi3bBA1y8',
        imgUrl: 'https://image.tmdb.org/t/p/original/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
        rating: 8.7,
        status: 'Released',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Avengers: Endgame',
        synopsis: 'The Avengers assemble one final time to undo the chaos caused by Thanos.',
        trailerUrl: 'https://www.youtube.com/watch?v=TcMBFSGVi1c',
        imgUrl: 'https://image.tmdb.org/t/p/original/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
        rating: 8.4,
        status: 'Released',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'The Shawshank Redemption',
        synopsis: 'Two imprisoned men bond over several years, finding solace and eventual redemption through acts of decency.',
        trailerUrl: 'https://www.youtube.com/watch?v=6hB3S9bIaco',
        imgUrl: 'https://image.tmdb.org/t/p/original/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
        rating: 9.3,
        status: 'Released',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Pulp Fiction',
        synopsis: 'The lives of two mob hitmen, a boxer, a gangster’s wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
        trailerUrl: 'https://www.youtube.com/watch?v=s7EdQ4FqbhY',
        imgUrl: 'https://image.tmdb.org/t/p/original/dM2w364MScsjFf8pfMbaWUcWrR.jpg',
        rating: 8.9,
        status: 'Released',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'The Lord of the Rings: The Fellowship of the Ring',
        synopsis: 'A young hobbit, Frodo, is tasked with destroying a powerful ring in the fires of Mount Doom.',
        trailerUrl: 'https://www.youtube.com/watch?v=V75dMMIW2B4',
        imgUrl: 'https://image.tmdb.org/t/p/original/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg',
        rating: 8.8,
        status: 'Released',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Fight Club',
        synopsis: 'An insomniac office worker and a soap salesman create an underground fight club.',
        trailerUrl: 'https://www.youtube.com/watch?v=SUXWAEX2jlg',
        imgUrl: 'https://image.tmdb.org/t/p/original/bptfVGEQuv6vDTIMVCHjJ9Dz8PX.jpg',
        rating: 8.8,
        status: 'Released',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Forrest Gump',
        synopsis: 'The story of a man with a low IQ who accomplishes great things in his life.',
        trailerUrl: 'https://www.youtube.com/watch?v=bLvqoHBptjg',
        imgUrl: 'https://image.tmdb.org/t/p/original/saHP97rTPS5eLmrLQEcANmKrsFl.jpg',
        rating: 8.8,
        status: 'Released',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Movies', null, {});
  }
};
