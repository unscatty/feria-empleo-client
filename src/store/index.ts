import JobPost from '@/store/modules/job-post';
import Vue from 'vue';
import Vuex from 'vuex';
import CompanyStore from './modules/company';
import Ui from './modules/ui';

Vue.use(Vuex);
const store = new Vuex.Store({
  modules: {
    JobPost,
    Ui,
    CompanyStore,
  },
});
export default store;
