using Ecommerce.Models;

namespace Ecommerce.Data;

public static class DataSeeder
{
    public static void Seed(AppDbContext context)
    {
        var random = new Random();

        // ------------------ PRODUTOS ------------------
        if (!context.Produtos.Any())
        {
            var categorias = new[]
            {
                "Eletrônicos", "Roupas", "Livros", "Brinquedos",
                "Acessórios", "Eletrodomésticos", "Beleza", "Esportes",
                "Informática", "Papelaria"
            };

            int qtdProdutos = random.Next(50, 101);
            var produtos = new List<Produto>();

            for (int i = 1; i <= qtdProdutos; i++)
            {
                var categoria = categorias[random.Next(categorias.Length)];
                produtos.Add(new Produto
                {
                    Nome = $"Produto {i}",
                    Descricao = $"Produto {i} da categoria {categoria}.",
                    Preco = Math.Round((decimal)(random.NextDouble() * 500 + 10), 2),
                    Estoque = random.Next(5, 100),
                    Categoria = categoria
                });
            }

            context.Produtos.AddRange(produtos);
            context.SaveChanges();
        }

        // ------------------ CLIENTES ------------------
        if (!context.Clientes.Any())
        {
            int qtdClientes = random.Next(50, 101);
            var clientes = new List<Cliente>();

            for (int i = 1; i <= qtdClientes; i++)
            {
                clientes.Add(new Cliente
                {
                    Nome = $"Cliente {i}",
                    Email = $"cliente{i}@exemplo.com",
                    Telefone = $"(11) 9{random.Next(100000000, 999999999)}"
                });
            }

            context.Clientes.AddRange(clientes);
            context.SaveChanges();
        }

        // ------------------ CARRINHOS ------------------
        if (!context.Carrinhos.Any())
        {
            var clientes = context.Clientes.ToList();
            var produtos = context.Produtos.ToList();

            foreach (var cliente in clientes)
            {
                var carrinho = new Carrinho
                {
                    ClienteId = cliente.Id,
                    Itens = new List<ItemCarrinho>()
                };

                // Adiciona 1 a 5 produtos aleatórios no carrinho
                int itensNoCarrinho = random.Next(1, 6);
                for (int i = 0; i < itensNoCarrinho; i++)
                {
                    var produto = produtos[random.Next(produtos.Count)];
                    carrinho.Itens.Add(new ItemCarrinho
                    {
                        ProdutoId = produto.Id,
                        Quantidade = random.Next(1, 5)
                    });
                }

                context.Carrinhos.Add(carrinho);
            }

            context.SaveChanges();
        }

        // ------------------ PEDIDOS ------------------
        if (!context.Pedidos.Any())
        {
            var clientes = context.Clientes.ToList();
            var produtos = context.Produtos.ToList();

            foreach (var cliente in clientes.Take(50)) // cria 50 pedidos de teste
            {
                var pedido = new Pedido
                {
                    ClienteId = cliente.Id,
                    Itens = new List<ItemPedido>(),
                    DataPedido = DateTime.Now
                };

                int itensNoPedido = random.Next(1, 6);
                decimal total = 0;

                for (int i = 0; i < itensNoPedido; i++)
                {
                    var produto = produtos[random.Next(produtos.Count)];
                    int quantidade = random.Next(1, 5);

                    pedido.Itens.Add(new ItemPedido
                    {
                        ProdutoId = produto.Id,
                        Quantidade = quantidade,
                        PrecoUnitario = produto.Preco
                    });

                    total += produto.Preco * quantidade;
                }

                pedido.ValorTotal = total;
                context.Pedidos.Add(pedido);
            }

            context.SaveChanges();
        }

        // ------------------ FATURAS ------------------
        if (!context.Faturas.Any())
        {
            var pedidos = context.Pedidos.ToList();
            var meios = new[] { "Cartão", "Pix", "Boleto", "Transferência" };

            foreach (var pedido in pedidos)
            {
                var meio = meios[random.Next(meios.Length)];
                context.Faturas.Add(new Fatura
                {
                    PedidoId = pedido.Id,
                    ValorTotal = pedido.ValorTotal,
                    DataEmissao = pedido.DataPedido.AddMinutes(10),
                    MeioPagamento = meio
                });
            }

            context.SaveChanges();
        }

        // ------------------ STATUS DE ENTREGA ------------------
        if (!context.StatusEntregas.Any())
        {
            var pedidos = context.Pedidos.ToList();
            var statusOptions = new[] { "Pendente", "Em preparo", "Enviado", "Entregue" };

            foreach (var pedido in pedidos)
            {
                var status = statusOptions[random.Next(statusOptions.Length)];
                context.StatusEntregas.Add(new StatusEntrega
                {
                    Status = status,
                    AtualizadoEm = DateTime.Now,
                });
            }

            context.SaveChanges();
        }
    }
}