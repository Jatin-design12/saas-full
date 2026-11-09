const fs = require('fs');
const txt = fs.readFileSync('C:/Users/Himanshu/Documents/Evegah/saas-full/backend/src/routes/renters.js', 'utf8');
const lines = txt.split('\n');
lines.forEach((l, idx) => {
  if (l.includes("router.get('/',") || l.includes('router.get("/",') || l.includes("router.get('/list'") || l.includes("router.get('/directory'")) {
    console.log((idx+1) + ': ' + l.trim());
  }
});
