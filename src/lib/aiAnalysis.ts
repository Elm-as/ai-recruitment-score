import { Position, Candidate, Language } from '@/lib/types'

interface AnalysisResult {
  score: number
  scoreBreakdown: Array<{
    category: string
    score: number
    reasoning: string
  }>
  strengths: string[]
  weaknesses: string[]
  overallAssessment: string
}

interface AlternativePosition {
  positionId: string
  positionTitle: string
  reasoning: string
}

export async function analyzeCandidateWithAI(
  candidate: Candidate,
  position: Position,
  language: Language
): Promise<AnalysisResult> {
  const isEnglish = language === 'en'
  const targetLang = isEnglish ? 'ENGLISH' : 'FRENCH'
  
  const positionSummary = `${position.title}\nRequirements: ${position.requirements.substring(0, 600)}`
  
  const analysisPrompt = (window as any).spark.llmPrompt`You are an expert HR recruiter with deep experience in talent assessment. Analyze this candidate against the job position requirements with precision and insight. Respond ONLY in ${targetLang}.

JOB POSITION:
${positionSummary}

CANDIDATE PROFILE:
Name: ${candidate.name}
Email: ${candidate.email}

${candidate.profileText}

ANALYSIS INSTRUCTIONS:
1. Evaluate the candidate across 5 key categories with precise scores (0-100)
2. For each category, provide specific reasoning based on evidence from the profile
3. Identify 4-6 concrete strengths that directly match the position requirements
4. Identify 3-5 specific areas for improvement or concerns
5. Provide a comprehensive overall assessment (2-3 sentences) that balances strengths and weaknesses

SCORING GUIDELINES:
- 90-100: Exceptional fit, exceeds all requirements
- 80-89: Strong fit, meets all key requirements with some standout qualities
- 70-79: Good fit, meets most requirements with minor gaps
- 60-69: Adequate fit, meets basic requirements but has notable gaps
- 50-59: Marginal fit, meets some requirements but significant concerns
- Below 50: Poor fit, does not meet core requirements

Return ONLY valid JSON in this exact format (all text in ${targetLang}):
{
  "score": <number 0-100>,
  "scoreBreakdown": [
    {"category": "Technical Skills", "score": <0-100>, "reasoning": "<specific evidence from profile>"},
    {"category": "Professional Experience", "score": <0-100>, "reasoning": "<specific evidence from profile>"},
    {"category": "Education & Certifications", "score": <0-100>, "reasoning": "<specific evidence from profile>"},
    {"category": "Cultural Fit & Soft Skills", "score": <0-100>, "reasoning": "<specific evidence from profile>"},
    {"category": "Career Trajectory & Growth", "score": <0-100>, "reasoning": "<specific evidence from profile>"}
  ],
  "strengths": ["<concrete strength 1>", "<concrete strength 2>", "<concrete strength 3>", "<concrete strength 4>"],
  "weaknesses": ["<specific concern 1>", "<specific concern 2>", "<specific concern 3>"],
  "overallAssessment": "<comprehensive 2-3 sentence assessment balancing all factors>"
}`

  try {
    const analysisResult = await (window as any).spark.llm(analysisPrompt, 'gpt-4o', true)
    const analysis = JSON.parse(analysisResult)

    if (!analysis.score || !analysis.scoreBreakdown || !Array.isArray(analysis.strengths) || !Array.isArray(analysis.weaknesses)) {
      throw new Error('Invalid analysis response structure')
    }

    return analysis
  } catch (error) {
    console.error('AI Analysis error:', error)
    throw new Error(`Failed to analyze candidate: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function findAlternativePositions(
  candidate: Candidate,
  currentPosition: Position,
  otherPositions: Position[],
  currentScore: number,
  language: Language
): Promise<AlternativePosition[] | undefined> {
  if (otherPositions.length === 0 || currentScore >= 75 || currentScore < 40) {
    return undefined
  }

  const isEnglish = language === 'en'
  const targetLang = isEnglish ? 'ENGLISH' : 'FRENCH'
  
  const otherPositionsSummary = otherPositions
    .slice(0, 6)
    .map((p) => `- ${p.title}: ${p.requirements.substring(0, 250)}`)
    .join('\n')
  
  const candidateSkillsSummary = candidate.profileText.substring(0, 1200)
  
  const alternativesPrompt = (window as any).spark.llmPrompt`The candidate scored ${currentScore}/100 for "${currentPosition.title}". Analyze if they might be a significantly better fit for other open positions. Respond in ${targetLang}.

CANDIDATE KEY QUALIFICATIONS:
${candidateSkillsSummary}

OTHER OPEN POSITIONS:
${otherPositionsSummary}

EVALUATION CRITERIA:
- Only suggest positions where the candidate would likely score at least 15 points higher
- Focus on matching core skills and experience, not just keywords
- Consider career trajectory and growth potential
- Be selective - quality over quantity

Return ONLY valid JSON in this format (text in ${targetLang}):
{
  "alternatives": [
    {
      "positionTitle": "<exact position title from list above>",
      "estimatedScore": <realistic number 0-100>,
      "reasoning": "<specific reasons why this position is a significantly better fit>"
    }
  ]
}

If no positions offer a significantly better match (15+ points higher), return an empty array.`

  try {
    const alternativesResult = await (window as any).spark.llm(alternativesPrompt, 'gpt-4o-mini', true)
    const alternativesData = JSON.parse(alternativesResult)
    
    if (!alternativesData.alternatives || !Array.isArray(alternativesData.alternatives)) {
      return undefined
    }

    if (alternativesData.alternatives.length === 0) {
      return undefined
    }

    const matchedAlternatives = alternativesData.alternatives
      .map((alt: any) => {
        const pos = otherPositions.find(
          (p) => p.title === alt.positionTitle || 
                 p.title.toLowerCase().includes(alt.positionTitle.toLowerCase()) ||
                 alt.positionTitle.toLowerCase().includes(p.title.toLowerCase())
        )
        
        if (!pos) return null
        
        return {
          positionId: pos.id,
          positionTitle: pos.title,
          reasoning: alt.reasoning,
        }
      })
      .filter((alt: any) => alt !== null)

    return matchedAlternatives.length > 0 ? matchedAlternatives : undefined
  } catch (error) {
    console.error('Alternative positions analysis error (non-critical):', error)
    return undefined
  }
}

export function estimateTokenCount(text: string): number {
  const words = text.split(/\s+/).length
  return Math.ceil(words * 1.3)
}

export function validateAnalysisInput(
  name: string,
  email: string,
  profileText: string
): { valid: boolean; error?: string } {
  if (!name.trim()) {
    return { valid: false, error: 'Name is required' }
  }
  
  if (!email.trim() || !email.includes('@')) {
    return { valid: false, error: 'Valid email is required' }
  }
  
  if (!profileText.trim()) {
    return { valid: false, error: 'Profile text is required' }
  }
  
  if (profileText.trim().length < 50) {
    return { valid: false, error: 'Profile text is too short (minimum 50 characters)' }
  }
  
  const tokenEstimate = estimateTokenCount(profileText)
  if (tokenEstimate > 6000) {
    return { valid: false, error: 'Profile text is too long and will be optimized automatically' }
  }
  
  return { valid: true }
}
