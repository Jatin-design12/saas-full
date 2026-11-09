const http = require('http');

async function testApi() {
  http.get('http://localhost:5000/api/payments/history', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('STATUS:', res.statusCode);
      try {
        const json = JSON.parse(data);
        console.log('RESPONSE STATUS:', json.status);
        console.log('ERROR MESSAGE:', json.message);
        console.log('TOTAL RECORDS:', json.pagination?.total);
        console.log('KPIS:', json.kpis);
        console.log('DATA LENGTH:', json.data?.length);
        console.log('FIRST RECORD:', json.data?.[0]);
      } catch (e) {
        console.log('RAW RESPONSE:', data.slice(0, 500));
      }
    });
  }).on('error', err => {
    console.error('HTTP Error:', err.message);
  });
}

testApi();
