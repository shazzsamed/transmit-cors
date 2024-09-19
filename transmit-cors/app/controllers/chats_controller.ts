import transmit from '@adonisjs/transmit/services/main'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

export default class ChatsController {
  store({ request, response }: HttpContext) {
    const { message, username } = request.only(['message', 'username'])

    if (!message) {
      return response.redirect().back()
    }

    console.log(
      'messgae received',
      `[${DateTime.now().toFormat('DD H:mm:ss')}] ${username ?? 'Guest'}: ${message}`
    )

    transmit.broadcast('chats/1', {
      message: `[${DateTime.now().toFormat('DD H:mm:ss')}] ${username ?? 'Guest'}: ${message}`,
    })

    return {
      message: `[${DateTime.now().toFormat('DD H:mm:ss')}] ${username ?? 'Guest'}: ${message}`,
    }
  }
}
