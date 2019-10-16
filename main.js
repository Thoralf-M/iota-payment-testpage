var paymentModule = require('iota-payment')
var express = require('express')
var app = express()

// app.get('index.html', (req, res) => res.send('index.html'))
app.use(express.static('public/'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.post('/payment', async (req, res) => {
  try {
    console.log(req.body);
    if(req.body.value ==''){
      req.body.value = 0
    }
    let value = req.body.data[0]
    let data = req.body.data[1]
    //create payment
    let payment = await paymentModule.payment.createPayment(value, data)
    console.log(payment);
    res.send(payment)
  } catch (err) {
    res.send(err)
    console.log(err)
  }
})

app.post('/payout', async (req, res) => {
  try {
    console.log(req.body);
    const data = req.body.data
    console.log(data);
    //fill data payout
    let address = data[0],
      value = data[1],
      message = data[2],
      tag = ''

    let payout = await paymentModule.payout.send({ address, value, message, tag })
    res.send(payout)
    console.log("payout", payout)


  } catch (err) {
    res.send(err)
    console.log(err)
  }
})



var options = {
  mount: '/payments',
  value: 1
  // ...
}

let server = paymentModule.createServer(app, options)

// Start server with iota-payment module on '/payments'
server.listen(3001, function () {
  console.log(`Server started on http://localhost:3001 `)
})