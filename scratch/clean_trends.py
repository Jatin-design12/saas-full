import re

file_path = 'frontend/src/app/page.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Super Admin Dashboard
# Remove dummy trends from KPI cards
content = re.sub(
    r"change: '[^']+', up: (true|false)",
    "change: liveStats ? '' : '—', up: true",
    content
)

# Replace remaining dummy values
content = re.sub(
    r"val: liveStats \? liveStats.mrr : '[\s\S]*?'",
    "val: liveStats ? liveStats.mrr : (isError ? '—' : 'Loading...')",
    content
)

content = re.sub(
    r"val: liveStats \? liveStats.arr : '[\s\S]*?'",
    "val: liveStats ? liveStats.arr : (isError ? '—' : 'Loading...')",
    content
)

# Doughnut legends dummy data removal
content = re.sub(r"liveStats \? liveStats.subscriptionStatus.active.toLocaleString\('en-US'\) : '[\s\S]*?'", "liveStats ? liveStats.subscriptionStatus.active.toLocaleString('en-US') : '—'", content)
content = re.sub(r"liveStats \? liveStats.subscriptionStatus.trial.toLocaleString\('en-US'\) : '[\s\S]*?'", "liveStats ? liveStats.subscriptionStatus.trial.toLocaleString('en-US') : '—'", content)
content = re.sub(r"liveStats \? liveStats.subscriptionStatus.pastDue.toLocaleString\('en-US'\) : '[\s\S]*?'", "liveStats ? liveStats.subscriptionStatus.pastDue.toLocaleString('en-US') : '—'", content)
content = re.sub(r"liveStats \? liveStats.subscriptionStatus.canceled.toLocaleString\('en-US'\) : '[\s\S]*?'", "liveStats ? liveStats.subscriptionStatus.canceled.toLocaleString('en-US') : '—'", content)
content = re.sub(r"\(73\.2\%\)", "", content)
content = re.sub(r"\(13\.9\%\)", "", content)
content = re.sub(r"\(7\.7\%\)", "", content)
content = re.sub(r"\(5\.2\%\)", "", content)

# Remove fabricated static bar graph data in Super Admin
# The Bar chart has data: [4567890, 2834560, 1245230, 567890]
content = re.sub(
    r"labels: \['Enterprise', 'Business', 'Pro', 'Starter'\],\s*datasets: \[\s*\{\s*data: \[[\d,\s]+\]",
    "labels: liveStats?.topPlans?.labels || [],\n                        datasets: [\n                          {\n                            data: liveStats?.topPlans?.data || []",
    content
)


# ZoneManagerRoleDashboard
# Has `stats.kpis?.totalRiders?.value ?? 0` etc. That's fine if stats come from API.
# But it has dummy data in tables.
# And `fStats` in FranchiseAdminRoleDashboard.

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Cleaned up hardcoded trends and dummy data in page.tsx")
