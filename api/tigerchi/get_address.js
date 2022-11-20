const axios = require('axios')

export default async function handler(request, response) {
  // 1. 检查 URL 查询字符串中是否有 code
  const { addr } = request.query
  
  if (!addr) {
    return response.status(400).end()
  }

  // 2. 用 code 获取 access token
  const url = 'https://gist.githubusercontent.com/Dream4ever/b638d7ee2a176e75c3b07c05767c5cc8/raw/48d79ce54add00e56727a51c17f5cfb87a8946a8/tigerchi_whitelist.json'

  const headers = {
    headers: {
      accept: 'application/json'
    }
  }

  const result = await axios.get(url)

  console.log(result.data)
  return response.status(200).send({ result.data })
 
  if (result.status !== 200 || !/access_token=\w+/.test(result.data)) {
    return response.status(400).end()
  }

  const accessToken = result.data.match(/access_token=(\w+)/)[1]


  // 3. 用 access token 获取用户信息
  const url2 = `https://api.github.com/user`
  const headers2 = {
    headers: {
      accept: 'application/json',
      Authorization: `token ${accessToken}`
    }
  }
  const result2 = await axios.get(url2, headers2)

  const user = result2.data

  if (!user) {
    return response.status(400).end()
  }


  // 4. 重定向至最初页面，并在 URL 查询字符串中
  // 带上用户 GitHub 信息
  let redirectUrl = 'https://soulcard.noncegeek.com/editor'
  let queryString = '?'

  if (user.login) {
    queryString += `login=${user.login}`
  }
  if (user.id) {
    queryString += `${queryString.length > 1 ? '&' : ''}id=${user.id}`
  }
  if (user.node_id) {
    queryString += `${queryString.length > 1 ? '&' : ''}node_id=${user.node_id}`
  }
  if (user.avatar_url) {
    queryString += `${queryString.length > 1 ? '&' : ''}avatar_url=${user.avatar_url}`
  }

  if (queryString.length > 1) {
    redirectUrl += queryString
  }

  response.redirect(encodeURI(redirectUrl))
}
