using Microsoft.EntityFrameworkCore;
using Ecommerce.Data;
using Ecommerce.Routes;

var builder = WebApplication.CreateBuilder(args);

// Banco de dados SQLite
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=vendas.db"));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Swagger
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Registrar endpoints
app.MapProdutoRoutes();
app.MapClienteRoutes();
app.MapPedidoRoutes();
app.MapCarrinhoRoutes();

app.Run();
