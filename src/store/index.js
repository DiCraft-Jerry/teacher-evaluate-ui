import Vue from 'vue'
import Vuex from 'vuex'
import menus from "./modules/menus";

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		token: ''
		
	},
	getters:{
		GET_USERINFO:state => {
			return JSON.parse(sessionStorage.getItem("userInfo"));
		  }
	},
	mutations: {

		SET_TOKEN: (state, token) => {
			state.token = token
			localStorage.setItem("token", token)
		},
		SET_USERINFO:(state,userInfo)=>{
			sessionStorage.setItem("userInfo",JSON.stringify(userInfo));
		  },

	},
	actions: {},
	modules: {
		menus
	}
})
