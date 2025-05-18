import { Locale } from "../i18n";

export type HighScore = {
  id: string;
  name: string;
  scenarioId: string;
  score: number;
  timestamp: string;
};

// Mock data for high scores - all zeros for consistently terrible survival odds
const generateMockScores = (): HighScore[] => {
  return [
    {
      id: '1',
      name: 'ZombieBait42',
      scenarioId: 'zombie',
      score: 0,
      timestamp: '2023-05-12T14:23:45Z',
    },
    {
      id: '2',
      name: 'LastManStanding',
      scenarioId: 'zombie',
      score: 0,
      timestamp: '2023-06-02T09:12:33Z',
    },
    {
      id: '3',
      name: 'AlienSnack',
      scenarioId: 'alien',
      score: 0,
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
      name: 'MisreadSurvivalManual',
      scenarioId: 'zombie',
      score: 0,
      timestamp: '2023-06-19T15:41:05Z',
    },
    {
      id: '7',
      name: 'HidesInBathroom',
      scenarioId: 'alien',
      score: 0,
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
      score: 0,
      timestamp: '2023-06-11T10:09:37Z',
    },
    {
      id: '10',
      name: 'SneezesAtWorstTimes',
      scenarioId: 'zombie',
      score: 0,
      timestamp: '2023-04-29T13:55:19Z',
    },
    {
      id: '11',
      name: 'AllergicToAliens',
      scenarioId: 'alien',
      score: 0,
      timestamp: '2023-07-08T22:42:31Z',
    },
    {
      id: '12',
      name: 'DeliveredToWrongAddress',
      scenarioId: 'zombie',
      score: 0,
      timestamp: '2023-05-17T17:36:59Z',
    },
    {
      id: '13',
      name: 'ForgotToChargeTaser',
      scenarioId: 'alien',
      score: 0,
      timestamp: '2023-06-25T07:14:42Z',
    },
    {
      id: '14',
      name: 'StillPayingMortgage',
      scenarioId: 'zombie',
      score: 0,
      timestamp: '2023-07-01T12:29:05Z',
    },
    {
      id: '15',
      name: 'FellAsleepDuringBriefing',
      scenarioId: 'alien',
      score: 0,
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
    'MisreadSurvivalManual': 'Read manual upside down, followed instructions backwards',
    'HidesInBathroom': 'Bathroom hiding strategy surprisingly ineffective',
    'PackedOnlySelfies': 'Packed 20 selfie sticks, zero food',
    'AskingForAlienManager': 'Tried to negotiate using expired coupons',
    'SneezesAtWorstTimes': 'World-record sneeze timing champion',
    'AllergicToAliens': 'Turns out aliens are 90% cat dander',
    'DeliveredToWrongAddress': 'GPS directed straight to monster convention',
    'ForgotToChargeTaser': 'Weapon of choice: stern language',
    'StillPayingMortgage': 'Refused to abandon underwater mortgage',
    'FellAsleepDuringBriefing': 'Missed the "don\'t press this button" instruction'
  },
  'zh-TW': {
    'ZombieBait42': '把「殭屍誘餌」誤認為是生存策略',
    'LastManStanding': '站起來太快就喘不過氣',
    'AlienSnack': '第一個自願作為「外星文化交流」的人',
    'RunnerWhoTrips': '經典恐怖電影受害者',
    'PhoneBatteryAt1%': '仍然嘗試發佈末日自拍',
    'MisreadSurvivalManual': '將手冊倒著讀，指示反著做',
    'HidesInBathroom': '浴室躲藏策略出乎意料地無效',
    'PackedOnlySelfies': '帶了20根自拍桿，零食物',
    'AskingForAlienManager': '嘗試用過期優惠券談判',
    'SneezesAtWorstTimes': '世界紀錄噴嚏時機冠軍',
    'AllergicToAliens': '原來外星人是90%貓皮屑',
    'DeliveredToWrongAddress': 'GPS直接導航到怪物大會',
    'ForgotToChargeTaser': '選擇的武器：嚴厲的語言',
    'StillPayingMortgage': '拒絕放棄負資產房貸',
    'FellAsleepDuringBriefing': '錯過了「不要按這個按鈕」的指示'
  }
};

export const getMockHighScores = (): HighScore[] => {
  return generateMockScores();
};

// Get a random high score position to insert the user into the list
export const getRandomHighScorePosition = (): number => {
  // Since all scores are now 0, just pick a random position
  return Math.floor(Math.random() * 15) + 1; // Position 1-15
}; 