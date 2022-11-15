<template>
	<el-container>
		<el-aside width="200px" style="background-color: #545c64;">

			<SideMenu></SideMenu>

		</el-aside>
		<el-container>
			<el-header style="background-color: #545c64;">
				<strong style="color: #f8f4ed">教师综合评价管理系统</strong>

				<div class="header-avatar">
					<el-dropdown>
						<span class="el-dropdown-link" style="color: #f8f4ed">
						{{userInfo.username}}<i class="el-icon-arrow-down el-icon--right"></i>
						</span>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item >
								<router-link :to="{name: 'UserCenter'}">个人中心</router-link>
							</el-dropdown-item>
							<el-dropdown-item @click.native="logout">退出</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>

					
				</div>

			</el-header>
			<el-main style="background-color: #d0dfe6;">
				<Tabs></Tabs>
				<div style="margin: 0 15px; ">
					<router-view/>
				</div>
			</el-main>
		</el-container>
	</el-container>
</template>

<script>
	import {ref} from 'vue'
	import SideMenu from "./inc/SideMenu";
	import Tabs from "./inc/Tabs";

	

	export default {
		name: "Home",
		components: {
			SideMenu, Tabs
		},
		data() {
			return {
				userInfo: {
					id: "",
					username: "",
					avatar: ""
				},
				squareUrl:''
			}
		},
		created() {
			this.getUserInfo()
			
		},
		methods: {
			getUserInfo() {
				this.$axios.get("/sys/userInfo").then(res => {
					this.userInfo = res.data.data
					
				})
			},
			logout() {
				this.$axios.post("/logout").then(res => {
					localStorage.clear()
					sessionStorage.clear()

					this.$store.commit("resetState")

					this.$router.push("/login")
				})
			}
		}
	}
</script>

<style scoped>
	.el-container {
		padding: 0;
		margin: 0;
		height: 100%;
	}

	.header-avatar {
		float: right;
		width: 210px;
		display: flex;
		justify-content: space-around;
		align-items: center;
		
	}

	.el-dropdown-link {
		cursor: pointer;
	}

	.el-header {
		background-color: #F5F7FA;
		color: #333;
		text-align: center;
		line-height: 60px;
	}

	.el-aside {
		background-color: #D3DCE6;
		color: #333;
		line-height: 200px;
	}

	.el-main {
		color: #333;
		padding: 0;
	}

	a {
		text-decoration: none;
	}
</style>