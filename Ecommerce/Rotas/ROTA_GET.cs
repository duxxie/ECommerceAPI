using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

public static class ROTA_GET
{
    public static void MapGetRoutes(this WebApplication app)
    {
        app.MapGet("/produtos", async (int id, ProdutoContext context) =>
        {
            var produtos = await context.Produtos.ToListAsync();

            return Results.Ok(produtos);
        });

        app.MapGet("/produtos/{id}", async (int id, ProdutoContext context) =>
        {
            var produto = await context.Produtos.FindAsync(id);

            return produto is not null ? Results.Ok(produto) : Results.NotFound();
        });
    }
}