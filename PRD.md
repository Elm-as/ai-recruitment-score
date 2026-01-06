# Assistant IA de Recrutement / AI Recruitment Assistant

Un outil intelligent de recrutement qui analyse les profils des candidats par rapport aux postes à pourvoir, attribue des scores et classe les candidats, génère des questions d'entretien personnalisées et maintient un historique consultable de toutes les évaluations. **Support multilingue (Français/English) avec thème sombre/clair et téléchargement de fichiers PDF/HTML. Système d'authentification entreprise avec gestion des licences et des utilisateurs.**

**Qualités de l'Expérience** :
1. **Efficace** - Rationalise le processus d'examen des candidats en automatisant la notation et le classement, économisant des heures d'évaluation manuelle pour les recruteurs
2. **Perspicace** - Fournit une analyse approfondie des forces, faiblesses et adéquation de chaque candidat avec des informations exploitables
3. **Professionnel** - Maintient une interface polie et autoritaire qui reflète la nature sérieuse des décisions d'embauche
4. **Moderne** - Interface responsive avec animations fluides et support du thème sombre pour une expérience utilisateur optimale
5. **Sécurisé** - Système d'authentification robuste avec gestion des entreprises, utilisateurs et licences pour un usage B2B

**Niveau de Complexité** : Application Complexe (fonctionnalités avancées, avec plusieurs vues)
Cette application nécessite une intégration IA sophistiquée pour l'analyse des candidats, des workflows multi-étapes (publication de poste → soumission de candidat → notation → classement → préparation d'entretien), stockage persistant des données pour l'historique, génération de contenu dynamique basée sur les réponses IA, **support multilingue complet, système de thème dynamique, extraction de texte depuis fichiers PDF/HTML, et système d'authentification multi-tenant avec gestion des licences et des rôles utilisateurs**.

## Essential Features

### Company Authentication & Registration
- **Functionality**: Complete B2B authentication system with company registration, user management, and license validation. Companies can register with different license tiers (Trial, Starter, Professional, Enterprise), each with specific limits and features. Login validates both company and user credentials, checks license status, and tracks last login times.
- **Purpose**: Enables secure multi-tenant access, protects company data, and enforces license-based feature access for B2B SaaS model
- **Trigger**: User visits application without active session, clicks "Create company account", or needs to add team members
- **Progression**: Visit app → See login screen → Enter email → Validate credentials and license → Access app. Or: Click create account → Enter company details → Choose license plan → Enter admin user details → Validate domain matching → Create company and admin user → Auto-login → Access app
- **Success criteria**: Companies are isolated from each other, users can only access their company's data, license limits are enforced, expired licenses prevent login, team members can be added up to license limits

