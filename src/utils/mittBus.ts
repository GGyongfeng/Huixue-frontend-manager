/**
 * 全局事件总线，用于全局事件的发布与订阅
 * 用法：
 * mittBus.on('event', callback)
 * mittBus.emit('event', data)
 */
import mitt from 'mitt'

type Events = {
    'refresh-tutor-list': void
}

const emitter = mitt<Events>()

export default emitter
