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

            //    exmo

            for (let i in data) {
                let exchange = data[i];
                 if (i=='exmo'){
                    html+='<tr><td>&nbsp;</td><tr><tr><td><strong>'+ i + '</strong></td><tr>' 
                    for (let y in exchange) {
                            html+='<tr><td>'+ exchange[y].name +'</td><td>'+ exchange[y].last + '</td><tr>'
                    }
                 }
            }

            // other

            for (let i in data) {
                let exchange = data[i];
                    html+='<tr><td>&nbsp;</td><tr><tr><td><strong>'+ i + '</strong></td><tr>' 
                    for (let y in exchange) {
                        html+='<tr><td>'+ exchange[y].name +'</td><td>'+ exchange[y].last + '</td><tr>'
                    }
            }

            html+='</tbody></table>';

            $('div.board').html(html);
        })
        .fail(function (f) {
            console.log('fail,', f.status)
        });
};
