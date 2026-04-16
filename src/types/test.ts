export interface QuestionOption {
  value: string
  label: string
}

export interface Question {
  id: string
  text: string
  options: QuestionOption[]
}

export type TestAnswers = Record<string, string>

export interface TestSession {
  answers: TestAnswers
  currentStep: number
  startedAt: string
}

export const STORAGE_KEY = "kraak_anonymous_session"
