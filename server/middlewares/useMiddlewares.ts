const useMiddlewares =
  (...fns) =>
  async (req, res) => {
    try {
      for (let i = 0; i < fns.length - 1; i++) {
        await fns[i](req, res);
        if (res.finished) return; // If a middleware ended the response, stop execution
      }
      return await fns[fns.length - 1](req, res); // This is your handler
    } catch (err) {
      return res.status(500).json({ message: err.message || 'Internal Server Error' });
    }
  };

export default useMiddlewares;
