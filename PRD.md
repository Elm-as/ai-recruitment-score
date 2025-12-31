# AI Recruitment Assistant

An intelligent recruitment tool that analyzes candidate profiles against job positions, scores and ranks applicants, generates tailored interview questions, and maintains a searchable history of all evaluations.

**Experience Qualities**:
1. **Efficient** - Streamlines the candidate review process by automating scoring and ranking, saving recruiters hours of manual evaluation
2. **Insightful** - Provides deep analysis of each candidate's strengths, weaknesses, and fit for the position with actionable intelligence
3. **Professional** - Maintains a polished, authoritative interface that reflects the serious nature of hiring decisions

**Complexity Level**: Complex Application (advanced functionality, likely with multiple views)
This application requires sophisticated AI integration for candidate analysis, multi-step workflows (job posting → candidate submission → scoring → ranking → interview prep), persistent data storage for history, and dynamic content generation based on AI responses.

## Essential Features

### Job Position Management
- **Functionality**: Create and manage job positions with title, description, requirements, and number of openings
- **Purpose**: Establishes the evaluation criteria against which all candidates will be assessed
- **Trigger**: User clicks "New Position" button
- **Progression**: Click New Position → Enter job details (title, description, requirements, openings) → Save → Position appears in positions list
- **Success criteria**: Position is saved to persistent storage and can be selected for candidate evaluation

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
- **Functionality**: Displays all candidates for a position sorted by score (highest to lowest)
- **Purpose**: Enables quick identification of top candidates
- **Trigger**: User views a position with candidates
- **Progression**: Open position → View ranked candidate list → See scores and highlights → Filter by status (all/top picks/rejected)
- **Success criteria**: Candidates appear in descending score order with visual indicators for top performers

### Interview Question Generation
- **Functionality**: AI generates tailored interview questions for each candidate based on their profile and the position
- **Purpose**: Prepares recruiters with relevant, personalized questions to assess candidate fit
- **Trigger**: User clicks "Generate Questions" on a candidate card
- **Progression**: View candidate → Click Generate Questions → AI creates 5-8 targeted questions → Questions appear with rationale → Can regenerate if needed
- **Success criteria**: Questions are specific to the candidate's background and address gaps or areas needing clarification

### Alternative Position Suggestions
- **Functionality**: For good candidates who don't fit the current role, AI suggests other open positions that may suit them better
- **Purpose**: Avoids losing quality candidates by redirecting them to more suitable opportunities
- **Trigger**: Candidate scores above threshold but below top picks cutoff
- **Progression**: Candidate evaluated → AI detects alternative fit → Suggests other positions with rationale → Recruiter can reassign candidate
- **Success criteria**: System identifies at least one alternative position when appropriate with clear reasoning

### Historical Evaluation Archive
- **Functionality**: Maintains searchable history of all positions, candidates, and evaluations
- **Purpose**: Enables review of past decisions, retrieval of candidate information, and analytics
- **Trigger**: User navigates to "History" section
- **Progression**: Click History → View all past positions → Search/filter by date, position, candidate name → View detailed evaluation → Access archived interview questions
- **Success criteria**: All evaluations persist indefinitely and are searchable with full detail retrieval

## Edge Case Handling

- **Empty candidate data**: Display helpful prompt with example format if submission is too brief
- **No positions created**: Show onboarding message guiding user to create first position
- **AI analysis failure**: Show error message and allow retry without losing entered data
- **Duplicate candidates**: Warn user if candidate name already exists for position and confirm before proceeding
- **No alternative positions**: Gracefully handle case when no other positions exist or none are suitable
- **Very long candidate profiles**: Truncate display while keeping full text for AI analysis
- **Position with no candidates**: Display empty state with call-to-action to add first candidate

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
