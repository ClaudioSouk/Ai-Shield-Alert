
# AI Shield Alert - Technical Documentation

This document provides a detailed technical overview of the AI Shield Alert system, explaining the architecture, components, data flow, and implementation details.

## System Architecture

AI Shield Alert uses a modern web architecture combining React for the frontend with Supabase for backend services, authentication, and database storage. The system leverages OpenAI's GPT models for AI-powered phishing detection.

```
┌─────────────────┐       ┌───────────────┐       ┌───────────────┐
│                 │       │               │       │               │
│  React Frontend │◄─────►│    Supabase   │◄─────►│  OpenAI API   │
│                 │       │               │       │               │
└─────────────────┘       └───────────────┘       └───────────────┘
        │                         │
        │                         │
        ▼                         ▼
┌─────────────────┐       ┌───────────────┐
│                 │       │               │
│    UI/UX Layer  │       │   Database    │
│                 │       │               │
└─────────────────┘       └───────────────┘
```

### Key Components

1. **Frontend (React/TypeScript)**
   - Single-page application with React Router for navigation
   - Responsive UI using Tailwind CSS and shadcn/ui for consistent design system
   - State management using React Context API and custom hooks
   - Real-time data updates via Supabase subscriptions
   - Form validation and error handling with React Hook Form
   - Interactive data visualizations with Recharts

2. **Backend (Supabase)**
   - Authentication and user management with JWT tokens
   - PostgreSQL database for data storage with Row-Level Security
   - Edge Functions for serverless compute and API integration
   - Storage for file uploads and attachments
   - Real-time subscriptions for live updates

3. **AI Analysis Engine**
   - OpenAI's GPT-4o-mini model for phishing content analysis
   - Custom system prompts based on user alert rule configurations
   - Extraction and formatting of email components
   - Risk scoring and confidence assessment
   - Phishing indicator identification and explanation

## Database Schema

### Tables

1. **profiles**
   - User profile information linked to Supabase auth
   - Stores display name, email, and avatar URL
   - Fields: id (UUID, PK), email (text), full_name (text, nullable), avatar_url (text, nullable), created_at (timestamp), updated_at (timestamp)

2. **phishing_analyses**
   - Stores results of phishing analysis requests
   - Includes scores, risk levels, and explanations
   - Linked to users for access control
   - Fields: id (UUID, PK), user_id (UUID, FK), message (text), score (integer), risk_level (text), explanation (text), confidence_level (text), created_at (timestamp), status (text, nullable)

3. **alert_rules**
   - User-configurable alert detection rules
   - Controls sensitivity and enabled state for different threat types
   - Used to customize the AI analysis behavior
   - Fields: id (UUID, PK), user_id (UUID, FK), name (text), description (text), rule_type (text), sensitivity (text), enabled (boolean), created_at (timestamp), updated_at (timestamp)

4. **user_settings**
   - Stores user-specific configuration for analysis behavior
   - Controls confidence thresholds, auto-reporting, and display preferences
   - Fields: id (UUID, PK), user_id (UUID, FK), false_positive_protection (boolean), min_confidence_threshold (integer), auto_report_high_risk (boolean), show_detailed_indicators (boolean), updated_at (timestamp)

5. **analysis_feedback**
   - Stores user feedback on analysis results
   - Used to improve the system over time
   - Fields: id (UUID, PK), analysis_id (UUID, FK), user_id (UUID, FK), feedback_type (text), comments (text, nullable), created_at (timestamp)

## Authentication System

The authentication system uses Supabase Auth:

1. **Session Management**
   - JWT tokens stored securely with automatic refresh
   - Session persistence across page reloads
   - Real-time session state with onAuthStateChange listeners

2. **User Profile**
   - User profiles stored in the profiles table
   - Profile creation triggered by database function on new user registration
   - Profile data accessible via Row-Level Security policies

3. **Security Measures**
   - CORS configuration for API endpoints
   - JWT verification for Edge Function calls
   - Row-Level Security for database access control

## Phishing Analysis System

### Analysis Process Flow

