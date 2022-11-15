<template>
  	<div class="finish-wrap">
		<el-card class="box-card">
			你好，欢迎登录本系统！
			<img class="logo" src="../assets/asoul.jpg" />
			<br />
		</el-card>
	</div>
</template>

<script>
	export default {
		name: "Index"
	}
</script>

<style scoped>
.text {
	font-size: 14px;
}

.item {
	padding: 18px 0;
}

.box-card {
	width: 480px;
}

body {
	color: #42b983;
}

label {
	margin: 0 0.5em;
	font-weight: bold;
}

code {
	background-color: #eee;
	padding: 2px 4px;
	border-radius: 4px;
	color: #304455;
}

.finish-wrap {
	min-height: 100vh;
	height: 100%;
	position: fixed;
	width: 100%;
	left: 40%;
}

.logo {
	vertical-align: middle;
	width: 200px;
}


</style>