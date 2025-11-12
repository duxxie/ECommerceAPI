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
                    Produto = i.Produto == null ? null : new
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
                        Produto = i.Produto == null ? null : new
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
                var produto = await db.Produtos.FirstOrDefaultAsync(p => p.Id == itemCarrinhoCreate.ProdutoId);

                if (produto is null)
                    return Results.BadRequest("Produto não encontrado");

                itemCarrinhoCreate.PrecoUnitario = produto.Preco;
                db.ItensCarrinho.Add(itemCarrinhoCreate);
                await db.SaveChangesAsync();
                return Results.Created($"/itemCarrinho/{itemCarrinhoCreate.Id}", itemCarrinhoCreate);
            });

            group.MapPut("/{id:int}", async (int id, ItemCarrinho itemCarrinhoAtualizado, AppDbContext db) =>
            {
                var itemCarrinho = await db.ItensCarrinho.FirstOrDefaultAsync(i => i.Id == id);

                if (itemCarrinho is null)
                    return Results.NotFound("Item carrinho não encontrado");

                itemCarrinho.Quantidade = itemCarrinhoAtualizado.Quantidade;

                await db.SaveChangesAsync();

                var itemCarrinhoQuery = await db.ItensCarrinho
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
                            i.Produto!.Nome,
                            i.Produto.Descricao,
                            i.Produto.Categoria,
                            i.Produto.Estoque
                        }
                    })
                    .FirstAsync();

                return Results.Ok(itemCarrinhoQuery);
            });

            group.MapDelete("/{id:int}", async (int id, AppDbContext db) =>
            {
                var itemCarrinho = await db.ItensCarrinho.FirstOrDefaultAsync(i => i.Id == id);

                if (itemCarrinho is null)
                    return Results.NotFound("Item carrinho não encontrado");

                db.ItensCarrinho.Remove(itemCarrinho);
                await db.SaveChangesAsync();
                return Results.Ok("Item carrinho removido com sucesso");
            });

        }
    }
}