1. **Input Collection**
   - User submits content via PhishingAnalyzerForm component
   - Content can be entered directly, uploaded as a file, or forwarded by email
   - Input validation ensures sufficient content for analysis

2. **Request Processing**
   - Content sent to analyze-phishing Edge Function
   - User authentication verified via JWT
   - Content formatted for optimal analysis

3. **AI Analysis with OpenAI**
   - Edge Function calls OpenAI API (GPT-4o-mini model) with the formatted content
   - API key stored securely in Supabase secrets
   - Custom system prompt instructs AI on phishing detection criteria
   - Prompt includes detailed guidelines for scoring and confidence assessment
   - AI analyzes for phishing indicators like urgency, suspicious URLs, domain spoofing

4. **Result Processing**
   - AI response parsed and stored in phishing_analyses table
   - Results returned to frontend for display
   - High-risk detections trigger optional alert notifications

5. **User Interaction**
   - Results displayed with color-coded risk levels
   - Detailed explanation provided for user review
   - User can mark analysis as safe or reported
   - Analysis stored in history for future reference

### OpenAI Integration

The OpenAI integration is a core component of the analysis system:

1. **API Configuration**
   - OpenAI API key stored securely as a Supabase secret
   - No API keys exposed in frontend code
   - Edge Function handles all API calls server-side

2. **Model Selection**
   - Uses GPT-4o-mini model for optimal balance of accuracy and cost
   - Configuration parameters:
     - Low temperature (0.2) for consistent results
     - JSON response format for structured data
     - Specific fields requested: score, riskLevel, explanation, confidenceLevel

3. **Prompt Engineering**
   - Specialized system prompt defines the AI's role as a phishing detection expert
   - Detailed scoring criteria (0-100 scale)
   - Risk level definitions (low, medium, high)
   - Extensive phishing indicators based on security research
   - Dynamic prompt components based on user's alert rules

4. **Token Optimization**
   - Efficient prompting to minimize token usage
   - Response format optimized for parsing
   - Selective content extraction to reduce input size

5. **Error Handling**
   - Graceful fallbacks for API failures
   - Rate limit management
   - Timeout handling with user feedback

### Alert Rules System

Alert rules provide customizable security policies for each user:

- **AI Content Detection**: Identifies AI-generated phishing attempts using linguistic patterns
- **Domain Spoofing**: Detects slight variations in domain names like "paypa1.com" vs "paypal.com"
- **Suspicious URLs**: Analyzes links for phishing indicators like misleading domains
- **Urgency Detection**: Identifies pressure tactics commonly used in phishing

Each rule has configurable sensitivity (low, medium, high) that affects detection thresholds and the system prompt sent to the AI.

#### Rule Sensitivity Configuration

Rules have three sensitivity levels that directly influence the system prompt and detection thresholds:

1. **Low Sensitivity**
   - Only flags obvious violations with high confidence
   - Reduces false positives but may miss sophisticated threats
   - Example: For domain spoofing, only flags exact homographs or one-character replacements

2. **Medium Sensitivity (Default)**
   - Balanced approach suitable for most users
   - Detects moderate-level threats with reasonable confidence
   - Example: For URL detection, analyzes URL structure and common redirection techniques

3. **High Sensitivity**
   - Aggressive detection that flags even subtle indicators
   - May increase false positives but catches more sophisticated attacks
   - Example: For AI content detection, flags even minor linguistic anomalies

#### Implementation Details

The alert rules system is fully integrated with the analysis process:

1. **Rule Storage and Retrieval**
   - Rules stored in the `alert_rules` table with user_id, type, and sensitivity
   - Retrieved during analysis using the authenticated user's ID
   - Default rules created during user registration

2. **Dynamic Prompt Engineering**
   - System prompts dynamically generated based on enabled rules
   - Each rule type adds specific detection instructions to the prompt
   - Sensitivity levels modify the detection parameters for each rule type

3. **User Interface**
   - Rules managed through the AlertRulesCard component
   - Toggle switches enable/disable individual rules
   - Dropdown selectors adjust sensitivity levels
   - Changes take immediate effect in subsequent analyses

