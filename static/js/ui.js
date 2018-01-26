'use strict'

checkJquery();

function checkJquery() {
    if (window.$){
        console.log('ui.js');
        startMe();
    } else {
        setTimeout(checkJquery, 50);
    }
}

function startMe () {
    $.get('/tickers')
        .done(function (data) {
            //console.log(`tickers:`, data)
            let html = '<table><thead><tr></tr></thead><tbody>'

            for (let i in data) {

            	console.log(`tickers:`, data[i])

            	html+='<tr><td>'+ data[i].exchange +'</td><td>'+ data[i].ticker +'</td><td>'+ data[i].last + '</td><tr>'

            }

            html+='</tbody></table>';

            $('div.board').html(html);
        })
        .fail(function (f) {
            console.log('fail,', f.status)
        });
};


