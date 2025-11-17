using Ecommerce.Models;
using Ecommerce.Dtos;
using Ecommerce.Data;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Routes
{
    public static class LoginRoutes
    {
        public static void MapPosLogin(this WebApplication app)
        {
            app.MapPost("/login", async (LoginRequest login, AppDbContext db) =>
            {
                var cliente = await db.Clientes
                    .FirstOrDefaultAsync(c => c.Email == login.Email);

                if(cliente is null)
                    return Results.Unauthorized();
                
                bool senhaOk = BCrypt.Net.BCrypt.Verify(login.Senha, cliente.SenhaHash);

                if(!senhaOk)
                    return Results.Unauthorized();

                var carrinho = await db.Carrinhos
                    .Include(c => c.Itens)
                    .FirstOrDefaultAsync(c => c.ClienteId == cliente.Id);
                
                if(carrinho is null)
                {
                    carrinho = new Carrinho
                    {
                        ClienteId = cliente.Id,
                        Itens = new List<ItemCarrinho>()
                    };

                    db.Carrinhos.Add(carrinho);
                    await db.SaveChangesAsync();
                }

                var primeiroNome = cliente.Nome
                    .Split(' ', StringSplitOptions.RemoveEmptyEntries)
                    .FirstOrDefault() ?? string.Empty;

                var resposta = new
                {
                    Cliente = new
                    {
                        cliente.Id,
                        cliente.Nome,
                        PrimeiroNome = primeiroNome,
                        cliente.Email,
                        cliente.Telefone,
                        cliente.Endereco,
                    },
                    Carrinho = new
                    {
                        carrinho.Id,
                        carrinho.ClienteId,
                        Itens = carrinho.Itens.Select(i => new
                        {
                            i.Id,
                            i.ProdutoId,
                            i.Quantidade,
                            i.PrecoUnitario
                        })
                    }

                };
                return Results.Ok(resposta);
            });
        }
    }
}