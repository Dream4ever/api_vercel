export default function handler(request, response) {
  const { name } = request.query

  if (!name) {
    return response.status(200).send(`Hello Nobody~`)
  }

  response.status(200).send(`Hello ${name}!`)
}
