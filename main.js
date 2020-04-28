var paymentModule = require('iota-payment')
var express = require('express')
var app = express()

// app.get('index.html', (req, res) => res.send('index.html'))
app.use(express.static('public/'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/getBalance', async (req, res) => {
  try {
    paymentModule.getBalance()
      .then(balance => {
        console.log("balance: "+balance)
        res.send({balance})
      })
  } catch (err) {
    res.sendStatus(500).send(err)
    console.log(err)
  }
})

app.post('/payment', async (req, res) => {
  try {
    // console.log(req.body);
    if(req.body.value ==''){
      req.body.value = 0
    }
    let value = req.body.data[0]
    let data = req.body.data[1]
    //create payment
    let payment = await paymentModule.createPaymentRequest({value, data})
    console.log("payment",payment.address);
    res.send(payment)
  } catch (err) {
    res.send(err)
    console.log(err)
  }
})

app.get('/payments', async (req, res) => {
  try {
    //get payments
    console.log("getPayments called");
    let payments = await paymentModule.getOpenPayments()
    res.send(payments)
  } catch (err) {
    res.send(err)
    console.log(err)
  }
})

app.post('/payout', async (req, res) => {
  try {
    // console.log(req.body);
    const data = req.body.data
    // console.log(data);
    //fill data payout
    let address = data[0],
      value = data[1],
      message = data[2],
      tag = ''

    let payout = await paymentModule.sendPayout({ address, value, message, tag })
    res.send(payout)
    console.log("payout", payout.address)


  } catch (err) {
    res.send(err)
    console.log(err)
  }
})


var options = {
  mount: '',
  api: true
  // ...
}

let server = paymentModule.createServer(app, options)

// Start server with iota-payment module on '/payments'
let port = 80
server.listen(port, function () {
  console.log(`Server started on http://localhost:${port}`)
})