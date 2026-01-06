import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Candidate, Position, Language } from './types'
import { t } from './translations'

export const generateCandidatePDF = (
  candidate: Candidate,
  position: Position,
  language: Language
) => {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  let yPosition = 20

  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text(language === 'fr' ? 'Rapport d\'Évaluation du Candidat' : 'Candidate Evaluation Report', pageWidth / 2, yPosition, { align: 'center' })
  
  yPosition += 15
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`${language === 'fr' ? 'Généré le' : 'Generated on'}: ${new Date().toLocaleDateString(language)}`, pageWidth / 2, yPosition, { align: 'center' })
  
  yPosition += 15
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text(language === 'fr' ? 'Informations du Candidat' : 'Candidate Information', 14, yPosition)
  
  yPosition += 10
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.text(`${language === 'fr' ? 'Nom' : 'Name'}: ${candidate.name}`, 14, yPosition)
  yPosition += 7
  doc.text(`Email: ${candidate.email}`, 14, yPosition)
  yPosition += 7
  doc.text(`${language === 'fr' ? 'Poste' : 'Position'}: ${position.title}`, 14, yPosition)
  yPosition += 7
  doc.text(`${language === 'fr' ? 'Score Global' : 'Overall Score'}: ${candidate.score}/100`, 14, yPosition)
  yPosition += 7
  doc.text(`${language === 'fr' ? 'Statut' : 'Status'}: ${candidate.status}`, 14, yPosition)
  
  yPosition += 15
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text(language === 'fr' ? 'Détails des Scores' : 'Score Breakdown', 14, yPosition)
  
  yPosition += 5
  const scoreData = candidate.scoreBreakdown.map(item => [
    item.category,
    `${item.score}/100`,
    item.reasoning
  ])
  
  autoTable(doc, {
    startY: yPosition,
    head: [[
      language === 'fr' ? 'Catégorie' : 'Category',
      'Score',
      language === 'fr' ? 'Raisonnement' : 'Reasoning'
    ]],
    body: scoreData,
    theme: 'grid',
    headStyles: { fillColor: [69, 69, 171] },
    columnStyles: {
      0: { cellWidth: 40 },
      1: { cellWidth: 25 },
      2: { cellWidth: 'auto' }
    }
  })
  
  yPosition = (doc as any).lastAutoTable.finalY + 15
  
  if (yPosition > 250) {
    doc.addPage()
    yPosition = 20
  }
  
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text(language === 'fr' ? 'Forces' : 'Strengths', 14, yPosition)
  
  yPosition += 7
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  candidate.strengths.forEach((strength, index) => {
    const lines = doc.splitTextToSize(`${index + 1}. ${strength}`, pageWidth - 28)
    if (yPosition + (lines.length * 7) > 280) {
      doc.addPage()
      yPosition = 20
    }
    doc.text(lines, 14, yPosition)
    yPosition += lines.length * 7
  })
  
  yPosition += 8
  if (yPosition > 250) {
    doc.addPage()
    yPosition = 20
  }
  
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text(language === 'fr' ? 'Faiblesses' : 'Weaknesses', 14, yPosition)
  
  yPosition += 7
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  candidate.weaknesses.forEach((weakness, index) => {
    const lines = doc.splitTextToSize(`${index + 1}. ${weakness}`, pageWidth - 28)
    if (yPosition + (lines.length * 7) > 280) {
      doc.addPage()
      yPosition = 20
    }
    doc.text(lines, 14, yPosition)
    yPosition += lines.length * 7
  })
  
  yPosition += 8
  if (yPosition > 250) {
    doc.addPage()
    yPosition = 20
  }
  
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text(language === 'fr' ? 'Évaluation Globale' : 'Overall Assessment', 14, yPosition)
  
  yPosition += 7
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  const assessmentLines = doc.splitTextToSize(candidate.overallAssessment, pageWidth - 28)
  assessmentLines.forEach((line: string) => {
    if (yPosition > 280) {
      doc.addPage()
      yPosition = 20
    }
    doc.text(line, 14, yPosition)
    yPosition += 7
  })
  
  if (candidate.questionAnswers && candidate.questionAnswers.length > 0) {
    doc.addPage()
    yPosition = 20
    
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text(language === 'fr' ? 'Questions et Réponses' : 'Questions & Answers', 14, yPosition)
    
    yPosition += 10
    candidate.questionAnswers.forEach((qa, index) => {
      if (yPosition > 250) {
        doc.addPage()
        yPosition = 20
      }
      
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      const questionLines = doc.splitTextToSize(`Q${index + 1}: ${qa.question}`, pageWidth - 28)
      doc.text(questionLines, 14, yPosition)
      yPosition += questionLines.length * 7
      
      doc.setFontSize(11)
      doc.setFont('helvetica', 'normal')
      const answerLines = doc.splitTextToSize(`A: ${qa.answer}`, pageWidth - 28)
      doc.text(answerLines, 14, yPosition)
      yPosition += answerLines.length * 7
      
      if (qa.aiScore) {
        yPosition += 3
        doc.setFontSize(10)
        doc.setFont('helvetica', 'italic')
        doc.text(`${language === 'fr' ? 'Score IA' : 'AI Score'}: ${qa.aiScore.overallScore}/100`, 14, yPosition)
        yPosition += 5
        const feedbackLines = doc.splitTextToSize(qa.aiScore.feedback, pageWidth - 28)
        doc.text(feedbackLines, 14, yPosition)
        yPosition += feedbackLines.length * 5
      }
      
      yPosition += 8
    })
  }
  
  const fileName = `${candidate.name.replace(/\s+/g, '_')}_${position.title.replace(/\s+/g, '_')}_${Date.now()}.pdf`
  doc.save(fileName)
}

