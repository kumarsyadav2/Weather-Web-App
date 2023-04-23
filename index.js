const http = require('http');
const fs = require('fs');
const requests = require("requests");

const homeFile = fs.readFileSync("index.html", "utf-8");
const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempVal%}", parseFloat(orgVal.main.temp-273).toFixed(2));
    temperature = temperature.replace("{%tempMin%}", parseFloat(orgVal.main.temp_min-273-6.17).toFixed(2));
    temperature = temperature.replace("{%tempMax%}", parseFloat(orgVal.main.temp_max+2.14-273).toFixed(2));
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%Country%}", orgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);
    // console.log(orgVal.main.temp);
    return temperature;
};


let userCityName = "Delhi"; 
const server = http.createServer((req, res) => {
    if(req.url == "/") {
        requests(`https://api.openweathermap.org/data/2.5/weather?q=${userCityName}&appid=c27326005edf9cde889b801d8c92863d`)
            .on('data', (chunk) => {
                // console.log(chunk);
                const objData = JSON.parse(chunk);
                const arrData = [objData];
            //   console.log(arrData[0].main.temp);
            const realTimeData = arrData.map((val) => replaceVal(homeFile, val)).join("");
             res.write(realTimeData);
            // console.log(realTimeData);
        })
            .on('end', (err) => {
                // console.log(err);
              if (err) return console.log('connection closed due to errors', err);
            res.end();
            //   console.log('end');
            });
    }
});

server.listen(8000,"127.0.0.1");