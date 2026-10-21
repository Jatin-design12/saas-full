require('../backend/node_modules/dotenv').config({ path: require('path').join(__dirname, '../backend/.env') });
const db = require('../backend/src/db');

const newVals = {
  home_sliders: [
    {
      id: 'slide_home_1',
      tag: 'Slider 1',
      title: 'Ride Smarter, Go Farther',
      subtitle: 'High-performance electric vehicles designed for delivery and daily city commute.',
      cta: 'Rent EV Now',
      bg: '',
      front: '',
      active: true
    },
    {
      id: 'slide_home_2',
      tag: 'Slider 2',
      title: 'Swap & Go in 60s',
      subtitle: 'Never wait for charging. Fast automated battery swapping stations across Vadodara.',
      cta: 'Find Station',
      bg: '',
      front: '',
      active: true
    },
    {
      id: 'slide_home_3',
      tag: 'Slider 3',
      title: 'Zero Emission Mobility',
      subtitle: 'Reduce carbon footprint with certified green energy battery swaps.',
      cta: 'Explore Fleet',
      bg: '',
      front: '',
      active: true
    }
  ],
  rent_sliders: [
    {
      id: 'slide_rent_1',
      tag: 'Slider 1',
      title: 'Rent at L&T Knowledge City',
      subtitle: 'Instant unlock at Main Gate hub. Smooth ride to office.',
      cta: 'Book This Zone',
      bg: '',
      front: '',
      active: true
    },
    {
      id: 'slide_rent_2',
      tag: 'Slider 2',
      title: 'Parul University Campus Fleet',
      subtitle: 'Zero deposit student & staff plans. Swap batteries inside campus.',
      cta: 'Select Campus Zone',
      bg: '',
      front: '',
      active: true
    },
    {
      id: 'slide_rent_3',
      tag: 'Slider 3',
      title: 'Zepto Dark Store Hub',
      subtitle: 'High payload commercial EVs. Unlimited battery swaps.',
      cta: 'Start Earning',
      bg: '',
      front: '',
      active: true
    }
  ]
};

async function run() {
  await db.query("UPDATE settings SET values = $1 WHERE category = 'app_slider'", [JSON.stringify(newVals)]);
  console.log('Successfully updated app_slider in database to Slider 1, Slider 2, Slider 3!');
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
