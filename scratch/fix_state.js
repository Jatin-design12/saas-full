const fs = require('fs');

let content = fs.readFileSync('frontend/src/app/page.tsx', 'utf8');

const target1 = `function SuperAdminRoleDashboard() {
    const [liveStats, setLiveStats] = useState<any>(null);
  
    useEffect(() => {
      const fetchSuperStats = async () => {
        try {
          const res = await api.get('/stats/super-admin');
          if (res.status === 'success' && res.data) {
            setLiveStats(res.data);
          }
        } catch (e) {
          console.warn('SuperAdmin stats fetch error:', e);
        }
      };
      fetchSuperStats();
    }, []);`;

const replace1 = `function SuperAdminRoleDashboard() {
    const [liveStats, setLiveStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);
  
    useEffect(() => {
      const fetchSuperStats = async () => {
        try {
          setIsLoading(true);
          const res = await api.get('/stats/super-admin');
          if (res.status === 'success' && res.data) {
            setLiveStats(res.data);
          } else {
            setIsError(true);
          }
        } catch (e) {
          console.warn('SuperAdmin stats fetch error:', e);
          setIsError(true);
        } finally {
          setIsLoading(false);
        }
      };
      fetchSuperStats();
    }, []);`;

content = content.replace(target1, replace1);

// Now for FinanceAccountsRoleDashboard dummy data
const financeTarget = `function FinanceAccountsRoleDashboard() {
  return (`;

if (content.includes('FinanceAccountsRoleDashboard() {')) {
  content = content.replace(/val: '₹,128,45,900'/g, "val: '—'");
  content = content.replace(/val: '₹,112,40,000'/g, "val: '—'");
  content = content.replace(/val: '₹,11,15,000'/g, "val: '—'");
  content = content.replace(/val: '₹,18,90,000'/g, "val: '—'");
  content = content.replace(/val: '34\.2%'/g, "val: '—'");
}

fs.writeFileSync('frontend/src/app/page.tsx', content, 'utf8');
console.log('Fixed states and removed dummy data.');
