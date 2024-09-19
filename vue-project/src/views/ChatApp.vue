<template>
  <div>
    <div id="messages" class="message-container">
      <p v-for="(message, index) in messages" :key="index">{{ message }}</p>
    </div>
    <form @submit.prevent="sendMessage" id="message_form">
      <input v-model="message" id="message" placeholder="Type a message" />
      <button type="submit">Send</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Transmit } from "@adonisjs/transmit-client";

// Reactive variables
const messages = ref([]);
const message = ref("");

// Create the Transmit client
const transmit = new Transmit({
  baseUrl: "http://localhost:3333",
});

// Send a message
const sendMessage = async () => {
  if (!message.value) return;

  const formData = new FormData();
  formData.append("message", message.value);

  try {
    const response = await fetch("http://localhost:3333/messages", {
      method: "POST",
      body: formData,
    });
    messages.value.push(message.value);
    message.value = "";
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

// Subscribe to the Transmit channel
const subscribeToMessages = async () => {
  const subscription = transmit.subscription("chats/1");
  await subscription.create();

  subscription.onMessage(({ message }) => {
    messages.value.push(message);
  });
};

// Lifecycle hook to subscribe to messages when the component is mounted
onMounted(() => {
  subscribeToMessages();
});
</script>

<style>
.message-container {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 10px;
}
</style>
