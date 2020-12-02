const express = require('express');
const soap = require('soap');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json({extended:false}))
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    next();
  })
var wsdl_url = 'http://localhost:8001/wsdl';
soap.createClient(wsdl_url, function(err, client) {
    if(err){
      console.log(err.message);
    }
    app.post('/api/metar', (req,res) => {
        const parseDate = (date_req) => {
          var date = date_req.slice(0, 4) // YYYY
          date += date_req.slice(5, 7) // MM
          date += date_req.slice(8,10) // DD
          date += date_req.slice(11,13) // HH
          return date;
        }
        const {localidades, data_ini: data_ini_req, data_fim: data_fim_req, page_tam} = req.body;
        args = {localidades}
        if(data_ini_req){
          args = {...args, data_ini: parseDate(data_ini_req)}
        }
        if(data_fim_req){
          args = {...args, data_fim: parseDate(data_fim_req)}
        }
        if(page_tam){
          args = {...args, page_tam: page_tam}
        }
        client.metar(args, function(err, result) {
            if(err){
              console.log('error')
              console.log(err.message);
            }
            if(!Array.isArray(result.data)){
              result.data = [result.data]
            }
            res.json(result);
        });
    })
});

const PORT = 8081

const server = app.listen(PORT, function(){
    var host = server.address().address
    var port = server.address().port
    console.log('Backend listening at http://%s:%s', host, port);
  })
