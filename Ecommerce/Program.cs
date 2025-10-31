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

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated(); // cria o banco se não existir
    DataSeeder.Seed(db); // popula os dados iniciais
}

app.Run();
