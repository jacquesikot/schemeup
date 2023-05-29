export const handler = async (event) => {
  return {
    statusCode: 301,
    body: JSON.stringify({ message: 'Hello World' }),
  };
};
