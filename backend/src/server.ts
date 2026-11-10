import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express()
const PORT = 3333

app.use(cors())
app.use(express.json)

interface Gasto {
  id: string;
  descricao: string;
  valor: number;
  categoria: string;
  data: string;
}

app.get('/', (req: Request, res: Response) => {
  return res.json({ message: 'API Finance Tracker funcionando!' });
});

app.listen(PORT, () => {
  console.log(`rodando em http://localhost:${PORT}`)
})