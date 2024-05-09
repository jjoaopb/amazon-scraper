function getResult(str) {
    //INITIATING A NEW AJAX REQUEST
    var xhttp = new XMLHttpRequest();
    //FUNCTION THAT WILL TRIGGER WHEN THE SERVER RESPONDS TO THE AJAX
    xhttp.onload = function() {
        //PARSING THE SERVER'S ANSWER AS JSON
        const results = JSON.parse(xhttp.response);
        //RESETING THE RESULTS GATHERED BY THE FUNCTION. CLEANING THE PAGE BEFORE ADDING NEW RESULTS.
        document.getElementById('result-table').innerHTML = ''
        //TURNING THE "Results:" H2 VISIBILITY ON
        document.getElementsByClassName('result-header')[0].style.visibility = 'visible'
        //CREATING A MAIN HEADER FOR THE ITEMS IN THE RESULTS TABLE.
        var html = '<tr class="main-header"><th>Product</th><th>Name</th><th>Rating</th><th>Reviews</th></tr>'
        //ITERATING ALL THE RESULTS GATHERED BY AJAX
        for(var n = 0;n<results.length;n++){
            //CREATING A HEADER FOR THE OTHER PRODUCTS. IGNORING THE FIRST ONE TO AVOID A DUPLICATED HEADER.
            if(n!=0){
                //CREATING A HEADER FOR EVERY PRODUCT IN THE TABLE. THIS ONE WON'T BE VISIBLE UNLESS THE MOUSE HOVERS IN SAID PRODUCT.
                html+='<tr class="product-headers"><th>Product</th><th>Name</th><th>Rating</th><th>Reviews</th></tr>'
            }
            //CREATING A <TR> WITH A <TD> FOR IMG, A <TD> FOR TITLE, A <TD> FOR RATING, AND A <TD> FOR REVIEWS
            html += '<tr><td><img width="100" src="'+results[n].imageUrl+'">'+'</td>'+
                '<td>'+results[n].title+'</td>'+
                '<td>'+results[n].rating+'</td>'+
                '<td>'+results[n].reviews+'</td>'+
                '</tr>'
            //ADDING ALL THE HTML TO THE INNERHTML OF THE TABLE.
            document.getElementById('result-table').innerHTML += html
            //RESETTING THE HTML VAR TO AVOID DUPLICATED RESULTS.
            html=''
        }
    }
    //USING THE GET METHOD CONFIGURED IN app.js
    xhttp.open("GET", "/api/scrape?keyword="+str, true);
    xhttp.send();
}