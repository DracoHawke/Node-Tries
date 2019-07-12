var siege = include('siege');
siege()
  .on(8080)
  .for(10000).times
  .get('/mysql/mysql3')
  .attack()
