import LoginStore from './loginStore';
import GameStore from './gameStore';
import BallotStore from './ballotStore';
import LeaderboardStore from './leaderboardStore';
import FriendStore from './friendStore';
import BadgeStore from './badgeStore';

class RootStore {
   badgeStore = new BadgeStore();
   ballotStore = new BallotStore();
   friendStore = new FriendStore();
   gameStore = new GameStore();
   leaderboardStore = new LeaderboardStore();
   loginStore = new LoginStore();
}

const rootStore = new RootStore();

export default rootStore;