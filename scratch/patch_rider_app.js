const fs = require('fs');
const filePath = 'C:/Users/Himanshu/Documents/Evegah/saas-full/Rider-app/App.js';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/\r\n/g, '\n');

const oldPost = `                    await apiPost('/reservations', {
                      customer_name: profile.name || 'Evegah Rider',
                      mobile: profile.phone || phone || '+91 9999999999',
                      reservation_date: new Date().toISOString().slice(0, 10),
                      reservation_time: new Date().toTimeString().slice(0, 8),
                      package_type: trip?.packageId ? \`\${trip.packageId.charAt(0).toUpperCase() + trip.packageId.slice(1)} Pass\` : 'Daily Pass',`;

const newPost = `                    const pDateStr = trip?.pickupDate ? new Date(trip.pickupDate).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
                    const dDateStr = trip?.dropDate ? new Date(trip.dropDate).toISOString().slice(0, 10) : pDateStr;
                    const pTimeStr = trip?.pickupTime || new Date().toTimeString().slice(0, 8);
                    const dTimeStr = trip?.dropTime || '08:00 PM';
                    const pAtIso = trip?.pickupAt ? new Date(trip.pickupAt).toISOString() : \`\${pDateStr} \${pTimeStr}\`;
                    const dAtIso = trip?.dropAt ? new Date(trip.dropAt).toISOString() : \`\${dDateStr} \${dTimeStr}\`;

                    await apiPost('/reservations', {
                      customer_name: profile.name || 'Evegah Rider',
                      mobile: profile.phone || phone || '+91 9999999999',
                      reservation_date: pDateStr,
                      reservation_time: pTimeStr,
                      pickup_date: pDateStr,
                      pickup_time: pTimeStr,
                      drop_date: dDateStr,
                      drop_time: dTimeStr,
                      pickup_datetime: pAtIso,
                      drop_datetime: dAtIso,
                      start_datetime: pAtIso,
                      end_datetime: dAtIso,
                      package_type: trip?.packageId ? \`\${trip.packageId.charAt(0).toUpperCase() + trip.packageId.slice(1)} Pass\` : 'Daily Pass',`;

if (content.includes(oldPost)) {
  content = content.replace(oldPost, newPost);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully patched Rider-app App.js reservations post payload');
} else {
  console.log('Target not found in Rider-app App.js');
}