4. **Rule Application**
   - Only enabled rules affect the analysis
   - The analyze-phishing edge function fetches active rules
   - Rules combine additively to create a comprehensive detection system

### User Settings and Preferences

User settings provide additional control over the analysis behavior:

#### Available Settings

1. **False Positive Protection**
   - When enabled, reduces the risk level when confidence is low or medium
   - Helps prevent legitimate emails from being incorrectly identified as threats
   - Particularly useful for users who receive complex or unusual legitimate communications

2. **Minimum Confidence Threshold**
   - Sets the minimum confidence level required for high confidence assessments
   - Adjusts how conservative or liberal the system is with its confidence claims
   - Higher values require stronger evidence before claiming high confidence

3. **Auto-Report High Risk**
   - Automatically marks high-risk, high-confidence detections as reported
   - Useful for security teams to track potential incidents
   - Can be integrated with external security systems via webhooks

4. **Show Detailed Indicators**
   - Controls whether detailed rule information appears in analysis explanations
   - Helps users understand which rules triggered the detection
   - Useful for educational purposes and building user awareness

#### Settings Implementation

1. **Storage and Management**
   - Settings stored in the `user_settings` table
   - Linked to users via user_id foreign key
   - Default values set at user registration

2. **Settings Application**
   - Retrieved during the analysis process
   - Applied as post-processing to the AI analysis results
   - Can modify scores, risk levels, and explanations

3. **User Interface**
   - Settings managed through the AnalysisSettings component
   - Changes take immediate effect for subsequent analyses
   - Descriptions help users understand the impact of each setting

## Edge Functions Implementation

### analyze-phishing

The core analysis engine that:

1. **Receives content** via HTTP POST request
2. **Authenticates the request** using JWT from Authorization header
3. **Fetches user settings and alert rules** for personalized analysis:
   - Retrieves enabled rules from alert_rules table
   - Loads user preferences from user_settings table
   - Aggregates sensitivity levels for each rule type

4. **Extracts email components** if content is in email format
   - Parses headers for subject, sender, recipients
   - Separates body content from headers
   - Identifies forwarded messages

5. **Creates dynamic AI system prompt** with detection guidelines
   - Includes scoring criteria (0-100 scale)
   - Defines risk levels (low, medium, high)
   - Adds rule-specific instructions based on enabled rules
   - Tailors detection parameters by sensitivity level
   - Incorporates user preference settings

6. **Calls OpenAI API** with GPT-4o-mini model
   - Uses low temperature (0.2) for consistent results
   - Formats response as JSON object
   - Requests specific fields: score, riskLevel, explanation, confidenceLevel
   - Securely uses API key stored in Supabase secrets

7. **Post-processes response**
   - Applies false positive protection if enabled
   - Adjusts confidence thresholds based on user settings
   - Auto-reports high-risk detections if configured
   - Enhances explanation with rule-specific details if enabled
   - Parses OpenAI JSON response
   - Stores result in phishing_analyses table
   - Returns formatted result to client

### send-alert-email

Sends email notifications for high-risk threats:
1. Triggered manually or automatically for high-risk detections
2. Formats HTML email with threat details
3. Sends via a configured email service
4. Records notification in the database

## Frontend Components

### Key Components Detailed

1. **PhishingAnalyzerForm**
   - Main user interface for submitting content
   - Handles text input with character counting and validation
   - Supports file uploads with proper MIME type validation
   - Shows loading state during analysis
   - Displays results with color-coded risk indicators
   - Extracts and displays key phishing indicators

2. **Dashboard**
   - User's central control panel with stats overview
   - Displays threat statistics in visual charts
   - Shows recent detections in a sortable table
   - Provides access to alert rule configuration
   - Features geographic distribution of threats

3. **AlertRulesCard**
   - Interface for configuring detection sensitivity
   - Toggle rules on/off with immediate effect
   - Adjust sensitivity levels via dropdown selectors
   - Displays rule descriptions and recommendations
   - Shows loading states during API operations
   - Handles error states with helpful messages
   - Optimistically updates UI before server confirmation
   - Provides real-time feedback via toast notifications

