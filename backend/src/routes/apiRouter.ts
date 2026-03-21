import { Router, Request, Response } from 'express';

const apiRouter = Router();

// ----------------------- Hello Route -------------------------------- //

apiRouter.get('/hello', (req: Request, res: Response) => {
  const name = (typeof req.query.name === 'string' && req.query.name) || 'World';  return res.json({ 
    message: `Hello, ${name}!`,
    timestamp: new Date().toISOString()
  });
});

apiRouter.get('/hello/:name', (req: Request, res: Response) => {
  const name = req.params.name || 'World';
  return res.json({ 
    message: `Hello, ${name}!`,
    timestamp: new Date().toISOString()
  });
});

export default apiRouter;
