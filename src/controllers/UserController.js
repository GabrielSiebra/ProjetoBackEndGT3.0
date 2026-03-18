const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

class UserController {
  async create(req, res) {
    try {
      // Recebe os dados do payload
      const { firstname, surname, email, password, confirmPassword } = req.body;

      // Validação básica dos campos
      if (!firstname || !surname || !email || !password || !confirmPassword) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' }); // Status 400
      }

      // Validação da senha
      if (password !== confirmPassword) {
        return res.status(400).json({ error: 'As senhas não coincidem' }); // Status 400
      }

      // Verifica se o e-mail já existe no banco
      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        return res.status(400).json({ error: 'E-mail já cadastrado' }); // Status 400
      }

      // Cria o usuário no banco de dados (o hash da senha será feito automaticamente pelo hook no Model que criamos antes)
      const user = await User.create({
        firstname,
        surname,
        email,
        password,
      });

      // Retorna sucesso sem exibir a senha no response
      return res.status(201).json({ // Status 201
        id: user.id,
        firstname: user.firstname,
        surname: user.surname,
        email: user.email
      });

    } catch (error) {
      return res.status(400).json({ error: 'Erro ao criar usuário', details: error.message });
    }
  }
  async getById(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id, {
        attributes: ['id', 'firstname', 'surname', 'email'] // Retorna apenas o que o escopo pede
      });

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' }); // Status 404
      }

      return res.status(200).json(user); // Status 200 OK
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao buscar usuário' });
    }
  }
  async update(req, res) {
    try {
      const { id } = req.params;
      const { firstname, surname, email } = req.body;

      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' }); // Status 404
      }

      await user.update({ firstname, surname, email });

      return res.status(204).send(); // Status 204 No Content para PUT bem sucedido
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao atualizar usuário' }); // Status 400
    }
  }
  async delete(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' }); // Status 404
      }

      await user.destroy();

      return res.status(204).send(); // Status 204 No Content para DELETE
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao deletar usuário' });
    }
  }
  async generateToken(req, res) {
  try {
    const { email, password } = req.body;

    // Busca o usuário pelo e-mail
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ error: 'E-mail ou senha incorretos' });
    }

    // Compara a senha enviada com o hash do banco
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ error: 'E-mail ou senha incorretos' });
    }

    // Gera o token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );

    return res.status(200).json({ token });
  } catch (error) {
    return res.status(400).json({ error: 'Erro ao gerar token' });
  }
}
}

module.exports = new UserController();