4. **AnalysisSettings**
   - Controls advanced analysis behavior options
   - Toggles for false positive protection and auto-reporting
   - Threshold sliders for confidence levels
   - Display preferences for analysis results
   - Organizes settings in logical tab groups
   - Provides explanations for each setting's impact
   - Settings automatically saved as changes are made

5. **RealTimeThreatMonitor**
   - Displays analysis activity over time (last 6 hours)
   - Visual representation using line chart
   - Shows manually analyzed emails only
   - Color-coded alert indicators
   - Empty state for no recent analyses
   - Loading state during data retrieval
   - Updates automatically every 3 minutes

6. **UserHistory**
   - Displays historical detections in chronological order
   - Allows viewing complete details of any past analysis
   - Supports marking items as safe or reporting them
   - Enables deletion of history items
   - Shows risk levels with color coding

7. **DetectionTable**
   - Interactive table of detected threats
   - Sortable columns for easy data navigation
   - Status indicators for new/reviewed/safe/reported items
   - Action buttons for status changes
   - Detailed view modal for full analysis review

## Data Flow

### User Authentication Flow

1. User signs up/logs in via Supabase Auth
2. JWT token stored securely in local storage
3. Token used for API requests to Supabase
4. Row-Level Security ensures users only access their own data
5. AuthContext provides authentication state to all components

### Phishing Analysis Flow

1. User submits content via web form, file upload, or email forwarding
2. Content sent to analyze-phishing Edge Function with auth token
3. Edge Function authenticates request and formats content
4. Edge Function retrieves user's alert rules and settings
5. Dynamic system prompt created based on rules and settings
6. OpenAI API analyzes content with personalized system prompt
7. Results processed according to user preferences
   - False positive protection applied if enabled
   - Risk levels adjusted based on confidence thresholds
   - Auto-reporting triggered for high-risk items if enabled
8. Results returned to client and stored in database
9. UI updated with analysis results
10. Optional alert notifications sent for high-risk detections

### Alert Rules Flow

1. User configures alert rules in dashboard
2. Rule settings stored in alert_rules table
3. Settings retrieved when user initiates analysis
4. Rules influence system prompt sent to OpenAI
5. Analysis results reflect user's rule preferences
6. Optional detailed rule indicators included in explanations
7. UI components optimistically update before confirmation
8. Toast notifications confirm successful rule changes

## Security Measures

1. **Row-Level Security (RLS)**
   - Database policies ensure users can only access their own data
   - Each table has policies for insert, select, update, and delete operations
   - Policies use auth.uid() to match user_id columns

2. **JWT Authentication**
   - All API requests require valid authentication
   - Short-lived tokens with automatic refresh
   - Verified on both client and server side

3. **Edge Function Security**
   - Edge functions validate authentication before processing
   - Rate limiting to prevent abuse
   - Input validation to prevent injection attacks

4. **Data Encryption**
   - Sensitive data encrypted at rest in Supabase
   - HTTPS for all API communications
   - API keys stored as secure environment variables

## Email Forwarding System

The email forwarding system allows users to send suspicious emails for analysis:

1. User forwards email to scan@aishieldalert.com
2. Email processing service extracts headers, body, and attachments
3. System identifies the sender's registered email
4. Content is processed through the analysis engine
5. Results are stored and notification sent back to user

## Performance Optimizations

1. **Analysis Caching**
   - Similar content analysis results are cached to reduce API costs
   - Cache invalidated after certain time periods
   - Improves response time for repeated analyses

2. **Progressive Loading**
   - Dashboard components load progressively to improve perceived performance
   - Critical UI elements render first while data is fetched
   - Skeleton loaders indicate loading state

3. **Optimistic Updates**
   - UI updates optimistically before server confirmation
   - Rolled back if server operations fail
   - Improves perceived responsiveness

4. **Efficient Data Fetching**
   - Only required data is fetched from the database
   - Pagination used for large data sets
   - Debounced searches and filters

## Monitoring and Logging

