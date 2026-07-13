import { Router } from 'express';
import { runInvestmentAgent } from '../lib/agent.js';
import { ChatGroq } from '@langchain/groq';

const router = Router();

/**
 * POST /api/analyze
 * Accepts { companyName: string } and returns a full investment analysis.
 */
router.post('/analyze', async (req, res) => {
  const { companyName } = req.body;

  // Input validation
  if (!companyName || typeof companyName !== 'string' || companyName.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Please provide a valid company name.',
    });
  }

  const cleanName = companyName.trim();

  if (cleanName.length > 100) {
    return res.status(400).json({
      success: false,
      error: 'Company name is too long. Please use a shorter name.',
    });
  }

  try {
    // Set a timeout for the entire analysis (180 seconds for 4 parallel LLMs)
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Analysis timed out')), 180000)
    );

    const analysisPromise = runInvestmentAgent(cleanName);
    const result = await Promise.race([analysisPromise, timeoutPromise]);

    if (!result.success) {
      return res.status(404).json(result);
    }

    return res.json(result);
  } catch (error) {
    console.error('Analysis error:', error);

    if (error.message === 'Analysis timed out') {
      return res.status(504).json({
        success: false,
        error: 'Analysis took too long. Please try again.',
      });
    }

    return res.status(500).json({
      success: false,
      error: 'An error occurred during analysis. Please try again.',
    });
  }
});
/**
 * GET /api/analyze/stream
 * Server-Sent Events (SSE) endpoint for live streaming the analysis progress.
 */
router.get('/analyze/stream', async (req, res) => {
  const companyName = req.query.company;
  
  if (!companyName || typeof companyName !== 'string' || companyName.trim().length === 0) {
    return res.status(400).json({ success: false, error: 'Please provide a valid company name.' });
  }

  // Setup SSE headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  const cleanName = companyName.trim();

  // Send an initial connected event
  res.write(`data: ${JSON.stringify({ step: 'init', status: 'connected' })}\n\n`);

  try {
    const result = await runInvestmentAgent(cleanName, (progress) => {
      res.write(`data: ${JSON.stringify(progress)}\n\n`);
    });

    if (result.success) {
      res.write(`data: ${JSON.stringify({ step: 'complete', result: result.data })}\n\n`);
    } else {
      res.write(`data: ${JSON.stringify({ step: 'error', error: result.error })}\n\n`);
    }
  } catch (error) {
    console.error('Stream error:', error);
    res.write(`data: ${JSON.stringify({ step: 'error', error: 'Internal server error during analysis.' })}\n\n`);
  } finally {
    res.end();
  }
});

/**
 * POST /api/memo
 * Generates a formatted Investment Memo in markdown.
 */
router.post('/memo', async (req, res) => {
  const { analysisData } = req.body;
  if (!analysisData || !analysisData.company) {
    return res.status(400).json({ success: false, error: 'Missing analysis data.' });
  }

  try {
    const llm = new ChatGroq({
      model: 'llama-3.3-70b-versatile',
      apiKey: process.env.GROQ_API_KEY,
      temperature: 0.2,
      maxTokens: 2048,
    });

    const prompt = `You are a top-tier Chief Investment Officer at a premier hedge fund. Write a professional, concise, one-page Investment Memo for ${analysisData.company.name} (${analysisData.company.ticker}).
    
Here is the data:
Decision: ${analysisData.analysis.decision} (Confidence: ${analysisData.analysis.confidence}%)
Overall Score: ${analysisData.analysis.overallScore}

Factors:
${JSON.stringify(analysisData.analysis.scoreBreakdown, null, 2)}

Scenarios:
${analysisData.analysis.scenarios.map(s => `- ${s.name} (${s.decision}): ${s.assumption}`).join('\n')}

Top Risks: ${analysisData.analysis.risks.join('; ')}
Catalysts that would change decision: ${analysisData.analysis.decisionCatalysts.whatWouldChangeDecision.join('; ')}

Format the memo in clean Markdown with appropriate headers (e.g., # Investment Memo: [Ticker], ## Executive Summary, ## Investment Thesis, ## Key Risks, ## Scenario Analysis). Make it sound authoritative and professional.`;

    const response = await llm.invoke([
      { role: 'system', content: 'You are an expert financial writer.' },
      { role: 'human', content: prompt }
    ]);

    return res.json({ success: true, memo: response.content });
  } catch (error) {
    console.error('Memo generation error:', error);
    return res.status(500).json({ success: false, error: 'Failed to generate memo.' });
  }
});

/**
 * POST /api/chat
 * Follow-up Q&A about an already-completed analysis.
 * Accepts { question: string, context: { company, analysis, ... } }
 */
router.post('/chat', async (req, res) => {
  const { question, context } = req.body;

  if (!question || !context) {
    return res.status(400).json({ success: false, error: 'Missing question or context.' });
  }

  try {
    const llm = new ChatGroq({
      model: 'llama-3.3-70b-versatile',
      apiKey: process.env.GROQ_API_KEY,
      temperature: 0.4,
      maxTokens: 1024,
    });

    const systemMessage = `You are a senior investment analyst assistant. You have already completed a full analysis of ${context.company?.name || 'this company'} (${context.company?.ticker || ''}).

Here is the analysis you produced:
- Decision: ${context.analysis?.decision}
- Confidence: ${context.analysis?.confidence}%
- Overall Score: ${context.analysis?.overallScore}/100
- Reasoning: ${context.analysis?.reasoning}
- Key Reasons: ${context.analysis?.reasons?.join('; ')}
- Risks: ${context.analysis?.risks?.join('; ')}
- SWOT Strengths: ${context.analysis?.swot?.strengths?.join('; ')}
- SWOT Weaknesses: ${context.analysis?.swot?.weaknesses?.join('; ')}

Answer the user's follow-up question concisely and helpfully. Stay focused on this company's investment analysis. If you don't have enough data, say so honestly.`;

    const response = await llm.invoke([
      { role: 'system', content: systemMessage },
      { role: 'human', content: question },
    ]);

    return res.json({ success: true, answer: response.content });
  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({ success: false, error: 'Could not generate a response.' });
  }
});

export default router;

