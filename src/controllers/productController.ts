import { Request, Response } from 'express';
import db from '../models/db';
import { RowDataPacket, OkPacket, ResultSetHeader } from 'mysql2';

interface Product extends RowDataPacket {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  data_criacao: string;
  imagem_url?: string;
}

export const getProducts = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query<Product[]>('SELECT * FROM produtos');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query<Product[]>('SELECT * FROM produtos WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  const { nome, descricao, preco, imagem_url } = req.body;  
  if (!nome || !preco) {
    return res.status(400).json({ error: 'Nome and Preco are required' });
  }
  try {
    const [result] = await db.query<OkPacket>(
      'INSERT INTO produtos (nome, descricao, preco, imagem_url) VALUES (?, ?, ?, ?)', 
      [nome, descricao, preco, imagem_url]  
    );
    res.status(201).json({ id: result.insertId, nome, descricao, preco, imagem_url });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create product' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nome, descricao, preco, imagem_url } = req.body; 
  if (!nome || !preco) {
    return res.status(400).json({ error: 'Nome and Preco are required' });
  }
  try {
    const [result] = await db.query<ResultSetHeader>(
      'UPDATE produtos SET nome = ?, descricao = ?, preco = ?, imagem_url = ? WHERE id = ?', 
      [nome, descricao, preco, imagem_url, id] 
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ id, nome, descricao, preco, imagem_url });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product' });
  }
};


export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const [result] = await db.query<ResultSetHeader>('DELETE FROM produtos WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
};
