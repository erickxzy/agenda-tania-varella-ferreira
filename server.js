require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.static('.'));

const db = new Database('escola.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS alunos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL,
    serie TEXT NOT NULL
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS direcao (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS eventos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    serie TEXT NOT NULL,
    descricao TEXT NOT NULL
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS cardapio (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dia_semana TEXT UNIQUE NOT NULL,
    prato TEXT,
    acompanhamento TEXT,
    sobremesa TEXT,
    bebida TEXT
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS professores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    materia TEXT NOT NULL,
    status TEXT NOT NULL,
    data TEXT NOT NULL
  )
`);

try {
  const columns = db.prepare("PRAGMA table_info(professores)").all();
  const hasDataColumn = columns.some(col => col.name === 'data');
  
  if (!hasDataColumn) {
    db.exec(`ALTER TABLE professores ADD COLUMN data TEXT DEFAULT '28/10/2025'`);
    console.log("✅ Coluna 'data' adicionada à tabela professores com sucesso!");
  }
} catch(error) {
  console.error("❌ ERRO CRÍTICO: Falha ao migrar tabela professores:", error.message);
  console.error("⚠️ O sistema pode não funcionar corretamente. Verifique o banco de dados.");
}

db.exec(`
  CREATE TABLE IF NOT EXISTS avisos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tipo TEXT NOT NULL,
    professor TEXT NOT NULL,
    titulo TEXT NOT NULL,
    descricao TEXT NOT NULL,
    data_aviso TEXT NOT NULL
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS recuperacao_senha (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    codigo TEXT NOT NULL,
    tipo TEXT NOT NULL,
    expira TEXT NOT NULL,
    usado INTEGER DEFAULT 0
  )
`);

const admin = db.prepare('SELECT * FROM alunos WHERE email = ?').get('admin');
if (!admin) {
  const senhaHash = bcrypt.hashSync('admin1', 10);
  db.prepare('INSERT INTO alunos (nome, email, senha, serie) VALUES (?, ?, ?, ?)').run('Administrador', 'admin', senhaHash, 'Admin');
}

const diasSemana = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];
diasSemana.forEach(dia => {
  const existe = db.prepare('SELECT * FROM cardapio WHERE dia_semana = ?').get(dia);
  if (!existe) {
    db.prepare('INSERT INTO cardapio (dia_semana, prato, acompanhamento, sobremesa, bebida) VALUES (?, ?, ?, ?, ?)').run(dia, 'A definir', 'A definir', 'A definir', 'A definir');
  }
});

const professoresIniciais = [
  { nome: 'Eliane', materia: 'Português', status: 'Presente', data: '28/10/2025' },
  { nome: 'Cleiton', materia: 'Introdução à Programação, Introdução à Computação e Lógica Computacional', status: 'Presente', data: '28/10/2025' },
  { nome: 'Solange', materia: 'Química e Matemática', status: 'Presente', data: '28/10/2025' },
  { nome: 'Airan', materia: 'Projeto de Vida', status: 'Presente', data: '28/10/2025' },
  { nome: 'Dilma', materia: 'Educação Financeira', status: 'Presente', data: '28/10/2025' },
  { nome: 'Ricardo', materia: 'Educação Física', status: 'Presente', data: '28/10/2025' }
];

const totalProfs = db.prepare('SELECT COUNT(*) as total FROM professores').get().total;
if (totalProfs === 0) {
  professoresIniciais.forEach(p => {
    db.prepare('INSERT INTO professores (nome, materia, status, data) VALUES (?, ?, ?, ?)').run(p.nome, p.materia, p.status, p.data);
  });
}

const avisosIniciais = [
  { tipo: 'Quizizz', professor: 'Solange', titulo: 'Quizizz de Química - Tabela Periódica', descricao: 'Completar o quiz sobre elementos químicos até sexta-feira', data_aviso: '29/10/2025' },
  { tipo: 'Quizizz', professor: 'Solange', titulo: 'Quizizz de Matemática - Equações do 2º Grau', descricao: 'Resolver exercícios de equações quadráticas', data_aviso: '30/10/2025' },
  { tipo: 'Quizizz', professor: 'Solange', titulo: 'Quizizz de Química - Ligações Químicas', descricao: 'Estudar ligações iônicas e covalentes para o quiz', data_aviso: '31/10/2025' },
  { tipo: 'Quizizz', professor: 'Solange', titulo: 'Quizizz de Matemática - Funções', descricao: 'Revisar funções de 1º e 2º grau', data_aviso: '01/11/2025' },
  { tipo: 'Quizizz', professor: 'Solange', titulo: 'Quizizz de Matemática - Geometria', descricao: 'Quiz sobre áreas e perímetros de figuras planas', data_aviso: '02/11/2025' },
  
  { tipo: 'Khan Academy', professor: 'Solange', titulo: 'Khan Academy - Álgebra Linear', descricao: 'Completar módulo de matrizes e determinantes', data_aviso: '29/10/2025' },
  { tipo: 'Khan Academy', professor: 'Solange', titulo: 'Khan Academy - Química Orgânica', descricao: 'Assistir vídeos sobre hidrocarbonetos', data_aviso: '30/10/2025' },
  { tipo: 'Khan Academy', professor: 'Solange', titulo: 'Khan Academy - Trigonometria', descricao: 'Resolver exercícios de seno, cosseno e tangente', data_aviso: '31/10/2025' },
  { tipo: 'Khan Academy', professor: 'Solange', titulo: 'Khan Academy - Estequiometria', descricao: 'Completar exercícios de cálculos estequiométricos', data_aviso: '01/11/2025' },
  { tipo: 'Khan Academy', professor: 'Solange', titulo: 'Khan Academy - Probabilidade', descricao: 'Estudar conceitos básicos de probabilidade', data_aviso: '02/11/2025' },
  
  { tipo: 'Redação Paraná', professor: 'Eliane', titulo: 'Redação - Texto Dissertativo-Argumentativo', descricao: 'Escrever redação sobre "Sustentabilidade no Século XXI"', data_aviso: '29/10/2025' },
  { tipo: 'Redação Paraná', professor: 'Eliane', titulo: 'Redação - Carta Argumentativa', descricao: 'Produzir carta argumentativa sobre educação pública', data_aviso: '30/10/2025' },
  { tipo: 'Redação Paraná', professor: 'Eliane', titulo: 'Redação - Artigo de Opinião', descricao: 'Escrever artigo sobre tecnologia e sociedade', data_aviso: '31/10/2025' },
  { tipo: 'Redação Paraná', professor: 'Eliane', titulo: 'Redação - Texto Narrativo', descricao: 'Criar narrativa sobre diversidade cultural', data_aviso: '01/11/2025' },
  { tipo: 'Redação Paraná', professor: 'Eliane', titulo: 'Redação - Resenha Crítica', descricao: 'Fazer resenha do livro "Dom Casmurro"', data_aviso: '02/11/2025' }
];

const totalAvisos = db.prepare('SELECT COUNT(*) as total FROM avisos').get().total;
if (totalAvisos === 0) {
  avisosIniciais.forEach(a => {
    db.prepare('INSERT INTO avisos (tipo, professor, titulo, descricao, data_aviso) VALUES (?, ?, ?, ?, ?)').run(a.tipo, a.professor, a.titulo, a.descricao, a.data_aviso);
  });
}

const eventosFicticios = [
  { serie: '1º Ano', descricao: 'Trabalho de Português - Redação sobre "Minha Família"' },
  { serie: '1º Ano', descricao: 'Prova de Matemática - Adição e Subtração' },
  { serie: '1º Ano', descricao: 'Apresentação de Ciências - Os Animais' },
  { serie: '2º Ano', descricao: 'Trabalho de História - Linha do Tempo da Minha Vida' },
  { serie: '2º Ano', descricao: 'Prova de Matemática - Multiplicação e Divisão' },
  { serie: '2º Ano', descricao: 'Projeto de Artes - Pintura com Tinta Guache' },
  { serie: '3º Ano', descricao: 'Trabalho de Geografia - Mapa do Bairro' },
  { serie: '3º Ano', descricao: 'Prova de Português - Interpretação de Texto' },
  { serie: '3º Ano', descricao: 'Feira de Ciências - Experimento sobre Plantas' }
];

const totalEventos = db.prepare('SELECT COUNT(*) as total FROM eventos').get().total;
if (totalEventos === 0) {
  eventosFicticios.forEach(e => {
    db.prepare('INSERT INTO eventos (serie, descricao) VALUES (?, ?)').run(e.serie, e.descricao);
  });
}

app.post('/api/cadastrar', (req, res) => {
  const { nome, email, senha, serie } = req.body;

  if (!nome || !email || !senha || !serie) {
    return res.status(400).json({ sucesso: false, erro: 'Preencha todos os campos!' });
  }

  if (!email.endsWith('@escola.pr.gov.br')) {
    return res.status(400).json({ sucesso: false, erro: 'O e-mail deve terminar com @escola.pr.gov.br' });
  }

  const alunoExiste = db.prepare('SELECT * FROM alunos WHERE email = ?').get(email);
  if (alunoExiste) {
    return res.status(400).json({ sucesso: false, erro: 'Este e-mail já está cadastrado!' });
  }

  const senhaHash = bcrypt.hashSync(senha, 10);
  
  try {
    db.prepare('INSERT INTO alunos (nome, email, senha, serie) VALUES (?, ?, ?, ?)').run(nome, email, senhaHash, serie);
    res.json({ sucesso: true, mensagem: 'Aluno cadastrado com sucesso! Agora faça login.' });
  } catch (error) {
    res.status(500).json({ sucesso: false, erro: 'Erro ao cadastrar aluno.' });
  }
});

app.post('/api/cadastrar-direcao', (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ sucesso: false, erro: 'Preencha todos os campos!' });
  }

  const membroExiste = db.prepare('SELECT * FROM direcao WHERE email = ?').get(email);
  if (membroExiste) {
    return res.status(400).json({ sucesso: false, erro: 'Este e-mail já está cadastrado!' });
  }

  const senhaHash = bcrypt.hashSync(senha, 10);
  
  try {
    db.prepare('INSERT INTO direcao (nome, email, senha) VALUES (?, ?, ?)').run(nome, email, senhaHash);
    res.json({ sucesso: true, mensagem: 'Membro da direção cadastrado com sucesso! Agora faça login.' });
  } catch (error) {
    res.status(500).json({ sucesso: false, erro: 'Erro ao cadastrar.' });
  }
});

app.post('/api/login', (req, res) => {
  const { email, senha } = req.body;

  const aluno = db.prepare('SELECT * FROM alunos WHERE email = ?').get(email);
  if (!aluno) {
    return res.status(400).json({ sucesso: false, erro: 'E-mail ou senha incorretos!' });
  }

  if (!aluno.senha) {
    return res.status(400).json({ 
      sucesso: false, 
      erro: 'Esta conta usa login do Google. Por favor, use "Entrar com Google".' 
    });
  }

  const senhaValida = bcrypt.compareSync(senha, aluno.senha);
  if (!senhaValida) {
    return res.status(400).json({ sucesso: false, erro: 'E-mail ou senha incorretos!' });
  }

  res.json({ 
    sucesso: true, 
    usuario: { 
      id: aluno.id, 
      nome: aluno.nome, 
      email: aluno.email, 
      serie: aluno.serie 
    } 
  });
});

app.post('/api/login-direcao', (req, res) => {
  const { email, senha } = req.body;

  const membro = db.prepare('SELECT * FROM direcao WHERE email = ?').get(email);
  if (!membro) {
    return res.status(400).json({ sucesso: false, erro: 'E-mail ou senha incorretos!' });
  }

  const senhaValida = bcrypt.compareSync(senha, membro.senha);
  if (!senhaValida) {
    return res.status(400).json({ sucesso: false, erro: 'E-mail ou senha incorretos!' });
  }

  res.json({ 
    sucesso: true, 
    usuario: { 
      id: membro.id, 
      nome: membro.nome, 
      email: membro.email
    } 
  });
});

app.post('/api/recuperar-senha', (req, res) => {
  const { email, tipo } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'E-mail é obrigatório.' });
  }

  let usuario = null;
  if (tipo === 'aluno') {
    usuario = db.prepare('SELECT * FROM alunos WHERE email = ?').get(email);
  } else if (tipo === 'direcao') {
    usuario = db.prepare('SELECT * FROM direcao WHERE email = ?').get(email);
  }

  if (!usuario) {
    return res.status(404).json({ error: 'E-mail não encontrado no sistema.' });
  }

  const codigo = Math.floor(100000 + Math.random() * 900000).toString();
  
  const expira = new Date(Date.now() + 30 * 60 * 1000).toISOString();

  try {
    db.prepare('INSERT INTO recuperacao_senha (email, codigo, tipo, expira, usado) VALUES (?, ?, ?, ?, 0)')
      .run(email, codigo, tipo, expira);

    res.json({ 
      message: `Código de recuperação enviado para ${email}. Use o código: ${codigo} (válido por 30 minutos)`,
      codigo: codigo,
      debug: true
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao gerar código de recuperação.' });
  }
});

app.post('/api/resetar-senha', (req, res) => {
  const { email, codigo, novaSenha } = req.body;

  if (!email || !codigo || !novaSenha) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  const recuperacao = db.prepare('SELECT * FROM recuperacao_senha WHERE email = ? AND codigo = ? AND usado = 0 ORDER BY id DESC LIMIT 1')
    .get(email, codigo);

  if (!recuperacao) {
    return res.status(400).json({ error: 'Código inválido ou já utilizado.' });
  }

  const agora = new Date().toISOString();
  if (agora > recuperacao.expira) {
    return res.status(400).json({ error: 'Código expirado. Solicite um novo código.' });
  }

  const senhaHash = bcrypt.hashSync(novaSenha, 10);

  try {
    if (recuperacao.tipo === 'aluno') {
      db.prepare('UPDATE alunos SET senha = ? WHERE email = ?').run(senhaHash, email);
    } else if (recuperacao.tipo === 'direcao') {
      db.prepare('UPDATE direcao SET senha = ? WHERE email = ?').run(senhaHash, email);
    }

    db.prepare('UPDATE recuperacao_senha SET usado = 1 WHERE id = ?').run(recuperacao.id);

    res.json({ message: 'Senha alterada com sucesso! Faça login com sua nova senha.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao resetar senha.' });
  }
});

app.get('/api/alunos', (req, res) => {
  const alunos = db.prepare('SELECT id, nome, email, serie FROM alunos WHERE email != ?').all('admin');
  res.json(alunos);
});

app.get('/api/eventos/:serie', (req, res) => {
  const { serie } = req.params;
  const eventos = db.prepare('SELECT * FROM eventos WHERE serie = ?').all(serie);
  res.json(eventos);
});

app.post('/api/eventos', (req, res) => {
  const { serie, descricao } = req.body;
  db.prepare('INSERT INTO eventos (serie, descricao) VALUES (?, ?)').run(serie, descricao);
  res.json({ sucesso: true });
});

app.put('/api/eventos/:id', (req, res) => {
  const { id } = req.params;
  const { descricao } = req.body;
  db.prepare('UPDATE eventos SET descricao = ? WHERE id = ?').run(descricao, id);
  res.json({ sucesso: true });
});

app.delete('/api/eventos/:id', (req, res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM eventos WHERE id = ?').run(id);
  res.json({ sucesso: true });
});

app.get('/api/cardapio/:dia', (req, res) => {
  const { dia } = req.params;
  const cardapio = db.prepare('SELECT * FROM cardapio WHERE dia_semana = ?').get(dia);
  if (cardapio) {
    res.json(cardapio);
  } else {
    res.json({ prato: 'A definir', acompanhamento: 'A definir', sobremesa: 'A definir', bebida: 'A definir' });
  }
});

app.put('/api/cardapio/:dia', (req, res) => {
  const { dia } = req.params;
  const { prato, acompanhamento, sobremesa, bebida } = req.body;
  db.prepare('UPDATE cardapio SET prato = ?, acompanhamento = ?, sobremesa = ?, bebida = ? WHERE dia_semana = ?').run(prato, acompanhamento, sobremesa, bebida, dia);
  res.json({ sucesso: true });
});

app.get('/api/professores', (req, res) => {
  const professores = db.prepare('SELECT * FROM professores').all();
  res.json(professores);
});

app.put('/api/professores/:id', (req, res) => {
  const { id } = req.params;
  const { nome, materia, status, data } = req.body;
  db.prepare('UPDATE professores SET nome = ?, materia = ?, status = ?, data = ? WHERE id = ?').run(nome, materia, status, data, id);
  res.json({ sucesso: true });
});

app.get('/api/avisos', (req, res) => {
  const avisos = db.prepare('SELECT * FROM avisos ORDER BY id DESC').all();
  res.json(avisos);
});

app.post('/api/avisos', (req, res) => {
  const { tipo, professor, titulo, descricao, data_aviso } = req.body;
  db.prepare('INSERT INTO avisos (tipo, professor, titulo, descricao, data_aviso) VALUES (?, ?, ?, ?, ?)').run(tipo, professor, titulo, descricao, data_aviso);
  res.json({ sucesso: true });
});

app.put('/api/avisos/:id', (req, res) => {
  const { id } = req.params;
  const { tipo, professor, titulo, descricao, data_aviso } = req.body;
  db.prepare('UPDATE avisos SET tipo = ?, professor = ?, titulo = ?, descricao = ?, data_aviso = ? WHERE id = ?').run(tipo, professor, titulo, descricao, data_aviso, id);
  res.json({ sucesso: true });
});

app.delete('/api/avisos/:id', (req, res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM avisos WHERE id = ?').run(id);
  res.json({ sucesso: true });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});