1. **Error Tracking**
   - Frontend errors logged via console
   - Edge function errors captured in Supabase logs
   - User-facing error messages for common issues

2. **Analysis Metrics**
   - Success rates, average scores, and false positive tracking
   - Used to improve system accuracy over time
   - Aggregated for trend analysis

3. **User Activity**
   - Dashboard usage metrics
   - Feature popularity tracking for development prioritization
   - Session duration and engagement statistics

## AI System Prompt Engineering

The system uses carefully crafted prompts for OpenAI's models:

1. **Base Prompt Structure**
   - Defines the AI's role as a phishing detection expert
   - Specifies output format as JSON
   - Lists phishing indicators to look for

2. **Scoring Guidelines**
   - Detailed criteria for score ranges (0-100)
   - Definitions for low, medium, and high risk levels
   - Confidence level assessment guidelines

3. **Analysis Instructions**
   - Guidelines for analyzing sender addresses
   - URL inspection criteria
   - Language pattern analysis
   - AI-generated content detection

4. **Customization Points**
   - Sensitivity adjustments based on user preferences
   - Focus areas determined by enabled alert rules
   - Specific indicators prioritized by rule configuration

### Prompt Customization by Rule Type

Each rule type adds specific detection instructions to the prompt:

1. **AI Content Detection**
   - Low: Only flag clearly AI-generated text with obvious patterns
   - Medium: Look for content that seems artificially structured or has unusual phrasing
   - High: Be highly suspicious of perfectly formatted text, subtle AI patterns, or content that seems too perfect

2. **Domain Spoofing**
   - Low: Flag only obvious domain spoofing (e.g., 'google-accounts.com' instead of 'google.com')
   - Medium: Detect moderate domain manipulation and homograph attacks
   - High: Detect even subtle domain variations, look for homograph attacks, international character substitutions

3. **Suspicious URLs**
   - Low: Flag only clearly malicious URLs
   - Medium: Analyze URL paths, parameters, and check for redirection techniques
   - High: Be highly suspicious of URL shorteners, encoded URLs, or unusual TLDs

4. **Urgency Detection**
   - Low: Flag only extreme urgency language (e.g., 'act now or your account will be deleted')
   - Medium: Be suspicious of time-pressure tactics and deadlines
   - High: Flag any language that creates a sense of urgency or time pressure

### Prompt Application Logic

The system follows these steps to apply the customized prompt:

1. Start with a base expert system prompt that defines the AI's role and output format
2. Add general phishing detection guidelines that apply to all analyses
3. For each enabled rule:
   - Add rule-specific instructions based on the rule type
   - Adjust detection parameters based on the rule's sensitivity level
4. Add user preference modifiers (false positive protection, confidence thresholds)
5. Send the completed prompt to the OpenAI API with the content for analysis

## Scalability and Future Extensions

1. **Horizontal Scaling**
   - Supabase infrastructure scales automatically with load
   - Edge Functions provide serverless scaling for backend operations
   - Frontend served via CDN for global availability

2. **Performance Monitoring**
   - Response time tracking for API calls
   - Database query optimization
   - Caching strategies for frequently accessed data

3. **Future Extensions**
   - Browser Extensions: Direct integration with email clients like Gmail
   - API Access: For third-party integrations
   - Advanced Analytics: ML-based pattern recognition across organization
   - Enterprise Features: Multi-user management and role-based access

4. **Continuous Improvement**
   - Feedback system for improving detection accuracy
   - A/B testing of different analysis approaches
   - Regular model updates as AI technology advances

## Testing and Quality Assurance

1. **Unit Testing**
   - Component-level tests for UI elements
   - Function-level tests for utility functions
   - Mock testing for external API interactions

2. **Integration Testing**
   - End-to-end flows for key user journeys
   - API contract testing for frontend/backend integration
   - Cross-browser compatibility testing

3. **Performance Testing**
   - Load testing for simultaneous users
   - Response time benchmarks
   - Memory usage optimization

This technical document provides a comprehensive overview of the AI Shield Alert system architecture and components. For specific implementation details, refer to the codebase and inline documentation.
