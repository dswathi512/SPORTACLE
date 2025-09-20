

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
  VERTICAL_JUMP = 'vertical_jump',
  SHUTTLE_RUN = 'shuttle_run',
  SIT_UPS = 'sit_ups',
  ENDURANCE_RUN = 'endurance_run',
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
  language: Language;
  // Athlete specific
  roleInSport?: string;
  // Official/Coach specific
  organization?: string;
  officialRole?: OfficialRole;
}

export type Language = 'en' | 'hi' | 'ta' | 'te';

export interface TestInstructions {
  perform: string;
  record: string;
  assess: string;
}

export type LocalizedTestInstructions = Record<Language, TestInstructions>;

export interface FitnessTest {
  id: string;
  name: TestName;
  descriptionKey: string; // Short description for card (localization key)
  instructions: LocalizedTestInstructions; // Detailed instructions for modal
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

export interface HeightWeightData {
    height: number;
    heightUnit: 'cm' | 'ft';
    weight: number;
    weightUnit: 'kg' | 'lbs';
    // In a real app, these would be URLs to the stored videos
    heightVideoUrl: string;
    weightVideoUrl: string;
}


export interface AthleteProfile extends User {
  results: TestResult[];
  heightWeight?: HeightWeightData; // Can be undefined for initial creation
}

export interface OfficialProfile extends User {}