### License Management & Feature Gating
- **Functionality**: Four license tiers with progressive feature unlocking. Trial (14 days, 3 users, 5 positions, 50 candidates, limited features), Starter (€49/mo, 5 users, 20 positions, 200 candidates, bulk ops + email templates), Professional (€149/mo, 15 users, 100 positions, 1000 candidates, + advanced analytics), Enterprise (custom pricing, unlimited, all features including API access and custom branding). Real-time usage tracking shows current usage vs limits with progress bars.
- **Purpose**: Monetization model for B2B sales, clear upgrade path as companies grow, feature differentiation between tiers to encourage upgrades
- **Trigger**: User attempts to use premium feature, admin views company management tab, license approaches expiry
- **Progression**: Login → Check license status → Enable/disable features based on tier → Show usage stats → Warn when approaching limits → Prevent actions when limit reached → Show upgrade prompts
- **Success criteria**: Features are correctly gated based on license tier, usage limits are enforced (can't exceed max users/positions/candidates), expiration warnings appear 30 days before expiry, expired licenses prevent login, upgrade paths are clear

### User Role Management
- **Functionality**: Four user roles with different permissions. Owner (full access, can't be changed, created at registration), Admin (full access except license changes, can add/remove users), Recruiter (can create positions, add candidates, view analyses, generate questions), Viewer (read-only access, can view positions and candidates but not modify). Owner and Admin can add new users via company management interface.
- **Purpose**: Enables team collaboration with appropriate access controls, protects sensitive actions, allows delegation of recruitment tasks
- **Trigger**: Owner/Admin clicks "Add User" in company management, new team member needs access
- **Progression**: Click Add User → Enter name, email, select role → Validate email domain matches company → Check user limit → Create user account → User can login → Permissions enforced throughout app
- **Success criteria**: Role permissions are enforced in UI and data operations, users can't escalate their own permissions, company domain validation prevents external users, team list shows all members with roles

### Job Position Management
- **Functionality**: Create and manage job positions with title, description, requirements, and number of openings. Archive positions instead of deleting them to preserve history. Restore archived positions when needed.
- **Purpose**: Establishes the evaluation criteria against which all candidates will be assessed, while maintaining a complete history of all positions
- **Trigger**: User clicks "New Position" button for creation, Archive icon for archiving, or "View Archives" to see archived positions
- **Progression**: Click New Position → Enter job details (title, description, requirements, openings) → Save → Position appears in positions list. For archiving: Click Archive → Confirm → Position moved to archives with undo option
- **Success criteria**: Position is saved to persistent storage and can be selected for candidate evaluation. Archived positions are hidden from active view but can be restored with full data intact. Undo functionality available for 5 seconds after archiving or deleting

### Candidate Profile Submission
- **Functionality**: Input candidate information via text paste (simulating CV content extraction)
- **Purpose**: Capture candidate data for AI analysis without requiring file upload infrastructure
- **Trigger**: User selects a position and clicks "Add Candidate"
- **Progression**: Select position → Click Add Candidate → Paste candidate info (name, experience, skills, education) → Submit → AI analyzes candidate
- **Success criteria**: Candidate profile is parsed, analyzed by AI, scored, and stored with the position

### AI-Powered Candidate Scoring
- **Functionality**: Automatically scores each candidate (0-100) based on job requirements using AI analysis
- **Purpose**: Provides objective, consistent evaluation of candidate fit
- **Trigger**: Candidate profile is submitted
- **Progression**: Candidate submitted → AI analyzes against job requirements → Generates score with detailed breakdown → Displays strengths/weaknesses → Stores results
- **Success criteria**: Each candidate receives a numerical score with justification showing requirement matches

### Intelligent Candidate Ranking
- **Functionality**: Displays all candidates for a position sorted by score (highest to lowest). Supports bulk selection and deletion of multiple candidates at once with checkboxes. Individual candidate deletion also available.
- **Purpose**: Enables quick identification of top candidates and efficient management of candidate lists
- **Trigger**: User views a position with candidates
- **Progression**: Open position → View ranked candidate list → See scores and highlights → Filter by status (all/top picks/rejected) → Select multiple candidates with checkboxes → Bulk delete or manage individually. Undo available for 5 seconds after any deletion.
- **Success criteria**: Candidates appear in descending score order with visual indicators for top performers. Bulk operations complete successfully with undo functionality preserving all deleted data

### Interview Question Generation
- **Functionality**: AI generates tailored technical interview questions for each candidate based on their profile and the position. Questions focus exclusively on technical skills, technical knowledge, technical problem-solving, and technical experience verification. No behavioral, social, or soft skills questions. Recruiters can record candidate answers, get AI scoring of those answers for technical depth and accuracy, and generate follow-up technical questions based on responses to probe deeper into technical capabilities.
- **Purpose**: Prepares recruiters with relevant, personalized technical questions to assess candidate's technical capabilities, provides objective AI evaluation of answer quality, then enables deeper technical exploration based on candidate responses
- **Trigger**: User clicks "Generate Questions" on a candidate card, then "Answer" on any question, then "Score Answer" to get AI evaluation, then "Generate Follow-up Questions" after saving an answer
- **Progression**: View candidate → Click Generate Questions → AI creates 6-8 targeted technical questions → Questions appear → Click "Answer" on a question → Enter candidate's response → Save answer → Click "Score Answer" → AI evaluates answer for technical depth, accuracy, and completeness → Scoring results display with feedback → Click "Generate Follow-up Questions" → AI analyzes the answer and creates 3-5 deeper technical follow-up questions → Follow-up questions appear nested under original question → Can edit answers, rescore, and regenerate follow-ups if needed
- **Success criteria**: Initial questions are specific to the candidate's technical background and address technical gaps or areas needing technical clarification. All questions must be technical in nature. AI scoring provides objective metrics (0-100) for technical depth, accuracy, and completeness with detailed feedback, strengths, and improvement areas. Follow-up questions probe deeper into technical details based on the candidate's answer, testing understanding beyond surface-level knowledge and exploring technical edge cases or implementation details.

### Email Template Generation
- **Functionality**: AI generates professional email templates with candidate evaluation results for sharing with hiring managers. Supports three email types: shortlist summaries (with scores and data points for hiring managers), interview invitations (to candidates), and professional rejection emails (to candidates). Users can select multiple candidates, customize instructions, and generate all emails at once. Templates include AI scores, assessment summaries, interview performance data, and key insights.
- **Purpose**: Streamlines communication with hiring managers and candidates by automatically creating well-formatted, professional emails that include all relevant evaluation data, saving time and ensuring consistency in recruitment communications
- **Trigger**: User clicks "Emails" button in position detail view
- **Progression**: Click Emails → Select candidates from list (or use "Top N" quick-select) → Choose email type (shortlist/interview/rejection) → Optionally add custom instructions → Click Generate Emails → AI creates personalized emails for each selected candidate including their scores, strengths, interview performance → Preview emails → Copy individual emails to clipboard → Paste into email client
- **Success criteria**: Generated emails are professional, include accurate candidate data (scores, assessments, interview results), follow appropriate tone for email type, support both French and English, and can be easily copied to clipboard. Shortlist emails provide data-driven summaries for hiring managers with bullet points and metrics. Interview invitations are welcoming and clear. Rejection emails are respectful and encouraging.

### Alternative Position Suggestions
- **Functionality**: For good candidates who don't fit the current role, AI suggests other open positions that may suit them better
- **Purpose**: Avoids losing quality candidates by redirecting them to more suitable opportunities
- **Trigger**: Candidate scores above threshold but below top picks cutoff
- **Progression**: Candidate evaluated → AI detects alternative fit → Suggests other positions with rationale → Recruiter can reassign candidate
- **Success criteria**: System identifies at least one alternative position when appropriate with clear reasoning

### Historical Evaluation Archive
- **Functionality**: Maintains searchable history of all positions (active, archived, and closed), candidates, and evaluations
- **Purpose**: Enables review of past decisions, retrieval of candidate information, analytics, and restoration of archived positions
- **Trigger**: User navigates to "History" section or clicks "View Archives" in Positions view
- **Progression**: Click History → View all past positions with status badges → Search/filter by date, position, candidate name → View detailed evaluation → Access archived interview questions → Restore archived positions if needed
- **Success criteria**: All evaluations persist indefinitely and are searchable with full detail retrieval. Archived positions clearly marked and can be restored to active status with undo support

## Edge Case Handling

- **Empty candidate data**: Display helpful prompt with example format if submission is too brief
- **No positions created**: Show onboarding message guiding user to create first position
- **AI analysis failure**: Show error message and allow retry without losing entered data
- **Duplicate candidates**: Warn user if candidate name already exists for position and confirm before proceeding
- **No alternative positions**: Gracefully handle case when no other positions exist or none are suitable
- **Very long candidate profiles**: Truncate display while keeping full text for AI analysis
- **Very long candidate answers**: Support multiline text input for detailed technical responses
- **Answer scoring in progress**: Disable score button while AI is evaluating to prevent duplicate requests
- **Missing answer for scoring**: Only show score button when a valid answer exists for that question
- **Score regeneration**: Allow users to rescore answers if candidate provides additional information or edits response
- **Follow-up generation without answer**: Disable follow-up generation button until an answer is saved for that question
- **Empty answer submission**: Disable save button when answer field is empty to prevent blank submissions
- **Position with no candidates**: Display empty state with call-to-action to add first candidate
- **Accidental deletion**: Provide 5-second undo window via toast notification for all delete and archive operations
- **Bulk deletion with no selection**: Disable bulk delete button when no candidates are selected
- **Archived position access**: Archived positions remain viewable and their candidates accessible, but hidden from active positions list
- **Undo after navigation**: Undo functionality persists even if user navigates to different views within the 5-second window
- **No candidates for email**: Display helpful message when trying to generate emails with no candidates
- **Email generation failure**: Show error message and preserve selections if AI email generation fails
- **Empty custom instructions**: Email generation works with or without custom instructions
- **Single candidate email**: Support generating emails for just one candidate
- **Large candidate selection**: Handle generating emails for many candidates with progress indication

## Design Direction

The design should evoke professionalism, trust, and intelligence - like a sophisticated HR platform used by Fortune 500 companies. The interface should feel modern and data-driven, with clear visual hierarchy that guides users through the evaluation workflow. The aesthetic should balance approachability (not intimidating to use) with authority (this is making important hiring decisions).

## Color Selection

A professional, corporate palette with intelligent accent colors to convey both trust and technological sophistication.

- **Primary Color**: Deep Navy Blue (oklch(0.35 0.08 250)) - Conveys professionalism, trust, and corporate authority
- **Secondary Colors**: 
  - Slate Gray (oklch(0.65 0.02 250)) - For supporting UI elements and less prominent actions
  - Cool White (oklch(0.98 0.01 250)) - Clean background that maintains the cool, professional tone
- **Accent Color**: Vibrant Teal (oklch(0.65 0.15 195)) - Modern, intelligent feel for CTAs, highlights, and success states. Represents innovation and technology without being overly playful
- **Foreground/Background Pairings**: 
  - Primary Navy (oklch(0.35 0.08 250)): White text (oklch(0.98 0.01 250)) - Ratio 8.2:1 ✓
  - Accent Teal (oklch(0.65 0.15 195)): Navy text (oklch(0.25 0.08 250)) - Ratio 5.1:1 ✓
  - Background Cool White (oklch(0.98 0.01 250)): Navy text (oklch(0.25 0.08 250)) - Ratio 12.4:1 ✓
  - Muted Slate (oklch(0.92 0.01 250)): Slate Gray text (oklch(0.45 0.02 250)) - Ratio 7.1:1 ✓

## Font Selection

Typography should communicate both authority and modern sophistication - clear enough for data-heavy interfaces while maintaining personality.

- **Primary Font**: Instrument Sans - A contemporary geometric sans-serif that feels professional yet approachable, excellent for UI elements and body text
- **Display Font**: Sora - Bold, distinctive headings that add character without sacrificing readability

- **Typographic Hierarchy**:
  - H1 (Page Titles): Sora Bold/32px/tight letter spacing (-0.02em)
  - H2 (Section Headers): Sora SemiBold/24px/normal letter spacing
  - H3 (Card Titles): Instrument Sans SemiBold/18px/normal letter spacing  
  - Body (Content): Instrument Sans Regular/15px/relaxed line height (1.6)
  - Small (Metadata): Instrument Sans Regular/13px/muted color
  - Button Text: Instrument Sans Medium/14px/slight letter spacing (0.01em)

## Animations

Animations should reinforce the intelligent, responsive nature of the AI system while maintaining professionalism. Use motion to guide attention during AI processing and provide feedback for user actions.

Motion should be purposeful: smooth transitions when switching between positions (300ms ease-out), subtle scale on hover for interactive cards (1.02x), loading states with elegant pulse animations during AI analysis, and satisfying slide-in animations for newly scored candidates. Avoid anything bouncy or playful - keep easing curves smooth and sophisticated.

## Component Selection

- **Components**:
  - **Card**: Primary container for positions and candidate profiles with hover states
  - **Dialog**: For creating new positions and adding candidates with multi-step forms
  - **Button**: Primary actions (analyze, generate questions) and secondary actions (view details)
  - **Badge**: Display scores, status indicators (top pick, consider, rejected), and skill tags
  - **Tabs**: Switch between active positions, history, and analytics views
  - **Accordion**: Expand/collapse candidate details and interview questions
  - **Progress**: Show AI analysis progress during candidate evaluation
  - **Input/Textarea**: Form fields for position and candidate data entry
  - **Select**: Choose position when adding candidates or filtering history
  - **Separator**: Visually divide sections within candidate cards
  - **ScrollArea**: Handle long lists of candidates and history entries

- **Customizations**:
  - Custom score display component with circular progress indicator showing 0-100 score
  - Custom ranking list with numbered badges and visual tier indicators (gold/silver/bronze for top 3)
  - Custom comparison view to see multiple candidates side-by-side
  - AI thinking indicator with animated gradient during analysis

- **States**:
  - Buttons: Default, hover (slight scale + shadow), active (pressed inset), disabled (muted), loading (spinner)
  - Cards: Default (subtle border), hover (elevated shadow, border glow), selected (accent border)
  - Inputs: Default, focused (accent ring), error (destructive ring), success (teal ring)
  - Candidates: Pending analysis, analyzing (animated), scored, selected for interview, rejected

- **Icon Selection**:
  - BriefcaseBusiness: Job positions
  - User/Users: Candidates
  - SparklesIcon: AI analysis and generation features
  - TrendingUp: Ranking and scores
  - MessageSquare: Interview questions
  - ClockCounterClockwise: History
  - Funnel: Filtering
  - Plus: Add new items
  - Check/X: Accept/reject actions
  - ArrowsLeftRight: Compare candidates

- **Spacing**:
  - Container padding: p-6 (24px) for main content areas
  - Card padding: p-4 (16px) for compact cards, p-6 for detailed views
  - Section gaps: gap-6 (24px) between major sections
  - List gaps: gap-3 (12px) between list items
  - Inline gaps: gap-2 (8px) for buttons groups and badges
  - Page margins: max-w-7xl mx-auto for content containment

- **Mobile**:
  - Stack position cards vertically instead of grid on mobile
  - Convert side-by-side candidate comparison to swipeable carousel
  - Collapse detailed scoring breakdown into expandable sections
  - Bottom sheet dialog for adding candidates instead of centered modal
  - Sticky header with condensed navigation on scroll
  - Reduce padding to p-4 on container edges for mobile screens
  - Single column layout for all content below 768px breakpoint
