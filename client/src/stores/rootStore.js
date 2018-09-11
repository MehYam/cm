import LoginStore from './loginStore';
import GameStore from './gameStore';
import BallotStore from './ballotStore';

class RootStore {
   loginStore = new LoginStore();
   gameStore = new GameStore();
   ballotStore = new BallotStore();
}

const rootStore = new RootStore();

export default rootStore;