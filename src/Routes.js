import React, { Component } from 'react';
import { Router, Scene, Stack } from 'react-native-router-flux';
import AboutUs from './pages/AboutUs';
import ContestDetails from './pages/gameProfiles/ContestDetails';
import CreateTeam from './pages/CreateTeam';
import Filter from './pages/Filter';
import ContestsTab from './pages/gameProfiles/ContestsTab';
import ContestsTabCompleted from './pages/gameProfiles/ContestsTabCompleted';
import LeaderBoardTab from './pages/gameProfiles/LeaderBoardTab';

import Contest from './pages/gameProfiles/Contest';
import MyContest from './pages/gameProfiles/MyContest';
import MyTeams from './pages/gameProfiles/MyTeams';
import Login from './pages/Login';
import MyCompleted from './pages/myMatches/MyCompleted';
import MyMatchesTab from './pages/myMatches/MyMatchesTab';
import MyLive from './pages/myMatches/MyLive';
import MyUpcomming from './pages/myMatches/MyUpcomming';
import Nav from './pages/Nav';
import Home from './pages/home/Home';
import NotificationPage from './pages/NotificationPage';
import ResetPassword from './pages/ResetPassword';
import TeamView from './pages/TeamView';
import Signup from './pages/Signup';
import Splash from './pages/Splash';
import Transactions from './pages/Transactions';
import Verification from './pages/Verification';
import VerifyYourAccount from './pages/VerifyYourAccount';
import Wallet from './pages/wallet';
import WalletDetails from './pages/WalletDetails';
import WebViewGlobal from './pages/WebViewGlobal';
import WebViewPayment from './pages/WebViewPayment';
import ContestCreate from './pages/ContestCreate';
import ContestCreateBreakup from './pages/ContestCreateBreakup';

import ContestJoin from './pages/ContestJoin';

import WebviewRules from './pages/WebviewRules';
import WithdrawPage from './pages/WithdrawPage';
import CreateTeamInner from './pages/CreateTeamInner';
import TeamCaptainAllotment from './pages/TeamCaptainAllotment';
import SelectTeams from './pages/SelectTeams';
import PlayerInfo from './pages/PlayerInfo';
import ShareInviteCode from './pages/ShareInviteCode';
import PointSystem from './pages/PointSystem';
import EnterMobile from './pages/EnterMobile';
import ReferelCodeRegistration from './pages/ReferelCodeRegistration';
import VerifyEmail from './pages/VerifyEmail';
import PointSystemTab from './pages/PointSystemTab';
import PlayerStats from './pages/gameProfiles/PlayerStats';
import Leaderboard from './pages/gameProfiles/Leaderboard';
import ContestDetailTab from './pages/gameProfiles/ContestDetailTab';
import SelectTeamsSwitch from './pages/SelectTeamsSwitch';
import ContestCreateSelectTeams from './pages/ContestCreateSelectTeams';
import ShareContestCode from './pages/ShareContestCode';






