using Ecommerce.Data;
using Ecommerce.Routes;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// ------------------ Configurações do Render ------------------
builder.WebHost.UseUrls("http://0.0.0.0:8080");

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
// Original
// if (app.Environment.IsDevelopment())
// {
//     app.UseSwagger();
//     app.UseSwaggerUI();
// }

// Ativa o Swagger em qualquer ambiente (Production incluído)
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Ecommerce API");
    c.RoutePrefix = string.Empty; // Isso faz o Swagger abrir na raiz (url.onrender.com/)
});

app.UseHttpsRedirection();
//app.UseAuthorization();

// ------------------ Mapear rotas ------------------
app.MapProdutoRoutes();
app.MapClienteRoutes();
app.MapCarrinhoRoutes();
app.MapItemCarrinhoRoutes();
app.MapPedidoRoutes();
app.MapFaturaRoutes();
app.MapPosLogin();

// ------------------ Seed do banco ------------------
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate(); // cria o banco se não existir
}

app.Run();
