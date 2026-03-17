require('dotenv').config(); 
const app = require('./app');

// Aqui estava require('./database'), mude para require('./models')
require('./models'); 

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});