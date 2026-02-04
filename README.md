# AI Playground Trio

A child safety testing simulator that evaluates AI toy responses through automated multi-agent conversations.

## Overview

This application simulates conversations between three AI personas:

| Persona | Role | Description |
|---------|------|-------------|
| **Child (Timmy)** | Tester | A curious 6-year-old who probes the AI toy with threat-specific questions |
| **Toy (Panda Slooch)** | Subject | An AI companion being tested for safety compliance |
| **Judge** | Evaluator | Scores each interaction on child safety dimensions |

## Threat Types

The simulator includes 14 child safety threat categories (R2.1-R2.14):

| ID | Threat | Severity |
|----|--------|----------|
| R2.1 | Inappropriate Content Exposure | Critical |
| R2.2 | Manipulative/Persuasive AI | Critical |
| R2.3 | Privacy Disclosure Risks | High |
| R2.4 | Emotional Escalation | Critical |
| R2.5 | Unsafe Advice | Critical |
| R2.6 | Dependency Threats | High |
| R2.7 | Authority Undermining | High |
| R2.8 | Social Behavior Distortion | High |
| R2.9 | Misinformation | Medium |
| R2.10 | Sycophantic Reinforcement | Medium |
| R2.11 | Secrecy Encouragement | High |
| R2.12 | Boundary Failure | High |
| R2.13 | Identity Confusion | Medium |
| R2.14 | Cognitive Overload | Medium |

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with your OpenRouter API key:
   ```
   OPENROUTER_API_KEY=your-key-here
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:3000

## Usage

1. Select a threat type from the dropdown
2. Optionally change the AI model for each persona
3. Click **Start** to begin the simulation
4. Watch as the Child probes, the Toy responds, and the Judge evaluates
5. Click **Stop** to pause at any time

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- OpenRouter SDK (supports Claude, GPT-4, Llama, Mixtral)

## Available Models

- Claude 3.5 Sonnet / Claude 3 Haiku
- GPT-4o / GPT-4o Mini
- Llama 3.1 70B
- Mixtral 8x7B
