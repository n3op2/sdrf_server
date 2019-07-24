#!/usr/bin/env node
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const cors = require('cors');
const stdin = process.openStdin();

mongoose.connect('mongodb://127.0.0.1:27017/sdrf', { useNewUrlParser: true});

const freqSchema = new mongoose.Schema({ 
  date: String,
  time: String,
  hzLow: Number,
  hzHigh: Number,
  samples: Number,
  step: Number,
  freqs: [],
  createdAt: Number, 
});

const Freqs = mongoose.model('freqs', freqSchema);

// main gatherer
stdin.on('data', (raw) => {
  const data = raw.toString().split(',');
  const freqs = data.splice(6); 
  const params = data.splice(0, 6);

  const sample = {
    date: params[0],
    time: params[1],
    hzLow: params[2],
    hzHigh: params[3],
    step: params[5],
    freqs,
    createdAt: new Date().getTime() 
  };

  console.log(raw);

  Freqs.create(sample, (err) => {
    if (err) return console.log(err);
    console.log('database updated...');
  });
});

// on pipe end: 
stdin.on('end', () => {
  console.log('pipe ended');
  // reader.readAsText();
});

// middleware
app.use(cors());

// root get 
app.get('/', (req, res) => {
  Freqs.find({/*query*/}, (err, data) => {
    if (err) return res.send(err);
    // TODO should pick up a range from database with the range properties
    // such as range, low hz, high hz for visualizing it
    res.send(data.slice(Math.max(data.length - 50, 0)));
  });
});

// listen
app.listen(3010, () => {
  console.log('listening 3000');
});

