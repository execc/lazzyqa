const { Kafka } = require('kafkajs')
const { partition } = require('./utils')
const fs = require('fs')

const kafka = new Kafka({
    clientId: 'zil-content-loader',
    brokers: [process.env['KAFKA_URL']]
})

const sendMessages = async (topic, messages) => {
    const producer = kafka.producer()
    await producer.connect()
    console.log(`Sending ${messages.length} messages`)
    let sent = 0
    for (messageBatch of partition(messages, 20)) {
        await producer.send({
            topic,
            messages: messageBatch,
        })
        sent += messageBatch.length
        console.log(`Sent ${sent} / ${messages.length} messages`)
    }
    console.log(`Sent ${messages.length} messages`)
    await producer.disconnect()
}

const subscribeTo = async (groupId, topic, cb, fromBeginning = false) => {
    const consumer = kafka.consumer({ groupId })

    await consumer.connect()
    await consumer.subscribe({ topic, fromBeginning })

    console.log(`Subscribed ${groupId} to ${topic}`)
    
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
          const data = JSON.parse(message.value)
          await cb(data)
      },
    })
}

module.exports = {
    sendMessages,
    subscribeTo
}