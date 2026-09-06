async function sendHeartbeat(client) {
  const payload = {
    bot_id: client.user.id, // BotのDiscord ID
    system: {
      environment: 'AWS EC2', // 稼働環境に合わせて変更
      uptime_seconds: Math.floor(process.uptime()),
      ping_ms: client.ws.ping,
      ram_usage_mb: Math.round((process.memoryUsage().rss / 1024 / 1024) * 100) / 100,
      node_version: process.version
    },
    discord_stats: {
      guild_count: client.guilds.cache.size,
      total_users: client.guilds.cache.reduce((acc, g) => acc + g.memberCount, 0),
      cached_users: client.users.cache.size,
      channels_count: client.channels.cache.size
    },
    guilds: client.guilds.cache.map(g => ({
      id: g.id,
      name: g.name,
      member_count: g.memberCount,
      icon_url: g.iconURL()
    }))
  };

  try {
    const res = await fetch('http://localhost:25565/api/v1/bots/heartbeat', { // テスト時はローカルURL
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DASHBOARD_API_KEY}`
      },
      body: JSON.stringify(payload)
    });
    
    const data = await res.json();
    console.log('[Dashboard Sync Response]', data);
  } catch (err) {
    console.error('[Dashboard Sync Failed]', err.message);
  }
}

module.exports = { sendHeartbeat };