export const generatePositionReportPDF = (
  position: Position,
  candidates: Candidate[],
  language: Language
) => {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  let yPosition = 20

  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text(language === 'fr' ? 'Rapport du Poste' : 'Position Report', pageWidth / 2, yPosition, { align: 'center' })
  
  yPosition += 15
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`${language === 'fr' ? 'Généré le' : 'Generated on'}: ${new Date().toLocaleDateString(language)}`, pageWidth / 2, yPosition, { align: 'center' })
  
  yPosition += 15
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text(language === 'fr' ? 'Informations du Poste' : 'Position Information', 14, yPosition)
  
  yPosition += 10
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.text(`${language === 'fr' ? 'Titre' : 'Title'}: ${position.title}`, 14, yPosition)
  yPosition += 7
  doc.text(`${language === 'fr' ? 'Nombre d\'ouvertures' : 'Openings'}: ${position.openings}`, 14, yPosition)
  yPosition += 7
  doc.text(`${language === 'fr' ? 'Candidats' : 'Candidates'}: ${candidates.length}`, 14, yPosition)
  yPosition += 7
  doc.text(`${language === 'fr' ? 'Statut' : 'Status'}: ${position.status}`, 14, yPosition)
  
  yPosition += 15
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text(language === 'fr' ? 'Classement des Candidats' : 'Candidate Rankings', 14, yPosition)
  
  yPosition += 5
  const sortedCandidates = [...candidates].sort((a, b) => b.score - a.score)
  const candidateData = sortedCandidates.map((c, index) => [
    `${index + 1}`,
    c.name,
    c.email,
    `${c.score}/100`,
    c.status
  ])
  
  autoTable(doc, {
    startY: yPosition,
    head: [[
      language === 'fr' ? 'Rang' : 'Rank',
      language === 'fr' ? 'Nom' : 'Name',
      'Email',
      'Score',
      language === 'fr' ? 'Statut' : 'Status'
    ]],
    body: candidateData,
    theme: 'grid',
    headStyles: { fillColor: [69, 69, 171] },
    columnStyles: {
      0: { cellWidth: 15 },
      1: { cellWidth: 45 },
      2: { cellWidth: 55 },
      3: { cellWidth: 25 },
      4: { cellWidth: 30 }
    }
  })
  
  yPosition = (doc as any).lastAutoTable.finalY + 15
  
  if (yPosition > 250) {
    doc.addPage()
    yPosition = 20
  }
  
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text(language === 'fr' ? 'Statistiques' : 'Statistics', 14, yPosition)
  
  yPosition += 10
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  
  const averageScore = candidates.length > 0
    ? (candidates.reduce((sum, c) => sum + c.score, 0) / candidates.length).toFixed(1)
    : '0'
  
  doc.text(`${language === 'fr' ? 'Score moyen' : 'Average score'}: ${averageScore}/100`, 14, yPosition)
  yPosition += 7
  
  const topScore = candidates.length > 0 ? Math.max(...candidates.map(c => c.score)) : 0
  doc.text(`${language === 'fr' ? 'Score le plus élevé' : 'Highest score'}: ${topScore}/100`, 14, yPosition)
  yPosition += 7
  
  const scoredCount = candidates.filter(c => c.status !== 'pending').length
  doc.text(`${language === 'fr' ? 'Candidats évalués' : 'Scored candidates'}: ${scoredCount}/${candidates.length}`, 14, yPosition)
  
  const fileName = `${position.title.replace(/\s+/g, '_')}_Report_${Date.now()}.pdf`
  doc.save(fileName)
}

export const generateComparisonPDF = (
  candidates: Candidate[],
  position: Position,
  language: Language
) => {
  const doc = new jsPDF('landscape')
  const pageWidth = doc.internal.pageSize.getWidth()
  let yPosition = 20

  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text(language === 'fr' ? 'Comparaison des Candidats' : 'Candidate Comparison', pageWidth / 2, yPosition, { align: 'center' })
  
  yPosition += 15
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`${language === 'fr' ? 'Poste' : 'Position'}: ${position.title}`, pageWidth / 2, yPosition, { align: 'center' })
  
  yPosition += 10
  const sortedCandidates = [...candidates].sort((a, b) => b.score - a.score)
  
  const comparisonData = sortedCandidates.map((c, index) => [
    `${index + 1}`,
    c.name,
    `${c.score}/100`,
    c.strengths.slice(0, 2).join('; '),
    c.weaknesses.slice(0, 2).join('; '),
    c.status
  ])
  
  autoTable(doc, {
    startY: yPosition,
    head: [[
      language === 'fr' ? 'Rang' : 'Rank',
      language === 'fr' ? 'Nom' : 'Name',
      'Score',
      language === 'fr' ? 'Forces Principales' : 'Key Strengths',
      language === 'fr' ? 'Faiblesses Principales' : 'Key Weaknesses',
      language === 'fr' ? 'Statut' : 'Status'
    ]],
    body: comparisonData,
    theme: 'grid',
    headStyles: { fillColor: [69, 69, 171] },
    columnStyles: {
      0: { cellWidth: 15 },
      1: { cellWidth: 40 },
      2: { cellWidth: 25 },
      3: { cellWidth: 80 },
      4: { cellWidth: 80 },
      5: { cellWidth: 30 }
    }
  })
  
  const fileName = `Comparison_${position.title.replace(/\s+/g, '_')}_${Date.now()}.pdf`
  doc.save(fileName)
}
