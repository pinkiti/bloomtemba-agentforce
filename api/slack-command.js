export default async function handler(req, res) {
  const { text, response_url, user_name } = req.body;

  res.status(200).end(); // Slackに即時応答

  // ✅ 環境変数からSalesforce情報を取得
  const access_token = process.env.SALESFORCE_ACCESS_TOKEN;
  const instance_url = process.env.SALESFORCE_INSTANCE_URL;
  const api_version = process.env.SALESFORCE_API_VERSION;

  // ✅ Salesforceに記録を送信
  await fetch(`${instance_url}/services/data/${api_version}/sobjects/CustomMemo__c`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      MemoText__c: text,
      SlackUser__c: user_name,
      Timestamp__c: new Date().toISOString()
    })
  });

  // ✅ Slackに投稿（chat.postMessage）
  await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`, // Bot Tokenを環境変数に設定
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      channel: 'C09KSQWNDTM', // ← #bloom-memo のチャンネルIDに置き換えてください
      text: `記録しました：${text}`
    })
  });

  // ✅ Slackに非同期応答（オプション）
  await fetch(response_url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: `Salesforceにも記録しました：${text}`
    })
  });
}
