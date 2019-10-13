import subsrt from 'subsrt'
import fetch from 'node-fetch'
import FormData from 'form-data'

export const romanize = async file => {
  const json = subsrt.convert(file, { format: 'json', fps: 25 })

  const data = JSON.parse(json).map(string => {
    if (string.type === 'caption') {
      return string.content
    }

    return string
  })

  const romanization = data.map(async string => {
    if (string instanceof Object) {
      return undefined
    }

    try {
      const form = new FormData()
      form.append('localization', 'be')
      form.append('text', `${string}`)
      form.append('romanizationType', 'geographicRomanization')

      const res = await fetch('https://corpus.by/Romanizator/api.php', {
        method: 'POST',
        body: form,
        headers: form.getHeaders(),
      })

      const response = await res.json()

      return response.result
    } catch (err) {
      console.log(err)
    }
  })

  return Promise.all(romanization).then(values => {
    const data = values
    const newData = JSON.parse(json).map((string, index) => {
      if (data[index] && string.type === 'caption') {
        return {
          ...string,
          data: {
            ...string.data,
            Text: data[index],
          },
          text: data[index],
          content: data[index],
        }
      }

      return string
    })

    const output = subsrt.build(newData, { format: 'ass' })

    return output
  })
}