export default class Routes extends Component {
	render() {
		return (
			<Router>
				<Stack key="root" hideNavBar={true}>
					<Scene key="splash" component={Splash} title="Splash"
						type='reset' initial={true}
					/>
					<Scene key="login" component={Login} title="Login"
						type='reset' />
					<Scene key="signup" component={Signup} title="Register" />
					<Scene key="SelectTeamsSwitch" component={SelectTeamsSwitch} title="SelectTeamsSwitch" />
					<Scene key="PointSystemTab" component={PointSystemTab} title="PointSystemTab" />
					<Scene key="ReferelCodeRegistration" component={ReferelCodeRegistration} title="ReferelCodeRegistration" />
					<Scene key="VerifyEmail" component={VerifyEmail} title="VerifyEmail" />
					<Scene key="EnterMobile" component={EnterMobile} title="EnterMobile" />
					<Scene key="WebViewGlobal" component={WebViewGlobal} title="WebViewGlobal" />
					<Scene key="Transactions" component={Transactions} title="Transactions" />
					<Scene key="PointSystem" component={PointSystem} title="PointSystem" />
					<Scene key="Filter" component={Filter} title="Filter" />
					<Scene key="wallet" component={Wallet} title="Wallet" />
					<Scene key="TeamView" component={TeamView} title="TeamView" />
					<Scene key="ResetPassword" component={ResetPassword} title="Reset Password" />
					<Scene key="Verification" component={Verification} title="Verification" />
					<Scene key="AboutUs" component={AboutUs} title="AboutUs" />
					<Scene key="CreateTeam" component={CreateTeam} title="CreateTeam" />
					<Scene key="WebviewRules" component={WebviewRules} title="WebviewRules" />

					<Scene key="nav" component={Nav} title="Navigation" type='reset' />
					<Scene key="WalletDetails" component={WalletDetails} title="WalletDetails" />
					<Scene key="ContestDetails" component={ContestDetails} title="ContestDetails"
					/>
					<Scene key="VerifyYourAccount" component={VerifyYourAccount} title="VerifyYourAccount" />
					<Scene key="Home" component={Home} title="Dashboard" 
					/>

					<Scene key="MyUpcomming" component={MyUpcomming} title="MyUpcoming"
					/>
					<Scene key="MyLive" component={MyLive} title="MyLive"
					/>
					<Scene key="MyCompleted" component={MyCompleted} title="MyCompleted"
					/>
					<Scene key="WithdrawPage" component={WithdrawPage} title="WithdrawPage"
					/>
					<Scene key="CreateTeamInner" component={CreateTeamInner} title="CreateTeamInner"
					/>



					<Scene key="NotificationPage" component={NotificationPage} title="NotificationPage"
					/>

					<Scene key="TeamCaptainAllotment" component={TeamCaptainAllotment} title="TeamCaptainAllotment"
					/>
					<Scene key="SelectTeams" component={SelectTeams} title="SelectTeams"
					/>



					<Scene key="ContestsTab" component={ContestsTab} title="ContestsTab"
					/>
					<Scene key="ContestsTabCompleted" component={ContestsTabCompleted} title="ContestsTabCompleted"
					/>
					<Scene key="LeaderBoardTab" component={LeaderBoardTab} title="LeaderBoardTab"
					/>
					<Scene key="MyContest" component={MyContest} title="MyContest"
					/>
					<Scene key="MyTeams" component={MyTeams} title="MyTeams"
					/>
					<Scene key="PlayerInfo" component={PlayerInfo} title="PlayerInfo"
					/>
					<Scene key="ShareInviteCode" component={ShareInviteCode} title="ShareInviteCode"
					/>

					<Scene key="PlayerStats" component={PlayerStats} title="PlayerStats"
					/>
					<Scene key="Leaderboard" component={Leaderboard} title="Leaderboard"
					/>
					<Scene key="ContestDetailTab" component={ContestDetailTab} title="ContestDetailTab"
					/>
					<Scene key="MyMatchesTab" component={MyMatchesTab} title="MyMatchesTab"
					/>
					<Scene key="Contest" component={Contest} title="Contest"
					/>

					<Scene key="WebViewPayment" component={WebViewPayment} title="WebViewPayment"
					/>

					<Scene key="ContestJoin" component={ContestJoin} title="ContestJoin"
					/>
					<Scene key="ContestCreate" component={ContestCreate} title="ContestCreate"
					/>
					<Scene key="ContestCreateBreakup" component={ContestCreateBreakup} title="ContestCreateBreakup"
					/>
					<Scene key="ShareContestCode" component={ShareContestCode} title="ShareContestCode"
					/>
					
	<Scene key="ContestCreateSelectTeams" component={ContestCreateSelectTeams} title="ContestCreateSelectTeams"
					/>
				</Stack>
			</Router>
		)
	}
}