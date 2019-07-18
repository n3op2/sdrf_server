#!/usr/bin/env node
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const stdin = process.openStdin();

mongoose.connect('mongodb://127.0.0.1:27017/sdrf', { useNewUrlParser: true});

const freqSchema = new mongoose.Schema({ 
  samples: Number,
  hzStep: Number,
  freqs: [],
  createdAt: Number, 
});

const Freqs = mongoose.model('freqs', freqSchema);

// main gatherer
stdin.on('data', (raw) => {
  const data = raw.toString().split(',');
  const freqs = data.splice(6); 
  const params = data.splice(0, 6);

  const date = params[0];
  const time = params[1];
  const hzLow = params[2];
  const hzHigh = params[3];
  const hzStep = params[4];
  const samples = params[5];
  const timestamp = new Date().getTime();
  /*
  Freqs.create({ createdAt: timestamp, freqs, samples, hzStep }, (err) => {
    if (err) return console.log(err);
    console.log('new freqs have been added.');
  });
  */
  console.log('...');
});

// on pipe end: 
stdin.on('end', () => {
  console.log('pipe ended');
  // reader.readAsText();
});

// root get 
app.get('/', (req, res) => {
  Freqs.find({}, (err, freqs) => {
    if (err) return res.send(err);
    res.send(freqs);
  });
});

// listen
app.listen(3010, () => {
  console.log('listening 3000');
});
