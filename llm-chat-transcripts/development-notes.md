# AI Development Notes

## Architectural Decisions
1. **LangChain for Agent Orchestration:** We selected LangChain to manage the multi-agent workflows. The primary reasoning was its excellent support for chaining multiple prompt templates and ensuring context is preserved across the Bull, Bear, and Financial Analyst agents.
2. **Groq Llama-3-70b:** Swapped out from initial slower models to Groq specifically because the multi-agent system requires firing 4 separate complex LLM queries. Groq's high TPM limits and fast inference allows the entire dashboard to render in under 15 seconds.
3. **Structured Output (JSON):** A key challenge was ensuring the AI returned valid JSON so the React dashboard could reliably map the data into the SWOT matrix and Debate Panel. We solved this using explicit formatting prompts and LangChain's JSON output parsers.

## UI/UX Design
The objective was to create a "Bloomberg Terminal meets modern web" aesthetic. 
- Employed glassmorphism using raw CSS (`backdrop-filter: blur()`).
- Responsive layouts were heavily tuned using CSS Grid and `clamp()` for fluid typography.
- Neon glow effects were achieved via `box-shadow` to highlight critical sections like the Confidence Meter and Final Verdict.

## Debugging and Challenges
- **API Rate Limits:** Encountered HTTP 429 Too Many Requests from both Yahoo Finance and Groq. Solved by implementing exponential backoff in the API fetchers and minimizing redundant data fetching.
- **Scroll Behavior:** Creating an auto-scroll effect during the live agent synthesis required a `useEffect` hook tied to the scrolling height. 
- **JSON Parsing Errors:** Occasionally the LLM injected trailing commas or markdown backticks (` ```json `). Added a custom regex sanitizer in the backend to clean the string before running `JSON.parse()`.

All AI-generated scaffolding was heavily modified to integrate the APIs safely and style the application.
