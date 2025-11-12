using Ecommerce.Data;
using Ecommerce.Routes;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontLocal", policy =>
    {
        policy
            .WithOrigins("http://localhost:5039")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// ------------------ Configurações de EF Core ------------------
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=ecommerce.db"));

// ------------------ Swagger ------------------
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseCors("FrontLocal");

app.UseDefaultFiles();
app.UseStaticFiles();

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
}

app.Run();
