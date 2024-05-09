// IMPORTING THE REQUIRED DEPENDENCIES
const express = require('express')
const axios = require('axios').default
const jsdom = require('jsdom')
const { JSDOM } = jsdom
const path = require('path');

// INITIATING EXPRESS APP
const app = express()
const port = 3000;

//CONFIGURING THE FOLDER FOR STATIC FILES (CSS AND JS)
app.use(express.static(path.join(__dirname,'public')));



// INITIATING JSDOM VIRTUALCONSOLE
const virtualConsole = new jsdom.VirtualConsole();

// DEFINING CUSTOM HEADERS TO BYPASS AMAZON'S ANTI-SCRAPE FILTER
const custom_headers = {'user-agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 OPR/107.0.0.0'}



// CONFIGURING THE /api/scrape?keyword= ROUTE
app.get('/api/scrape', (req, res) => {
  
  //FIRST USE AXIOS TO RETRIEVE A SEARCH ON AMAZON USING THE KEYWORD PASSED IN THE GET REQUEST WITH THE CUSTOM HEADERS DEFINED BEFORE
  axios.get('https://www.amazon.com/s?k='+req.query.keyword,{headers:custom_headers})
  .then((response)=>{
      // USING JSDOM TO READ THE HTML RETRIEVED BY AXIOS
      const dom = new JSDOM(response.data,{virtualConsole})
      // GETTING THE DOCUMENT
      const document = dom.window.document
      const products = []
      var n = 0
      //ITERATING EVERY ELEMENT WITH THE CLASS s-result-item. THEY ARE THE ITEMS IN THE PAGE BUT THERE ARE SOME JUNK AMONG THEM.
      Array.from(document.getElementsByClassName('s-result-item')).forEach((item)=>{
          n+=1
          //TRY TO TEST IF THE ITEM IS ACTUALLY AN ITEM OR NOT
          try{
            //TAG H2 IS WHERE THE TITLE OF THE ITEM IS LOCATED
            const title = item.querySelector('h2').textContent.trim()
            //a-icon-alt RETRIEVES "x.y out of 5". SPLITTING IT FROM THE SPACE BAR AND PARSEFLOATING THE NUMBER
            const rating = parseFloat(item.querySelector('.a-icon-alt').textContent.split(' ')[0])
            //s-csa-instrumentation-wrapper IS WHERE THE NUMBER OF REVIEWS IS LOCATED. GETTING THE CONTENT, STRIPPING ANY "," OFF OF IT AND PARSING TO INT
            const reviews = parseInt(item.querySelector('.s-csa-instrumentation-wrapper').textContent.replace(',',''));
            //TAG IMG IS WHERE THE IMAGE OF THE ITEM IS LOCATED. GETTING THE SRC ATTRIBUTE RETRIEVES THE URL LINK FOR THE IMAGE.
            const imageUrl = item.querySelector('img').getAttribute('src')
            
            products.push({title,rating,reviews,imageUrl})
          }
          catch(err){
            //LOG USED TO SEE WHICH ITERATIONS FAILED. NO REASON TO KEEP IT UNCOMMENTED.
            //console.log("Item "+n+ " wasn't an item")
          }
      })
      //SENDING A JSON WITH ALL THE PRODUCTS OF THE FIRST PAGE AS RESPONSE
      res.json(products)
  })
  .catch((error)=>{
      console.log(error);
  })
});

// CONFIGURING THE /api ROUTE TO BE THE HTML'S ADDRESS
app.get('/api',(req,res)=>{
  res.sendFile(__dirname+'/views/app.html');
});


app.listen(port, () => {
  console.log(`=========[ Running at http://localhost:${port} ]==========`);
});