const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios').default;
const app = express();
app.use(bodyParser.json());
app.use(cors());

const apikey = 'txMW3gc7aVbMZIJ7XMRaXqLFuXO2';

app.get(`/winnerById/:id`, async (req, res) => {
  const { id } = req.params;
  const { data } = await axios({
    method: 'post',
    url: `https://cricapi.com/api/matches`,
    data: {
      apikey: apikey
    }
  })
  let winner = 'no';
  for (let i = 0; i < data.matches.length; ++i) {
    if (data.matches[i].unique_id == id) {
      if (data.matches[i].winner_team)
        winner = data.matches[i].winner_team;
    }
  }
  winner =  winner.replace(/\s+/g, '').toLowerCase();
  console.log(id, winner)
  res.status(200).send(winner);
});

app.get(`/upcomingMatches`, async (req, res) => {
  const { data } = await axios({
    method: 'post',
    url: `https://cricapi.com/api/matches`,
    data: {
      apikey: apikey
    }
  })
  res.status(200).send(data);
});


// Main Server
app.use('/', (req, res) => {
  res.status(201).send("API server home");
});

app.listen(process.env.PORT || 4000, () => {
  console.log('Listening on 4000');
});