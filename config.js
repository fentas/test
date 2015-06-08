module.exports = {
  mongo: {
    host: 'localhost',
    port: 27017,
    name: 'uniteflights',

    collections: ['scrape']
  },

  scrape: {
    // update interval for scrape domains
    update: 86400
  }
}
