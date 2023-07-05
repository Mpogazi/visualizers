import express from 'express';

const app = express();

app.get('/', (req: any, res: any) => {
  res.send('Hello, world!');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});