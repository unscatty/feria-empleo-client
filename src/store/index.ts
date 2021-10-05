import JobPost from '@/store/modules/job-post';
import Vue from 'vue';
import Vuex from 'vuex';
import Ui from './modules/ui';

Vue.use(Vuex);
const store = new Vuex.Store({
  modules: {
    JobPost,
    Ui,
  },
});
export default store;
