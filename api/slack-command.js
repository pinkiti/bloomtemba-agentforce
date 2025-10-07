export default async function handler(req, res) {
  const { text, response_url } = req.body;

  res.status(200).end(); // Slackのタイムアウト防止

  await fetch(response_url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: `記録しました：${text}`
    })
  });
}
