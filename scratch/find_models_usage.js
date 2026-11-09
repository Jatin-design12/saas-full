const fs = require('fs');
['C:/Users/Himanshu/Documents/Evegah/saas-full/frontend/src/app/new-rider/rental/page.tsx',
 'C:/Users/Himanshu/Documents/Evegah/saas-full/frontend/src/app/retain-rider/rental/page.tsx'].forEach(f => {
   const txt = fs.readFileSync(f, 'utf8');
   const lines = txt.split('\n');
   lines.forEach((l, idx) => {
     if (l.includes('setAvailableModels') || l.includes('availableModels') || l.includes('finalModels') || l.includes('modelsList')) {
       console.log(f.split('\\\\').pop() + ':' + (idx+1) + ' -> ' + l.trim());
     }
   });
});
