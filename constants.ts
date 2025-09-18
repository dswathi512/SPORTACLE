
import { Sport, UserRole, Gender, FitnessTest, TestName, AthleteProfile, OfficialRole, OfficialProfile } from './types';

export const SPORTS_LIST: Sport[] = Object.values(Sport);
export const USER_ROLES_LIST: UserRole[] = Object.values(UserRole);
export const GENDERS_LIST: Gender[] = Object.values(Gender);
export const OFFICIAL_ROLES_LIST: OfficialRole[] = Object.values(OfficialRole);

export const FITNESS_TESTS: FitnessTest[] = [
  { id: 't1', name: TestName.HEIGHT_WEIGHT, description: "Measure your height (cm) and weight (kg).", videoUrl: "https://videos.pexels.com/video-files/3838043/3838043-hd_1280_720_25fps.mp4", unit: "cm/kg" },
  { id: 't2', name: TestName.VERTICAL_JUMP, description: "Measure the height of your jump from a standing position.", videoUrl: "https://videos.pexels.com/video-files/5840507/5840507-hd_1920_1080_30fps.mp4", unit: "cm" },
  { id: 't3', name: TestName.SHUTTLE_RUN, description: "Test of speed and agility, running between two points 10m apart.", videoUrl: "https://videos.pexels.com/video-files/8097127/8097127-sd_640_360_24fps.mp4", unit: "s" },
  { id: 't4', name: TestName.SIT_UPS, description: "Maximum number of sit-ups you can perform in one minute.", videoUrl: "https://videos.pexels.com/video-files/5225477/5225477-hd_1920_1080_25fps.mp4", unit: "reps" },
  { id: 't5', name: TestName.ENDURANCE_RUN, description: "Time taken to complete a 1600m run or walk.", videoUrl: "https://videos.pexels.com/video-files/857041/857041-hd_1920_1080_25fps.mp4", unit: "min" },
];

export const MOCK_ATHLETES: AthleteProfile[] = [
  {
    id: 'athlete1',
    firstName: 'Priya',
    lastName: 'Sharma',
    dob: '2008-05-15',
    contact: 'priya.sharma@email.com',
    sport: Sport.ATHLETICS,
    role: UserRole.ATHLETE,
    roleInSport: 'Sprinter',
    age: 16,
    gender: Gender.FEMALE,
    results: [
      { testId: 't1', latestScore: 165060, benchmark: 0, percentile: 80, history: [{ date: '2024-07-15', value: 165060 }]},
      { testId: 't2', latestScore: 45, benchmark: 40, percentile: 75, history: [{ date: '2024-06-01', value: 42 }, { date: '2024-07-15', value: 45 }] },
      { testId: 't3', latestScore: 11.5, benchmark: 12.0, percentile: 80, history: [{ date: '2024-06-01', value: 11.8 }, { date: '2024-07-15', value: 11.5 }] },
      { testId: 't4', latestScore: 42, benchmark: 38, percentile: 85, history: [{ date: '2024-06-01', value: 38 }, { date: '2024-07-15', value: 42 }] },
      { testId: 't5', latestScore: 7.5, benchmark: 8.0, percentile: 78, history: [{ date: '2024-06-01', value: 7.8 }, { date: '2024-07-15', value: 7.5 }] },
    ]
  },
  {
    id: 'athlete2',
    firstName: 'Rohan',
    lastName: 'Verma',
    dob: '2007-11-20',
    contact: 'rohan.verma@email.com',
    sport: Sport.CRICKET,
    role: UserRole.ATHLETE,
    roleInSport: 'Batsman',
    age: 17,
    gender: Gender.MALE,
    results: [
      { testId: 't1', latestScore: 178072, benchmark: 0, percentile: 85, history: [{ date: '2024-07-10', value: 178072 }]},
      { testId: 't2', latestScore: 55, benchmark: 58, percentile: 65, history: [{ date: '2024-05-20', value: 53 }, { date: '2024-07-10', value: 55 }] },
      { testId: 't3', latestScore: 11.2, benchmark: 11.5, percentile: 70, history: [{ date: '2024-05-20', value: 11.4 }, { date: '2024-07-10', value: 11.2 }] },
      { testId: 't4', latestScore: 50, benchmark: 45, percentile: 90, history: [{ date: '2024-05-20', value: 46 }, { date: '2024-07-10', value: 50 }] },
      { testId: 't5', latestScore: 6.8, benchmark: 7.2, percentile: 82, history: [{ date: '2024-05-20', value: 7.0 }, { date: '2024-07-10', value: 6.8 }] },
    ]
  },
  {
    id: 'athlete3',
    firstName: 'Aisha',
    lastName: 'Khan',
    dob: '2009-02-10',
    contact: 'aisha.khan@email.com',
    sport: Sport.BASKETBALL,
    role: UserRole.ATHLETE,
    roleInSport: 'Point Guard',
    age: 15,
    gender: Gender.FEMALE,
    results: [
      { testId: 't1', latestScore: 170065, benchmark: 0, percentile: 82, history: [{ date: '2024-07-20', value: 170065 }]},
      { testId: 't2', latestScore: 48, benchmark: 42, percentile: 88, history: [{ date: '2024-06-15', value: 46 }, { date: '2024-07-20', value: 48 }] },
      { testId: 't3', latestScore: 11.8, benchmark: 12.2, percentile: 72, history: [{ date: '2024-06-15', value: 12.0 }, { date: '2024-07-20', value: 11.8 }] },
      { testId: 't4', latestScore: 39, benchmark: 35, percentile: 80, history: [{ date: '2024-06-15', value: 36 }, { date: '2024-07-20', value: 39 }] },
      { testId: 't5', latestScore: 7.9, benchmark: 8.3, percentile: 68, history: [{ date: '2024-06-15', value: 8.1 }, { date: '2024-07-20', value: 7.9 }] },
    ]
  }
];

export const MOCK_COACH_USER: OfficialProfile = {
  id: 'coach1',
  firstName: 'Vikram',
  lastName: 'Singh',
  dob: '1985-03-22',
  contact: 'vikram.singh@email.com',
  sport: Sport.HOCKEY,
  role: UserRole.COACH,
  officialRole: OfficialRole.COACH,
  organization: 'Regional Sports Academy',
  age: 39,
  gender: Gender.MALE,
};

export const MOCK_OFFICIAL_USER: OfficialProfile = {
    id: 'official1',
    firstName: 'Anjali',
    lastName: 'Mehta',
    dob: '1980-09-12',
    contact: 'anjali.mehta@sai.gov.in',
    sport: Sport.ATHLETICS,
    role: UserRole.OFFICIAL,
    officialRole: OfficialRole.EVALUATOR,
    organization: 'Sports Authority of India',
    age: 43,
    gender: Gender.FEMALE,
};
