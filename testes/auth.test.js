const request = require('supertest');
const app = require('../src/app');
const connection = require('../src/models/index'); 
const User = connection.models.User;

describe('Fluxo de Autenticação JWT', () => {
  // Garante que a conexão está pronta
  beforeAll(async () => {
    // Limpa a tabela de usuários para o teste começar do zero
    await User.destroy({ where: {}, truncate: true });
  });

  // Fecha a conexão para o Jest não ficar pendurado
  afterAll(async () => {
    await connection.close();
  });

  it('Deve criar um usuário e gerar um token válido', async () => {
    // 1. Cria o usuário
    await request(app)
      .post('/v1/user')
      .send({
        firstname: "Tester",
        surname: "Jest",
        email: "test@jest.com",
        password: "password123",
        confirmPassword: "password123"
      });

    // 2. Gera o token
    const response = await request(app)
      .post('/v1/user/token')
      .send({
        email: "test@jest.com",
        password: "password123"
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('Deve barrar acesso a rotas protegidas sem token', async () => {
    const response = await request(app)
      .post('/v1/product')
      .send({ name: "Produto Teste" });
    
    expect(response.status).toBe(400); 
    expect(response.body.error).toBe('Token não enviado');
  });
});