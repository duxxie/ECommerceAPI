using Ecommerce.Data;
using Ecommerce.Models;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Routes
{
    public static class ItemCarrinhoRoutes
    {
        public static void MapItemCarrinhoRoutes(this WebApplication app)
        {
            var group = app.MapGroup("/itemCarrinho");

            group.MapGet("/", async (AppDbContext db) =>
                await db.ItensCarrinho
                .AsNoTracking()
                .Select(i => new
                {
                    i.Id,
                    i.CarrinhoId,
                    i.Quantidade,
                    i.PrecoUnitario,
                    i.ProdutoId,
                    Produto = new
                    {
                        i.Produto.Nome,
                        i.Produto.Preco,
                    }

                })
                .ToListAsync());

            group.MapGet("/{id:int}", async (int id, AppDbContext db) =>
            {
                var itemCarrinho = await db.ItensCarrinho
                    .AsNoTracking()
                    .Where(i => i.Id == id)
                    .Select(i => new
                    {
                        i.Id,
                        i.CarrinhoId,
                        i.Quantidade,
                        i.PrecoUnitario,
                        i.ProdutoId,
                        Produto = new
                        {
                            i.Produto.Nome,
                            i.Produto.Descricao,
                            i.Produto.Categoria,
                            i.Produto.Preco,
                            i.Produto.Estoque
                        }
                    })
                    .FirstOrDefaultAsync();
                return itemCarrinho is null ? Results.NotFound() : Results.Ok(itemCarrinho);
            });

            group.MapPost("/", async (ItemCarrinho itemCarrinhoCreate, AppDbContext db) =>
            {
                db.ItensCarrinho.Add(itemCarrinhoCreate);
                await db.SaveChangesAsync();
                return Results.Created($"/itemCarrinho/{itemCarrinhoCreate.Id}", itemCarrinhoCreate);
            });

        }
    }
}