import LoginStore from './loginStore';

class RootStore {
   loginStore = new LoginStore();
}

const rootStore = new RootStore();

export default rootStore;