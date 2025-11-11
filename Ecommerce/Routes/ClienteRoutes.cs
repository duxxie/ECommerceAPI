using Ecommerce.Data;
using Ecommerce.Models;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;

namespace Ecommerce.Routes
{
    public static class ClienteRoutes
    {
        public static void MapClienteRoutes(this WebApplication app)
        {
            var group = app.MapGroup("/clientes");

            group.MapGet("/", async (AppDbContext db) =>
                await db.Clientes
                    .AsNoTracking()
                    .Select(c => new
                    {
                        c.Id,
                        c.Nome,
                        c.Email,
                        c.Telefone,
                        Carrinho = c.Carrinho == null ? null : new
                        {
                            c.Carrinho.Id,
                            c.Carrinho.ClienteId,
                            Total = c.Carrinho.Itens.Sum(i => (decimal?)(i.Quantidade * i.PrecoUnitario)) ?? 0m,
                            TotalItens = c.Carrinho.Itens.Sum(i => (int?) i.Quantidade) ?? 0,

                            Itens = c.Carrinho.Itens.Select(i => new
                            {
                                i.Id,
                                i.ProdutoId,
                                i.Quantidade,
                                i.PrecoUnitario,
                            })
                        },
                    })
                    .ToListAsync()
                );

            group.MapGet("/{id:int}", async (int id, AppDbContext db) =>
            {
                var cliente = await db.Clientes
                    .AsNoTracking()
                    .Where(c => c.Id == id)
                    .Select(c => new
                    {
                        c.Id,
                        c.Nome,
                        c.Email,
                        c.Senha,
                        c.SenhaHash,
                        c.Telefone,
                        c.Endereco,
                        Carrinho = c.Carrinho == null ? null : new
                        {
                            c.Carrinho.Id,
                            c.Carrinho.ClienteId,
                            Total = c.Carrinho.Itens.Sum(i => (decimal?)(i.Quantidade * i.PrecoUnitario)) ?? 0m,
                            TotalItens = c.Carrinho.Itens.Sum(i => (int?)i.Quantidade) ?? 0,

                            Itens = c.Carrinho.Itens.Select(i => new
                            {
                                i.Id,
                                i.CarrinhoId,
                                i.ProdutoId,
                                i.Quantidade,
                                i.PrecoUnitario,
                                Produto = i.Produto == null ? null : new
                                {
                                    i.ProdutoId,
                                    i.Produto.Nome,
                                    i.Produto.Descricao,
                                    i.Produto.Preco
                                }
                            })
                        },
                        Pedidos = c.Pedidos.Select(p => new
                        {
                            p.Id,
                            p.DataPedido,
                            Itens = p.Itens.Select(i => new
                            {
                                i.Id,
                                i.ProdutoId,
                                i.Quantidade,
                                i.PrecoUnitario
                            }),
                            Fatura = p.Fatura == null ? null : new
                            {
                                p.Fatura.Id,
                                p.Fatura.DataEmissao,
                                p.Fatura.ValorTotal,
                                p.Fatura.MeioPagamento,
                                p.Fatura.Pago
                            }
                        })
                    })
                    .FirstOrDefaultAsync();
                return cliente is null ? Results.NotFound("Cliente não encontrado") : Results.Ok(cliente);
            });

            group.MapPost("/", async (Cliente cliente, AppDbContext db) =>
            {
                var senhaHash = BCrypt.Net.BCrypt.HashPassword(cliente.Senha);
                cliente.SenhaHash = senhaHash;

                db.Clientes.Add(cliente);
                await db.SaveChangesAsync();
                return Results.Created($"/clientes/{cliente.Id}", cliente);
            });

            group.MapPut("/{id:int}", async (int id, Cliente clienteAtualizado, AppDbContext db) =>
            {
                var cliente = await db.Clientes.FirstOrDefaultAsync(c => c.Id == id);
                if (cliente is null)
                    return Results.NotFound("Cliente não encontrado");

                cliente.Nome = clienteAtualizado.Nome;
                cliente.Email = clienteAtualizado.Email;
                cliente.Telefone = clienteAtualizado.Telefone;
                cliente.Endereco = clienteAtualizado.Endereco;

                await db.SaveChangesAsync();
                return Results.Ok(cliente);
            }); 


            group.MapDelete("/{id:int}", async (int id, AppDbContext db) =>
            {
                var cliente = await db.Clientes.FindAsync(id);
                if (cliente is null) return Results.NotFound("Cliente não encontrado");

                db.Clientes.Remove(cliente);
                await db.SaveChangesAsync();
                return Results.Ok("Cliente removido com sucesso.");
            });
        }
    }
}
