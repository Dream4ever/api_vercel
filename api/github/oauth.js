import axios from 'axios'

export default async function handler(request, response) {
  // 1. 检查 URL 查询字符串中是否有 code
  const { code } = request.query
  
  if (!code) {
    return response.status(400).end()
  }


  // 2. 用 code 获取 access token
  const url = 'https://github.com/login/oauth/access_token?' +
  `client_id=${process.env.CLIENT_ID}&` +
  `client_secret=${process.env.CLIENT_SECRET}&` +
  `code=${code}`

  const headers = {
    headers: {
      accept: 'application/json'
    }
  }

  const result = await axios.post(url, headers)

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
  let redirectUrl = 'https://test.uppbook.com.cn/github_app/index.html'
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
    redirectUrl += encodeURIComponent(queryString)
  }
  console.log(redirectUrl)
  response.redirect(redirectUrl)
}
