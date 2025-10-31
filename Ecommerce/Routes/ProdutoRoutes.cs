using Microsoft.EntityFrameworkCore;
using Ecommerce.Data;
using Ecommerce.Models;

namespace Ecommerce.Routes;

public static class ProdutoRoutes
{
    public static void MapProdutoRoutes(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/produtos");

        group.MapGet("/", async (AppDbContext db) =>
            await db.Produtos.ToListAsync());

        group.MapGet("/{id:int}", async (AppDbContext db, int id) =>
            await db.Produtos.FindAsync(id) is Produto produto
                ? Results.Ok(produto)
                : Results.NotFound());

        group.MapPost("/", async (AppDbContext db, Produto produto) =>
        {
            db.Produtos.Add(produto);
            await db.SaveChangesAsync();
            return Results.Created($"/produtos/{produto.Id}", produto);
        });

        group.MapPut("/{id:int}", async (AppDbContext db, int id, Produto produtoAtualizado) =>
        {
            var produto = await db.Produtos.FindAsync(id);
            if (produto is null) return Results.NotFound();

            produto.Nome = produtoAtualizado.Nome;
            produto.Descricao = produtoAtualizado.Descricao;
            produto.Preco = produtoAtualizado.Preco;
            produto.Estoque = produtoAtualizado.Estoque;
            produto.Categoria = produtoAtualizado.Categoria;

            await db.SaveChangesAsync();
            return Results.Ok(produto);
        });

        group.MapDelete("/{id:int}", async (AppDbContext db, int id) =>
        {
            var produto = await db.Produtos.FindAsync(id);
            if (produto is null) return Results.NotFound();

            db.Produtos.Remove(produto);
            await db.SaveChangesAsync();
            return Results.Ok(produto);
        });
    }
}
