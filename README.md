
# AI Shield Alert

AI Shield Alert is a comprehensive phishing detection and email security platform that uses artificial intelligence to identify and protect users from sophisticated phishing attempts, including those generated by AI.

## Overview

This application provides a robust set of tools for detecting, analyzing, and managing potential phishing threats through an AI-powered analysis engine capable of identifying even the most sophisticated AI-generated phishing attempts that traditional security tools might miss.

### Key Features

- **AI-Powered Phishing Detection**: Analyze emails and messages for phishing indicators using OpenAI's GPT-4o-mini model
- **Real-time Threat Analysis**: Get instant risk assessments with detailed explanations of detected threats
- **Customizable Alert Rules**: Configure sensitivity levels for different types of threats based on your security needs
- **Email Integration**: Forward suspicious emails for automatic analysis from any device
- **User Dashboard**: Visualize threat data and manage security settings in a comprehensive dashboard
- **Alert Notifications**: Receive real-time alerts for high-risk detections
- **Detailed Reporting**: Access comprehensive reports on detected threats with actionable insights
- **User History**: Review all past analyses with complete details and explanations
- **Status Tracking**: Mark detections as safe or reported to improve the system over time

## Getting Started

1. **Sign up for an account** - Create your account to access the dashboard and analytics
2. **Configure alert rules** - Customize detection sensitivity based on your security needs in the dashboard
4. **Start using the analyzer** - Paste suspicious email content into the analyzer for instant assessment

## Using the Analyzer

The phishing analyzer can be used in three ways:

1. **Web Interface**: Paste email content directly into the analyzer on the dashboard
3. **File Upload**: Upload .eml, .msg, or .txt files containing emails for analysis

### Analysis Process

When you submit an email or message for analysis:

1. The content is securely transmitted to our Supabase Edge Function
2. The Edge Function extracts key components (sender, subject, body)
3. OpenAI's GPT-4o-mini model analyzes the content using a specialized system prompt
4. The analysis identifies risk indicators such as urgency tactics, suspicious URLs, and domain spoofing
5. A comprehensive risk assessment is generated with a score, explanation, and confidence level
6. The results are displayed in the interface and stored in your history
7. For high-risk detections, an alert notification can be sent to your email

### Alert Rules

The system provides four main categories of alert rules that can be customized:

1. **AI Content Detection**: Identifies AI-generated phishing attempts using linguistic patterns
2. **Domain Spoofing**: Detects slight variations in domain names like "paypa1.com" vs "paypal.com"
3. **Suspicious URLs**: Analyzes links for phishing indicators like misleading domains
4. **Urgency Detection**: Identifies pressure tactics commonly used in phishing

Each rule can be set to different sensitivity levels (low, medium, high) and enabled/disabled based on your preferences.

### Analysis Settings

Additional settings allow for fine-tuning of the analysis process:

- **False Positive Protection**: Reduces the risk level when confidence is low
- **Minimum Confidence Threshold**: Sets the level required for high confidence assessments
- **Auto-Report High Risk**: Automatically marks high-risk detections as reported
- **Show Detailed Indicators**: Toggles display of detailed rule information in analyses

## Dashboard Features

The dashboard provides a comprehensive view of your email security status:

- **Threat Statistics**: Visual representation of detected threats by risk level
- **Recent Detections**: Table of recent analyses with risk levels and status
- **Threat Timeline**: Chart showing analysis activity over time
- **Geographic Threat Map**: Visual map showing geographic distribution of threats
- **Alert Rules Configuration**: Interface for customizing detection rules

## User History

The History page maintains a complete record of all email analyses performed:

- **Chronological List**: All analyses in reverse chronological order
- **Detail View**: Complete analysis details including risk score, explanation, and detected indicators
- **Status Management**: Mark items as safe or report them as threats
- **Search and Filter**: Find specific analyses based on various criteria

## Security Measures

The application implements several security measures:

- **Authentication**: Secure user authentication through Supabase Auth
- **Row-Level Security**: Database policies ensure users can only access their own data
- **API Security**: Edge Functions secure all API communication
- **Data Encryption**: Sensitive data encrypted at rest and in transit

## Technical Architecture

The application is built using a modern tech stack:

- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Supabase with Edge Functions
- **AI**: OpenAI's GPT-4o-mini model for advanced phishing detection
- **State Management**: React Context and Hooks
- **Routing**: React Router
- **API Integration**: Supabase client for database interactions
- **Data Visualization**: Recharts for dashboard statistics

## Business Model

AI Shield Alert offers several subscription tiers:

- **Free Tier**: Basic analysis with limited monthly credits
- **Personal**: Enhanced features for individual users
- **Business**: Team collaboration features and advanced analytics
- **Enterprise**: Custom solutions for large organizations

## Support

For support, please contact CSoukamneuth@gmail.com

## License

© 2025 AI Shield Alert. All rights reserved.
