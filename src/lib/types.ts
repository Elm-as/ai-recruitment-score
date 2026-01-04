export interface Position {
  id: string
  title: string
  description: string
  requirements: string
  openings: number
  createdAt: number
  status: 'active' | 'closed' | 'archived'
  archivedAt?: number
}

export interface Candidate {
  id: string
  positionId: string
  name: string
  email: string
  profileText: string
  fileName?: string
  fileType?: 'pdf' | 'html'
  score: number
  scoreBreakdown: {
    category: string
    score: number
    reasoning: string
  }[]
  strengths: string[]
  weaknesses: string[]
  overallAssessment: string
  interviewQuestions?: string[]
  questionAnswers?: {
    questionIndex: number
    question: string
    answer: string
    answeredAt: number
    aiScore?: {
      technicalDepth: number
      accuracy: number
      completeness: number
      overallScore: number
      feedback: string
      strengths: string[]
      improvements: string[]
      scoredAt: number
    }
  }[]
  followUpQuestions?: {
    originalQuestionIndex: number
    originalQuestion: string
    originalAnswer: string
    followUpQuestions: string[]
    generatedAt: number
  }[]
  alternativePositions?: {
    positionId: string
    positionTitle: string
    reasoning: string
  }[]
  status: 'pending' | 'analyzing' | 'scored' | 'selected' | 'rejected'
  createdAt: number
  analyzedAt?: number
  customOrder?: number
}

export interface PositionWithCandidates extends Position {
  candidates: Candidate[]
}

export interface OrderingPreset {
  id: string
  positionId: string
  name: string
  candidateOrder: string[]
  createdAt: number
  updatedAt: number
}

export type Language = 'fr' | 'en'
