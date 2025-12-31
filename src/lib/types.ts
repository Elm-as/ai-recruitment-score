export interface Position {
  id: string
  title: string
  description: string
  requirements: string
  openings: number
  createdAt: number
  status: 'active' | 'closed'
}

export interface Candidate {
  id: string
  positionId: string
  name: string
  email: string
  profileText: string
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
  alternativePositions?: {
    positionId: string
    positionTitle: string
    reasoning: string
  }[]
  status: 'pending' | 'analyzing' | 'scored' | 'selected' | 'rejected'
  createdAt: number
  analyzedAt?: number
}

export interface PositionWithCandidates extends Position {
  candidates: Candidate[]
}
