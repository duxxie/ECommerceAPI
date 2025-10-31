using Microsoft.EntityFrameworkCore;
using Ecommerce.Data;
using Ecommerce.Models;

namespace Ecommerce.Routes;

public static class ClienteRoutes
{
    public static void MapClienteRoutes(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/clientes");

        group.MapGet("/", async (AppDbContext db) =>
            await db.Clientes.ToListAsync());

        group.MapGet("/{id:int}", async (AppDbContext db, int id) =>
            await db.Clientes.FindAsync(id) is Cliente cliente
                ? Results.Ok(cliente)
                : Results.NotFound());

        group.MapPost("/", async (AppDbContext db, Cliente cliente) =>
        {
            db.Clientes.Add(cliente);
            await db.SaveChangesAsync();
            return Results.Created($"/clientes/{cliente.Id}", cliente);
        });

        group.MapDelete("/{id:int}", async (AppDbContext db, int id) =>
        {
            var cliente = await db.Clientes.FindAsync(id);
            if (cliente is null) return Results.NotFound();
            db.Clientes.Remove(cliente);
            await db.SaveChangesAsync();
            return Results.Ok(cliente);
        });
    }
}
