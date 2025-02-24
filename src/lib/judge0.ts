const JUDGE0_API_URL = 'https://judge0-ce.p.rapidapi.com';

const LANGUAGE_IDS = {
  python: 71,
  javascript: 63,
  cpp: 54,
  java: 62,
  c: 50
};

interface SubmissionResponse {
  stdout: string;
  stderr: string;
  compile_output: string;
  message: string;
  status: {
    description: string;
  };
}

export async function executeCode(code: string, language: string): Promise<string> {
  try {
    const headers = {
      'content-type': 'application/json',
      'Content-Type': 'application/json',
      'X-RapidAPI-Key': import.meta.env.VITE_RAPIDAPI_KEY,
      'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
    };

    // Create submission
    const submission = await fetch(`${JUDGE0_API_URL}/submissions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        source_code: code,
        language_id: LANGUAGE_IDS[language as keyof typeof LANGUAGE_IDS],
        stdin: ''
      })
    });

    const { token } = await submission.json();

    // Poll for results
    let result: SubmissionResponse;
    do {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const response = await fetch(`${JUDGE0_API_URL}/submissions/${token}`, {
        headers
      });
      result = await response.json();
    } while (result.status.description === 'Processing');

    // Return appropriate output
    if (result.stderr) {
      return `Error:\n${result.stderr}`;
    }
    if (result.compile_output) {
      return `Compilation Error:\n${result.compile_output}`;
    }
    return result.stdout || 'Program executed successfully with no output.';
  } catch (error) {
    console.error('Error executing code:', error);
    return 'Error executing code. Please try again.';
  }
}