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
                await db.Clientes.ToListAsync());

            group.MapGet("/{id:int}", async (int id, AppDbContext db) =>
                await db.Clientes.Include(c => c.Carrinhos).FirstOrDefaultAsync(c => c.Id == id)
                    is Cliente cliente ? Results.Ok(cliente) : Results.NotFound());

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
                return Results.NoContent();
            });
        }
    }
}
