import axios from 'axios'

export default async function handler(request, response) {
  const { code } = request.query

  if (!code) {
    return response.status(400).end()
  }

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


  response.status(200).send(result)
}
