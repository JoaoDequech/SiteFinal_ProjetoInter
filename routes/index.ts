import app = require("teem");

//**********************************************************************************
// Se por acaso ocorrer algum problema de conexão, autenticação com o MySQL,
// por favor, execute este código abaixo no MySQL e tente novamente!
//
// ALTER USER 'USUÁRIO'@'localhost' IDENTIFIED WITH mysql_native_password BY 'SENHA';
//
// * Assumindo que o usuário seja root e a senha root, o comando ficaria assim:
//
// ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';
//
//**********************************************************************************

class IndexRoute {
	public async index(req: app.Request, res: app.Response) {
		res.render("index/index");
	}

	public async categorias(req: app.Request, res: app.Response) {
		res.render("index/categorias");
	}

	public async propriedades(req: app.Request, res: app.Response) {
		let lista: any[];

		await app.sql.connect(async (sql) => {

			lista = await sql.query("SELECT p.id, p.nome, p.preco, p.areatotal, p.areaconstruida, p.comodos, p.piscinas, p.vagas, m.nome modalidade FROM propriedades p INNER JOIN modalidade m ON m.idmodalidade = p.idmodalidade ORDER BY p.nome ASC");

		});

		const opcoes = {
			lista: lista
		};

		res.render("index/propriedades", opcoes);
	}

	public async cadastro(req: app.Request, res: app.Response) {
		res.render("index/cadastro");
	}

	public async criar(req: app.Request, res: app.Response) {
		res.render("index/criar");
	}

	async obrigado(req, res) {
        res.render("index/obrigado");
    }

	@app.http.post()
	// Configuração adicional para poder receber FormData e/ou arquivos.
	@app.route.formData()
	public async criarPropriedade(req: app.Request, res: app.Response) {
		// Os dados enviados via POST ficam dentro de req.body
		let propriedade = req.body;

		// É sempre muito importante validar os dados do lado do servidor,
		// mesmo que eles tenham sido validados do lado do cliente!!!
		if (!propriedade) {
			res.status(400);
			res.json("Dados inválidos");
			return;
		}

		if (!propriedade.nome) {
			res.status(400);
			res.json("Nome inválido");
			return;
		}

		propriedade.preco = parseInt(propriedade.preco);
		if (isNaN(propriedade.preco) || propriedade.preco <= 0) {
			res.status(400);
			res.json("Preço inválido");
			return;
		}

		// Verifica se a foto foi enviada
		if (!req.uploadedFiles || !req.uploadedFiles.foto) {
			res.status(400);
			res.json("Preço inválido");
			return;
		}

		await app.sql.connect(async (sql) => {
			await app.fileSystem.saveUploadedFile("public/img/propriedades/" + 1 + ".jpg", req.uploadedFiles.foto);

			// Todas os comandos SQL devem ser executados aqui dentro do app.sql.connect().
			await sql.beginTransaction();

			// As interrogações serão substituídas pelos valores passados ao final, na ordem passada.
			await sql.query("INSERT INTO pessoa (nome, email) VALUES (?, ?)", [propriedade.nome, propriedade.preco]);

			const id: number = await sql.scalar("SELECT last_insert_id()");

			await app.fileSystem.saveUploadedFile("public/img/propriedades/" + id + ".jpg", req.uploadedFiles.foto);

			await sql.commit();
		});

		res.json(true);
	}
}

export = IndexRoute;
