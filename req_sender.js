const http = require('http');


function SendRequest() {
    const req = http.get('http://localhost:1001/', (resp) => {
        let data = ''
        resp.on('data', (chunk) => {
            data += chunk;
        });

        resp.on('end', () => {
            console.log(JSON.parse(data));
        })
    });

    req.on('error', console.log);
}

function IntimateSend() {
    setTimeout(() => {
        SendRequest();
        IntimateSend();
    }, 50);
}

IntimateSend();