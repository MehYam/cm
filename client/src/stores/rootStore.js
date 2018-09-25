import LoginStore from './loginStore';
import GameStore from './gameStore';
import BallotStore from './ballotStore';
import LeaderboardStore from './leaderboardStore';

class RootStore {
   loginStore = new LoginStore();
   gameStore = new GameStore();
   ballotStore = new BallotStore();
   leaderboardStore = new LeaderboardStore();
}

const rootStore = new RootStore();

export default rootStore;