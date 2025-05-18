import { Locale } from "../i18n";

export type HighScore = {
  id: string;
  name: string;
  scenarioId: string;
  score: number;
  timestamp: string;
};

// Mock data for high scores - mostly low scores with a few humorous exceptions
const generateMockScores = (): HighScore[] => {
  return [
    {
      id: '1',
      name: 'ZombieBait42',
      scenarioId: 'zombie',
      score: 1,
      timestamp: '2023-05-12T14:23:45Z',
    },
    {
      id: '2',
      name: 'LastManStanding',
      scenarioId: 'zombie',
      score: 4,
      timestamp: '2023-06-02T09:12:33Z',
    },
    {
      id: '3',
      name: 'AlienSnack',
      scenarioId: 'alien',
      score: 2,
      timestamp: '2023-04-18T21:45:12Z',
    },
    {
      id: '4',
      name: 'RunnerWhoTrips',
      scenarioId: 'zombie',
      score: 0,
      timestamp: '2023-05-30T16:22:08Z',
    },
    {
      id: '5',
      name: 'PhoneBatteryAt1%',
      scenarioId: 'alien',
      score: 0,
      timestamp: '2023-07-14T11:33:27Z',
    },
    {
      id: '6',
      name: 'ActuallyReadSurvivalManual',
      scenarioId: 'zombie',
      score: 12,
      timestamp: '2023-06-19T15:41:05Z',
    },
    {
      id: '7',
      name: 'HidesInBathroom',
      scenarioId: 'alien',
      score: 1,
      timestamp: '2023-05-05T08:17:52Z',
    },
    {
      id: '8',
      name: 'PackedOnlySelfies',
      scenarioId: 'zombie',
      score: 0,
      timestamp: '2023-07-22T19:28:14Z',
    },
    {
      id: '9',
      name: 'AskingForAlienManager',
      scenarioId: 'alien',
      score: 3,
      timestamp: '2023-06-11T10:09:37Z',
    },
    {
      id: '10',
      name: 'SneezesAtWorstTimes',
      scenarioId: 'zombie',
      score: 1,
      timestamp: '2023-04-29T13:55:19Z',
    },
    {
      id: '11',
      name: 'AllergicToAliens',
      scenarioId: 'alien',
      score: 2,
      timestamp: '2023-07-08T22:42:31Z',
    },
    {
      id: '12',
      name: 'ActualZombieDoorDashDriver',
      scenarioId: 'zombie',
      score: 25,
      timestamp: '2023-05-17T17:36:59Z',
    },
    {
      id: '13',
      name: 'ForgotToChargeTaser',
      scenarioId: 'alien',
      score: 1,
      timestamp: '2023-06-25T07:14:42Z',
    },
    {
      id: '14',
      name: 'StillPayingMortgage',
      scenarioId: 'zombie',
      score: 3,
      timestamp: '2023-07-01T12:29:05Z',
    },
    {
      id: '15',
      name: 'WatchedAllSciFiMovies',
      scenarioId: 'alien',
      score: 8,
      timestamp: '2023-04-22T18:51:23Z',
    }
  ];
};

// Translated funny score comments
export const scoreComments: Record<Locale, Record<string, string>> = {
  'en': {
    'ZombieBait42': 'Mistook "zombie bait" for a survival strategy',
    'LastManStanding': 'Got winded standing up too quickly',
    'AlienSnack': 'First to volunteer as "alien cultural exchange"',
    'RunnerWhoTrips': 'Classic horror movie victim',
    'PhoneBatteryAt1%': 'Still trying to post apocalypse selfies',
    'ActuallyReadSurvivalManual': 'Read manuals, built bunker, still forgot water',
    'HidesInBathroom': 'Bathroom hiding strategy surprisingly ineffective',
    'PackedOnlySelfies': 'Packed 20 selfie sticks, zero food',
    'AskingForAlienManager': 'Tried to negotiate using expired coupons',
    'SneezesAtWorstTimes': 'World-record sneeze timing champion',
    'AllergicToAliens': 'Turns out aliens are 90% cat dander',
    'ActualZombieDoorDashDriver': 'Accidentally delivered to zombie horde',
    'ForgotToChargeTaser': 'Weapon of choice: stern language',
    'StillPayingMortgage': 'Refused to abandon underwater mortgage',
    'WatchedAllSciFiMovies': 'Knowledge limited to scientifically inaccurate movies'
  },
  'zh-TW': {
    'ZombieBait42': '把「殭屍誘餌」誤認為是生存策略',
    'LastManStanding': '站起來太快就喘不過氣',
    'AlienSnack': '第一個自願作為「外星文化交流」的人',
    'RunnerWhoTrips': '經典恐怖電影受害者',
    'PhoneBatteryAt1%': '仍然嘗試發佈末日自拍',
    'ActuallyReadSurvivalManual': '讀了手冊，建了掩體，忘了帶水',
    'HidesInBathroom': '浴室躲藏策略出乎意料地無效',
    'PackedOnlySelfies': '帶了20根自拍桿，零食物',
    'AskingForAlienManager': '嘗試用過期優惠券談判',
    'SneezesAtWorstTimes': '世界紀錄噴嚏時機冠軍',
    'AllergicToAliens': '原來外星人是90%貓皮屑',
    'ForgotToChargeTaser': '選擇的武器：嚴厲的語言',
    'ActualZombieDoorDashDriver': '不小心送餐給殭屍群',
    'StillPayingMortgage': '拒絕放棄負資產房貸',
    'WatchedAllSciFiMovies': '知識僅限於科學上不準確的電影'
  }
};

export const getMockHighScores = (): HighScore[] => {
  return generateMockScores();
};

// Get a random high score position to insert the user into the list
export const getRandomHighScorePosition = (userScore: number): number => {
  // If user score is really high (rare), put them near the top
  if (userScore > 10) {
    return Math.floor(Math.random() * 3) + 1; // Position 1-3
  }
  
  // If user score is medium, put them in the middle
  if (userScore > 5) {
    return Math.floor(Math.random() * 5) + 5; // Position 5-9
  }
  
  // For most users with low scores, put them near the bottom
  return Math.floor(Math.random() * 4) + 10; // Position 10-13
}; 