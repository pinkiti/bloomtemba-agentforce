export default async function handler(req, res) {
  const { text, response_url, user_name } = req.body;

  res.status(200).end(); // Slackに即時応答

  // ✅ ここにSalesforceへの保存処理を追加する
  await axios.post('https://your-instance.salesforce.com/services/data/vXX.X/sobjects/CustomMemo__c', {
    MemoText__c: text,
    SlackUser__c: user_name,
    Timestamp__c: new Date().toISOString()
  }, {
    headers: {
      Authorization: `Bearer ${access_token}`, // SalesforceのOAuthトークン
      'Content-Type': 'application/json'
    }
  });

  // Slackに非同期応答
  await fetch(response_url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: `記録しました：${text}`
    })
  });
}
