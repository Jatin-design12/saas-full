const fs = require('fs');

let content = fs.readFileSync('frontend/src/app/page.tsx', 'utf8');

const targetStr = `function SuperAdminRoleDashboard() {
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

// Use regex because of whitespace
const regex = /function SuperAdminRoleDashboard\(\) \{\s*const \[liveStats, setLiveStats\] = useState<any>\(null\);\s*useEffect\(\(\) => \{\s*const fetchSuperStats = async \(\) => \{\s*try \{\s*const res = await api\.get\('\/stats\/super-admin'\);\s*if \(res\.status === 'success' && res\.data\) \{\s*setLiveStats\(res\.data\);\s*\}\s*\} catch \(e\) \{\s*console\.warn\('SuperAdmin stats fetch error:', e\);\s*\}\s*\};\s*fetchSuperStats\(\);\s*\}, \[\]\);/;

const replaceStr = `function SuperAdminRoleDashboard() {
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

content = content.replace(regex, replaceStr);

fs.writeFileSync('frontend/src/app/page.tsx', content, 'utf8');
console.log('Fixed states in SuperAdmin');
