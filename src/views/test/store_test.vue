<template>
	<div>
		<h3>{{ $t("session_test") }}</h3>

		<van-button type="primary" @click="setSession" size="small">{{
			$t("set_session")
		}}</van-button>
		<van-button type="primary" @click="clearSession" size="small">{{
			$t("clear_session")
		}}</van-button>

		<p>Stored User Token: {{ storedUserToken }}</p>
		<p>Stored Session ID: {{ storedSessionId }}</p>

		<van-button type="primary" @click="goToHome" size="small">{{
			$t("go_to_home")
		}}</van-button>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useUserDataStore } from "@/store/useUserData"
import { useRouter } from "vue-router"
const router = useRouter()
// 获取 Pinia store
const sessionStore = useUserDataStore()
const clearSession = () => {
	sessionStore.clear()
}

const setSession = () => {
	sessionStore.setItem("userToken", "abcabc")
	sessionStore.setItem("sessionId", "123456")
}

const goToHome = () => {
	router.push("/home")
}

// 计算属性：从 sessionStore 中获取已存储的值
const storedUserToken = computed(() =>
	sessionStore.getItem<string>("userToken")
)
const storedSessionId = computed(() =>
	sessionStore.getItem<string>("sessionId")
)
</script>

<style scoped>
.van-button {
	margin-right: 10px;
}
</style>
