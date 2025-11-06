using Ecommerce.Data;
using Ecommerce.Models;
using Microsoft.EntityFrameworkCore;

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
                                i.CarrinhoId,
                                i.ProdutoId,
                                i.Quantidade,
                                i.PrecoUnitario,
                                Produto = new
                                {
                                    i.ProdutoId,
                                    i.Produto.Nome,
                                    i.Produto.Descricao,
                                    i.Produto.Preco
                                }
                            })
                        }
                    })
                    .FirstOrDefaultAsync();
                return cliente is null ? Results.NotFound() : Results.Ok(cliente);
            });

            group.MapPost("/", async (Cliente cliente, AppDbContext db) =>
            {
                db.Clientes.Add(cliente);
                await db.SaveChangesAsync();
                return Results.Created($"/clientes/{cliente.Id}", cliente);
            });

            group.MapDelete("/{id:int}", async (int id, AppDbContext db) =>
            {
                var cliente = await db.Clientes.FindAsync(id);
                if (cliente is null) return Results.NotFound();

                db.Clientes.Remove(cliente);
                await db.SaveChangesAsync();
                return Results.Ok("Cliente removido com sucesso.");
            });
        }
    }
}
