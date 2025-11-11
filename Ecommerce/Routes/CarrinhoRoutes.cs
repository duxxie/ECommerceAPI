using Ecommerce.Data;
using Ecommerce.Models;
using Ecommerce.DTOs;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Routes
{
    public static class CarrinhoRoutes
    {
        public static void MapCarrinhoRoutes(this WebApplication app)
        {
            var group = app.MapGroup("/carrinhos");


            group.MapGet("/", async (AppDbContext db) =>
                await db.Carrinhos
                    .AsNoTracking()
                    .Select(c => new
                    {
                        c.Id,
                        c.ClienteId,
                        Total = c.Itens.Sum(i => (decimal?)(i.Quantidade * i.PrecoUnitario)) ?? 0m,
                        TotalItens = c.Itens.Sum(i => (int?)i.Quantidade) ?? 0,
                        Itens = c.Itens.Select(i => new
                        {
                            i.Id,
                            i.CarrinhoId,
                            i.ProdutoId,
                            i.Quantidade,
                            i.PrecoUnitario
                        })
                    })
                    .ToListAsync()
                );

          
            group.MapGet("/{carrinhoId:int}", async (int carrinhoId, AppDbContext db) =>
            {
                var carrinho = await db.Carrinhos
                    .AsNoTracking()
                    .Where(c => c.Id == carrinhoId)
                    .Select(c => new
                    {
                        c.Id,
                        Total = c.Itens.Sum(i => (decimal?)(i.Quantidade * i.PrecoUnitario)) ?? 0m,
                        TotalItens = c.Itens.Sum(i => (int?)i.Quantidade) ?? 0,
                        Itens = c.Itens.Select(i => new
                        {
                            i.Id,
                            i.CarrinhoId,
                            i.ProdutoId,
                            i.Quantidade,
                            i.PrecoUnitario
                        }),
                        c.ClienteId,
                        Cliente = c.Cliente == null ? null : new
                        {
                            c.Cliente.Nome,
                            c.Cliente.Email,
                            c.Cliente.Telefone
                        }
                    })
                    .FirstOrDefaultAsync();
                return carrinho is null ? Results.NotFound() : Results.Ok(carrinho);
                                
            });

            
            group.MapPost("/", async (AppDbContext db, Carrinho carrinhoCreate) =>
            {
                var clienteExiste = await db.Clientes.AnyAsync(c => c.Id == carrinhoCreate.ClienteId);
                if (!clienteExiste)
                    return Results.BadRequest("Cliente não encontrado.");

                var carrinho = new Carrinho
                {
                    ClienteId = carrinhoCreate.ClienteId,
                };

                db.Carrinhos.Add(carrinho);
                await db.SaveChangesAsync();

                return Results.Created($"/carrinhos/{carrinho.Id}", carrinho);
            });

            group.MapDelete("/{id:int}", async (int id, AppDbContext db) =>
            {
                var carrinho = await db.Carrinhos.FindAsync(id);
                if (carrinho is null)
                    return Results.NotFound();

                db.Carrinhos.Remove(carrinho);
                await db.SaveChangesAsync();

                return Results.NoContent();
            });
        }
    }
}
