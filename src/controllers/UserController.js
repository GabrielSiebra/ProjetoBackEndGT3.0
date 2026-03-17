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
}

module.exports = new UserController();