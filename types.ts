
export enum UserRole {
  ATHLETE = 'Athlete',
  COACH = 'Coach',
  OFFICIAL = 'Official',
}

export enum OfficialRole {
    COACH = 'Coach',
    EVALUATOR = 'Evaluator',
    ADMIN = 'Admin',
}

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other',
}

export enum Sport {
  ATHLETICS = 'Athletics',
  BASKETBALL = 'Basketball',
  CRICKET = 'Cricket',
  FOOTBALL = 'Football',
  HOCKEY = 'Hockey',
  WRESTLING = 'Wrestling',
}

export enum TestName {
  HEIGHT_WEIGHT = 'Height & Weight',
  VERTICAL_JUMP = 'Vertical Jump',
  SHUTTLE_RUN = '4x10m Shuttle Run',
  SIT_UPS = 'Sit-ups (1 min)',
  ENDURANCE_RUN = '1600m Run/Walk',
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  dob: string;
  contact: string; // Phone or Email
  sport: Sport;
  role: UserRole;
  age: number;
  gender: Gender;
  // Athlete specific
  roleInSport?: string;
  // Official/Coach specific
  organization?: string;
  officialRole?: OfficialRole;
}

export interface FitnessTest {
  id: string;
  name: TestName;
  description: string;
  videoUrl: string;
  unit: string;
}

export interface PerformanceRecord {
  date: string; // YYYY-MM-DD
  value: number;
}

export interface TestResult {
  testId: string;
  latestScore: number;
  benchmark: number; // Avg score for age/gender
  percentile: number;
  history: PerformanceRecord[];
}

export interface AthleteProfile extends User {
  results: TestResult[];
}

export interface OfficialProfile extends User {}
