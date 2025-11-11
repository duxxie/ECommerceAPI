using Ecommerce.Data;
using Ecommerce.Routes;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// ------------------ Configurações de EF Core ------------------
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=ecommerce.db"));

// ------------------ Configurações de JSON para evitar ciclos ------------------
// builder.Services.AddControllers().AddJsonOptions(options =>
// {
//     options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
//     options.JsonSerializerOptions.WriteIndented = true;
// });

// ------------------ Swagger ------------------
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// ------------------ Middleware ------------------
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
//app.UseAuthorization();

// ------------------ Mapear rotas ------------------
app.MapProdutoRoutes();
app.MapClienteRoutes();
app.MapCarrinhoRoutes();
app.MapItemCarrinhoRoutes();
app.MapPedidoRoutes();
app.MapFaturaRoutes();

// ------------------ Seed do banco ------------------
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate(); // cria o banco se não existir
    //DataSeeder.Seed(db);
}

app.Run();
