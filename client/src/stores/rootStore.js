import LoginStore from './loginStore';
import GameStore from './gameStore';

class RootStore {
   loginStore = new LoginStore();
   gameStore = new GameStore();
}

const rootStore = new RootStore();

export default rootStore;