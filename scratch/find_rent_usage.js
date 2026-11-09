const fs = require('fs');
['C:/Users/Himanshu/Documents/Evegah/saas-full/Rider-app/App.js',
 'C:/Users/Himanshu/Documents/Evegah/saas-full/Rider-app/screens/HomeScreen.js',
 'C:/Users/Himanshu/Documents/Evegah/saas-full/Rider-app/screens/PayScreen.js'].forEach(f => {
   if (fs.existsSync(f)) {
     const txt = fs.readFileSync(f, 'utf8');
     const lines = txt.split('\n');
     lines.forEach((l, idx) => {
       if (l.includes('<RentScreen') || l.includes('RentScreen') || l.includes('pickupAt') || l.includes('createReservation') || l.includes('/reservations')) {
         console.log(f.split('\\\\').pop() + ':' + (idx+1) + ' -> ' + l.trim());
       }
     });
   }
});
