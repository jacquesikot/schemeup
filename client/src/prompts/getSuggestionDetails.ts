import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: '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',
});
const openai = new OpenAIApi(configuration);

// Function to fetch the best possible next column using OpenAI API
async function getSuggestionDetails(schema: string) {
  const prompt = `  
  Given the sql db schema below
  \n\nSchema: ${JSON.stringify(schema)}
  
  The response should not be vague and should contain exact details with relation to the schema provided.
  The resonse should be broken down to so that each suggestion contain one solution for one table, i.e each suggestion should be for one table only and fix one problem only.
  The response should be a javascript stringified object with the following interface
  
  interface Suggestion {
    suggestion: string;
    severity: 'high' | 'medium' | 'low';
  }

  interface Response {
    suggestions: Suggestion[],
    score: string
  }

  the response should always be returned as a stringified object with the above Response interface without any string or characters before or after the object

  Response:
  
  `;

  try {
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      max_tokens: 800,
      prompt,
      temperature: 0.2,
    });

    return response.data?.choices[0].text?.trim();
  } catch (error) {
    console.error('An error occurred while fetching the best next column:', error);
    return null;
  }
}

export default getSuggestionDetails;
