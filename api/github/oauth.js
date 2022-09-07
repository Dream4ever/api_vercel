export default function handler(request, response) {
  const { code } = request.query

  if (!code) {
    return response.status(400).end()
  }

  response.status(200).send(`Hello ${code}!`)
}
