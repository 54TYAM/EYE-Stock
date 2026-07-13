import { z } from 'zod';

/**
 * Zod schema for the LLM's structured investment analysis output.
 * This enforces structured reasoning across all premium AI features.
 */
export const InvestmentAnalysisSchema = z.object({
  decision: z.enum(['INVEST', 'PASS']),
  confidence: z.number().min(0).max(100),
  overallScore: z.number().min(0).max(100),
  scores: z.object({
    financialHealth: z.number().min(1).max(5),
    growthPotential: z.number().min(1).max(5),
    riskLevel: z.number().min(1).max(5),
    marketPosition: z.number().min(1).max(5),
  }),
  reasons: z.array(z.string()).min(1),
  risks: z.array(z.string()).min(1),
  reasoning: z.string(),
  sources: z.array(z.string()).min(1),
  
  // Premium: Executive Summary
  executiveSummary: z.string(),
  timeHorizon: z.enum(['Short Term', 'Medium Term', 'Long Term']),

  // Premium: AI Confidence Meter
  confidenceEvidence: z.object({
    quality: z.enum(['High', 'Medium', 'Low']),
    factors: z.array(z.string()).min(2),
  }),

  // Premium: Granular Risk Breakdown
  riskBreakdown: z.object({
    market: z.number().min(0).max(100),
    financial: z.number().min(0).max(100),
    execution: z.number().min(0).max(100),
    regulatory: z.number().min(0).max(100),
  }),

  // Premium: Bull vs Bear Debate
  debate: z.object({
    bull: z.object({
      arguments: z.array(z.string()).min(2),
    }),
    bear: z.object({
      arguments: z.array(z.string()).min(2),
    }),
    chiefAnalystSynthesis: z.string()
  }),

  // Premium: SWOT Analysis
  swot: z.object({
    strengths: z.array(z.string()),
    weaknesses: z.array(z.string()),
    opportunities: z.array(z.string()),
    threats: z.array(z.string())
  }),

  // Premium: News Sentiment
  newsSentiment: z.object({
    overall: z.enum(['Positive', 'Neutral', 'Negative']),
    breakdown: z.object({
      positive: z.number().min(0).max(100),
      neutral: z.number().min(0).max(100),
      negative: z.number().min(0).max(100)
    }),
    reason: z.string()
  }),

  // Premium: Explain Like I'm 15
  eli15: z.string(),

  // Premium: Decision Catalysts (Causal Reasoning)
  decisionCatalysts: z.object({
    currentTopFactors: z.array(z.string()),
    whatWouldChangeDecision: z.array(z.string())
  }),

  // Premium: Score Breakdown (explains how the overall score is composed)
  scoreBreakdown: z.object({
    financialHealth: z.number(),
    growthPotential: z.number(),
    newsSentiment: z.number(),
    competitivePosition: z.number(),
    riskAdjustment: z.number(),
    valuationAdjustment: z.number(),
  }),

  // Premium: Alternative Scenarios
  scenarios: z.array(z.object({
    name: z.string(),
    assumption: z.string(),
    decision: z.enum(['INVEST', 'HOLD', 'PASS']),
    score: z.number(),
  })).min(2),
});

