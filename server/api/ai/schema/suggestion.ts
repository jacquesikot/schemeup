import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Configuration, OpenAIApi } from 'openai';

import useMiddlewares from '../../../middlewares/useMiddlewares';
import useCors from '../../../middlewares/cors';
import useAuth from '../../../middlewares/auth';

const configuration = new Configuration({
  apiKey: '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',
});
const openai = new OpenAIApi(configuration);

async function suggestion(req: VercelRequest, res: VercelResponse) {
  const prompt = `  
    Schema: ${JSON.stringify(req.body)}
    Given the postgre sql schema above, suggest improvements based on the following criteria:
    - Normalization: Check if the database is normalized, typically to the 3rd normal form.
    - Keys and Constraints: Foreign keys, primary keys, and constraints should be appropriately implemented. They maintain data integrity and relationships between tables. Check if primary keys have been assigned to each table and whether they are appropriate (unique and not null). Make sure foreign keys are used to establish relations between tables and if they have been indexed.
    - Indexing: Indexes improve query performance. Make sure that columns that are frequently used in WHERE clauses, JOIN conditions, or sorting operations are indexed. But remember, while indexes speed up queries, they can slow down write operations (INSERT, UPDATE, DELETE) because the index also needs to be updated.
    - Use of appropriate Data Types: The choice of data types can greatly influence the performance, storage requirements, and accuracy of the database. Make sure that the correct data types have been used (i.e., integer, text, date, etc.), and they are appropriate for the data they're meant to store.
    - Naming Conventions: Consistency in naming conventions helps improve the maintainability and understandability of the database structure. Table names should be plural (orders, products, etc.) and column names should be singular and descriptive. All names should preferably be in lowercase with underscores separating words.
    - Default Values: Default values should be appropriately used. They can simplify application logic and improve performance by avoiding null values.
    - Scalability: Consider how well the database design will scale. Will the structure still work efficiently if the number of records in the tables grows significantly?
    - Security: Although not part of the design per se, how is data secured, and how are access permissions handled? This isn't directly related to structure, but it's a crucial aspect of good database management.

    The response should be an array of objects with the following interface:
    
    interface Suggestion {
      problem: string;
      suggestion: string;
      severity: 'high' | 'medium' | 'low';
    }
  
    interface Response {
      suggestions: Suggestion[],
    }
  
    The response should be complete and provide a comprehensive fix that can be applied to the sql schema above directly.
    The response should not be vague and should contain exact details with relation to the schema provided.
    The resonse should be broken down to so that each suggestion contains one solution for one table, i.e each suggestion should be for one table only and fix one problem only.
    The response format should be a valid JSON object matching the Response interface provided above that can be parsed with javascript JSON.parse() function.
    Response:
    
    `;

  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    max_tokens: 800,
    prompt,
    temperature: 0.0,
  });

  res.status(200).json({
    message: 'Schema suggestions',
    data: JSON.parse(response.data.choices[0].text || ''),
  });
}

export default useMiddlewares(useCors, useAuth, suggestion);
